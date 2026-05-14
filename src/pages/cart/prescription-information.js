/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import { View, ScrollView, Text, Picker } from '@tarojs/components'
import api from '@/api'
import doc from '@/doc'
import { SpImage, SpPage, SpCheckbox, SpTradeItem, SpCell } from '@/components'
import { useImmer } from 'use-immer'
import { AtTag, AtTextarea, AtButton } from 'taro-ui'
import { classNames, isWeixin, showToast, pickBy } from '@/utils'
import { useTranslation, $t, ti } from '@/i18n'
import { P_YES, P_NO, P_SELECT, P_MALE, P_FEMALE } from '@/subpages/prescription/i18n-keys'
import { getRelationshipOptions } from '@/subpages/prescription/relationship-options'
import CompMedicationPersonnel from './comps/comp-medication-personnel'
import './prescription-information.scss'

const PRESCRIPTION_ORDER_RANDOM = '1223344'

function buildNotesList($t) {
  const yes = $t(P_YES)
  const no = $t(P_NO)
  const pls = $t(P_SELECT)
  return [
    {
      title: $t('cb825098.bbc0ed'),
      selector: [
        { key: 0, value: no },
        { key: 1, value: yes }
      ],
      selectorChecked: pls,
      key: 'before_ai_result_used_medicine',
      value: null
    },
    {
      title: $t('cb825098.c57c4d'),
      selector: [
        { key: 0, value: no },
        { key: 1, value: yes }
      ],
      selectorChecked: pls,
      key: 'before_ai_result_body_abnormal',
      value: null
    },
    {
      title: $t('cb825098.ff5917'),
      selector: [
        { key: 0, value: no },
        { key: 1, value: yes }
      ],
      selectorChecked: pls,
      key: 'is_pregnant_woman',
      value: null
    },
    {
      title: $t('cb825098.b436e8'),
      selector: [
        { key: 0, value: no },
        { key: 1, value: yes }
      ],
      selectorChecked: pls,
      key: 'is_lactation',
      value: null
    },
    {
      title: $t('cb825098.88f3a1'),
      selector: [
        { key: 0, value: no },
        { key: 1, value: yes }
      ],
      selectorChecked: pls,
      key: 'before_ai_result_allergy_history',
      value: null
    }
  ]
}

function syncNotesListI18n(prev, $t) {
  if (!prev?.length) return buildNotesList($t)
  const tmpl = buildNotesList($t)
  return tmpl.map((t, i) => {
    const value = prev[i]?.value ?? null
    const yes = $t(P_YES)
    const no = $t(P_NO)
    const pls = $t(P_SELECT)
    let selectorChecked = pls
    if (value === 1) selectorChecked = yes
    if (value === 0) selectorChecked = no
    return { ...t, value, selectorChecked }
  })
}

const initialStateBase = {
  isOpened: false,
  param: {
    page: 1,
    pageSize: 10
  },
  medicationList: [],
  risk: false,
  listProduct: [],
  before_ai_result_allergy_history: '',
  orderInfo: null,
  medicationIindex: 0
}

function PrescriptionPnformation() {
  const { i18n } = useTranslation()
  const [state, setState] = useImmer(() => ({
    ...initialStateBase,
    notesList: buildNotesList($t),
    selector: getRelationshipOptions($t)
  }))

  const {
    notesList,
    isOpened,
    param,
    medicationList,
    selector,
    risk,
    listProduct,
    before_ai_result_allergy_history,
    orderInfo,
    medicationIindex
  } = state

  const router = useRouter()

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('33ac3f13.a904ff') })
    const onLang = () => Taro.setNavigationBarTitle({ title: $t('33ac3f13.a904ff') })
    i18n.on('languageChanged', onLang)
    return () => i18n.off('languageChanged', onLang)
  }, [i18n])

  useEffect(() => {
    setState((draft) => {
      draft.notesList = syncNotesListI18n(draft.notesList, $t)
      draft.selector = getRelationshipOptions($t)
    })
  }, [i18n.language])

  useDidShow(() => {
    medicationPersonnel()
    fetch()
  })

  const fetch = async () => {
    const { order_id } = router?.params
    const { orderInfo } = await api.trade.detail(order_id, {
      prescription_order_random: PRESCRIPTION_ORDER_RANDOM
    })
    const _orderInfo = pickBy(orderInfo, doc.trade.TRADE_ITEM)
    let list = _orderInfo.items.filter((item) => item.isPrescription == 1)
    console.log(list, 'lllllllllfetch')

    setState((draft) => {
      draft.listProduct = list
      draft.orderInfo = _orderInfo
    })
  }

  const handleClickToEdit = async () => {
    const { order_id } = router?.params

    const haslistProduct = listProduct.some((item) => {
      const medicineSymptomSetNew = item.medicineSymptomSetNew
      console.log(medicineSymptomSetNew, 'medicineSymptomSetNew')

      if (medicineSymptomSetNew == undefined || medicineSymptomSetNew.length === 0) {
        showToast(ti('cb825098.b7c22b', [item.itemName]))
        return true
      }
      return false
    })

    if (haslistProduct) {
      return
    }

    const hasEmptyValue = notesList.some((item) => {
      if (item.value === null) {
        showToast(ti('cb825098.a5db4e', [item.title]))
        return true
      }
      return false
    })

    if (hasEmptyValue) {
      return
    }

    let param = {
      order_id,
      medication_personnel_id: medicationList.filter((item) => item.isShow == true)?.[0]?.id,
      third_return_url: `/subpages/trade/detail?order_id=${order_id}`,
      souce_from: isWeixin ? 0 : 2,
      before_ai_result_symptom: [],
      distributor_id: orderInfo.distributorId,
      prescription_order_random: PRESCRIPTION_ORDER_RANDOM
    }
    listProduct.forEach((item) => {
      param.before_ai_result_symptom.push({
        id: item.id,
        value: item.medicineSymptomSetNew
      })
    })
    notesList.forEach((item) => {
      param[item.key] = item.value
    })

    if (!param.medication_personnel_id) {
      showToast($t('cb825098.6e20d1'))
      return
    }

    if (param.before_ai_result_allergy_history == 1) {
      if (before_ai_result_allergy_history == '') {
        showToast($t('cb825098.bcb6c9'))
        return
      }
    }
    param.before_ai_result_allergy_history =
      param.before_ai_result_allergy_history == 1 ? before_ai_result_allergy_history : ''

    let res = await api.prescriptionDrug.prescriptionDiagnosis(param)
    showToast($t('cb825098.23b62e'))
    const webviewSrc = encodeURIComponent(res.url)
    Taro.redirectTo({
      url: `/pages/webview?url=${webviewSrc}`
    })
  }

  const medicationPersonnel = async () => {
    const res = await api.prescriptionDrug.medicationPersonnelList({ ...param })
    res.list.forEach((element) => {
      element.relationship = Number(element.relationship) - 1
    })
    res.list[0].isShow = true
    res.list.forEach((item, index) => {
      item.isShow = index == 0
    })
    setState((draft) => {
      draft.medicationList = res.list
    })
  }

  const pickerChange = (e, index) => {
    let notesList1 = JSON.parse(JSON.stringify(notesList))
    notesList1[index].selectorChecked = notesList1[index].selector[e.detail.value].value
    notesList1[index].value = notesList1[index].selector[e.detail.value].key
    setState((draft) => {
      draft.notesList = notesList1
    })
  }

  const colsePersonnel = () => {
    setState((draft) => {
      draft.isOpened = !isOpened
    })
  }

  const listChangge = (val) => {
    let res = JSON.parse(JSON.stringify(val))
    if (res[medicationIindex] !== undefined && res[medicationIindex] !== null) {
      res[medicationIindex].isShow = true
    } else if (val.length > 0) {
      res[0].isShow = true
    }
    setState((draft) => {
      draft.medicationList = res
    })
  }

  const pitchOn = (index) => {
    let list = JSON.parse(JSON.stringify(medicationList))
    list.forEach((item, i) => {
      item.isShow = i == index
    })
    setState((draft) => {
      draft.medicationList = list
      draft.medicationIindex = index
    })
  }

  const onClickItem = ({ itemId, distributorId }) => {
    Taro.navigateTo({
      url: `/subpages/item/espier-detail?id=${itemId}&dtid=${distributorId}`
    })
  }

  const onClickTag = (item1, index, index1) => {
    let listProduct1 = JSON.parse(JSON.stringify(listProduct))
    listProduct1[index].medicineSymptomSet[index1].show =
      !listProduct1[index].medicineSymptomSet[index1].show
    let filteredItems = listProduct1[index].medicineSymptomSet.filter((item) => item.show === true)
    listProduct1[index].medicineSymptomSetNew = filteredItems.map((item) => item.value)
    setState((draft) => {
      draft.listProduct = listProduct1
    })
  }

  return (
    <SpPage
      className='prescription-information'
      renderFooter={
        <View className='btn-wrap'>
          <AtButton circle type='primary' onClick={handleClickToEdit} disabled={!risk}>
            {$t('cb825098.cbd0c0')}
          </AtButton>
        </View>
      }
    >
      <View className='information'>
        <View className='title'>
          <Text className='title-num'>1</Text>
          <Text className='title-text'>{$t('cb825098.5b6e02')}</Text>
        </View>
        <View className='titled'>-----</View>
        <View className='titled'>
          <Text className='titled-num'>2</Text>
          <Text>{$t('cb825098.6b871f')}</Text>
        </View>
        <View className='titled'>-----</View>
        <View className='titled'>
          <Text className='titled-num'>3</Text>
          <Text>{$t('cb825098.6536f5')}</Text>
        </View>
      </View>

      <View className='prompt'>{$t('cb825098.c6cf51')}</View>

      <View className='medication'>
        <View className='personnel'>
          <View className='personnel-title'>
            <Text className='sp-cell__xin'>* </Text>
            {$t('cb825098.529711')}
          </View>
          <View className='personnel-name' onClick={colsePersonnel}>
            <Text className='iconfont icon-bianji1'></Text>
            {$t('cb825098.e4707e')}
          </View>
        </View>
        <View className='prompt'>{$t('cb825098.35550d')}</View>
        <ScrollView scrollX>
          <View className='relationship'>
            {medicationList.map((item, index) => {
              return (
                <View
                  className={classNames(
                    'relationship-wrap',
                    item.isShow ? 'relationship-wraps' : null
                  )}
                  key={index}
                  onClick={() => pitchOn(index)}
                >
                  <SpImage
                    src={
                      item.user_family_gender == 1
                        ? item.user_family_age >= 18
                          ? 'men.png'
                          : 'children_1.png'
                        : item.user_family_age >= 18
                        ? 'women.png'
                        : 'children_2.png'
                    }
                    width={80}
                  />
                  <View className='relationship-wrap-right'>
                    <View className='name'>{item.user_family_name}</View>
                    <View className='age'>
                      {item.user_family_gender == 1 ? $t(P_MALE) : $t(P_FEMALE)}{' '}
                      {item.user_family_age}
                    </View>
                  </View>
                  <View className='label'>{selector[item.relationship].value}</View>
                </View>
              )
            })}
          </View>
        </ScrollView>
      </View>

      <View className='medication1'>
        <View className='personnel'>
          <Text>
            {' '}
            <Text className='sp-cell__xin'>* </Text>
            {$t('cb825098.04e88e')}
          </Text>
          <Text className='personnel-title'>{$t('cb825098.3b964f')}</Text>
        </View>
        {listProduct.map((item, index) => {
          return (
            <View className='medicine' key={index}>
              <SpTradeItem
                info={{
                  ...item
                }}
                onClick={onClickItem}
              />
              <View className='medicine-bot'>
                {item.medicineSymptomSet.map((item1, index1) => {
                  return (
                    <AtTag
                      type='primary'
                      circle
                      active={item1.show}
                      className='medicine-bot-name'
                      key={index1}
                      onClick={() => onClickTag(item1, index, index1)}
                    >
                      {item1.value}
                    </AtTag>
                  )
                })}
              </View>
            </View>
          )
        })}
      </View>

      <View className='notes'>
        {notesList.map((item, index) => {
          return (
            <Picker
              mode='selector'
              range={item.selector}
              rangeKey='value'
              key={index}
              onChange={(e) => pickerChange(e, index)}
            >
              <SpCell
                className='logistics-no province border-bottom'
                title={item.title}
                isLink
                arrow
                certainly
              >
                <View className='picker'>{item.selectorChecked}</View>
              </SpCell>
            </Picker>
          )
        })}
        {notesList[4].value == 1 && (
          <View className='notes-textarea'>
            <Text className='allergy'>
              <Text className='sp-cell__xin'>* </Text>
              {$t('cb825098.920b94')}
            </Text>
            <AtTextarea
              value={before_ai_result_allergy_history}
              maxLength={200}
              placeholder={$t('cb825098.dd0a37')}
              onChange={(e) => {
                setState((draft) => {
                  draft.before_ai_result_allergy_history = e
                })
              }}
            />
          </View>
        )}
      </View>

      <View className='informed'>
        <SpCheckbox
          checked={risk}
          onChange={() => {
            setState((draft) => {
              draft.risk = !risk
            })
          }}
        />
        <View className='informed-notice'>
          {$t('cb825098.fd6744')}
          <Text
            className='informed-title'
            onClick={() => {
              Taro.navigateTo({
                url: '/subpages/auth/reg-rule?type=ehospital_risk_informed'
              })
            }}
          >
            {$t('cb825098.a64c98')}
          </Text>
        </View>
      </View>

      {isOpened && (
        <CompMedicationPersonnel
          isOpened={isOpened}
          colsePersonnel={colsePersonnel}
          listChangge={listChangge}
        />
      )}
    </SpPage>
  )
}

export default PrescriptionPnformation
