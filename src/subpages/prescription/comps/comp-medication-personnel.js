/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef } from 'react'
import Taro from '@tarojs/taro'
import { useImmer } from 'use-immer'
import { SpImage, SpScrollView } from '@/components'
import { AtFloatLayout, AtButton } from 'taro-ui'
import { View, Text } from '@tarojs/components'
import api from '@/api'
import { showToast } from '@/utils'
import { useTranslation, $t, ti } from '@/i18n'
import { P_MALE, P_FEMALE, P_YEARS_OLD } from '../i18n-keys'
import { getRelationshipOptions } from '../relationship-options'
import './comp-medication-personnel.scss'

function CompMedicationPersonnel(props) {
  const { i18n } = useTranslation()
  const { isOpened = false, colsePersonnel = () => {}, listChangge = () => {} } = props

  const [state, setState] = useImmer(() => ({
    list: [],
    selector: getRelationshipOptions($t)
  }))
  const goodsRef = useRef()

  const { list, selector } = state

  useEffect(() => {
    setState((draft) => {
      draft.selector = getRelationshipOptions($t)
    })
  }, [i18n.language])

  const fetch = async ({ pageIndex, pageSize }) => {
    const params = {
      page: pageIndex,
      pageSize
    }
    const { total_count: total, list: list1 } = await api.prescriptionDrug.medicationPersonnelList(
      params
    )
    list1.forEach((element) => {
      element.relationship = Number(element.relationship) - 1
      element.isShow = false
    })
    listChangge([...list, ...list1])
    setState((draft) => {
      draft.list = [...list, ...list1]
    })
    return {
      total
    }
  }

  const deletePersonnel = async (item) => {
    await api.prescriptionDrug.deleteMedicationPersonnel({ id: item.id })
    setState((draft) => {
      draft.list = []
    })
    showToast($t('a57f17cb.0007d1'))
    goodsRef.current.reset()
  }

  return (
    <View className='comp-medication-personnel'>
      <AtFloatLayout isOpened={isOpened} onClose={colsePersonnel}>
        <View>
          <View className='title'>
            <View className='title-text'>{$t('a57f17cb.e9ec6f')}</View>
            <Text className='iconfont icon-guanbi-01' onClick={colsePersonnel}></Text>
          </View>
          <View className='prompt'>
            <Text className='iconfont icon-bg-security'></Text>
            {$t('a57f17cb.7575f5')}
          </View>
          <SpScrollView className='informations' ref={goodsRef} fetch={fetch}>
            {list.length > 0 &&
              list.map((item, index) => {
                return (
                  <View className='informations-item' key={index}>
                    <View className='label'>
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
                      <View className='info'>
                        <View>
                          <Text>{item.user_family_name}</Text>
                          <Text className='relationship'>{selector[item.relationship].value}</Text>
                        </View>
                        <View className='age'>
                          {item.user_family_gender == 1 ? $t(P_MALE) : $t(P_FEMALE)}{' '}
                          {ti(P_YEARS_OLD, [item.user_family_age])}
                        </View>
                      </View>
                    </View>
                    <View className='icon-wrap'>
                      <Text
                        className='iconfont icon-bianji1'
                        onClick={() => {
                          Taro.navigateTo({
                            url: `/subpages/prescription/add-personnel?id=${item.id}`
                          })
                          colsePersonnel()
                        }}
                      ></Text>
                      <Text
                        className='iconfont icon-shanchu'
                        onClick={() => deletePersonnel(item)}
                      ></Text>
                    </View>
                  </View>
                )
              })}
          </SpScrollView>

          <View className='btn-wrap'>
            <AtButton
              circle
              type='primary'
              onClick={() => {
                Taro.navigateTo({
                  url: '/subpages/prescription/add-personnel'
                })
                colsePersonnel()
              }}
            >
              {$t('a57f17cb.ae3786')}
            </AtButton>
          </View>
        </View>
      </AtFloatLayout>
    </View>
  )
}

CompMedicationPersonnel.options = {
  addGlobalClass: true
}

export default CompMedicationPersonnel
