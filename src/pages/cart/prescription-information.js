import React, { useEffect, useRef } from 'react'
import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import { View, ScrollView, Text, Picker, WebView } from '@tarojs/components'
import api from '@/api'
import doc from '@/doc'
import { SpImage, SpPage, SpCheckbox, SpTradeItem, SpCell } from '@/components'
import { useImmer } from 'use-immer'
import { relationship } from '@/consts'
import { AtTag, AtList, AtListItem, AtTextarea, AtButton } from 'taro-ui'
import CompMedicationPersonnel from './comps/comp-medication-personnel'
import { classNames, isWeixin, showToast, pickBy } from '@/utils'

import './prescription-information.scss'


const initialState = {
  notesList: [
    {
      title: '是否使用过此类药物',
      selector: [{
        key: 0,
        value: '否'
      }, {
        key: 1,
        value: '是'
      }],
      selectorChecked: '请选择',
      key: 'before_ai_result_used_medicine',
      value: null
    },
    {
      title: '肝肾功能是否有异常',
      selector: [{
        key: 0,
        value: '否'
      }, {
        key: 1,
        value: '是'
      }],
      selectorChecked: '请选择',
      key: 'before_ai_result_body_abnormal',
      value: null
    },
    {
      title: '用药人是否孕妇',
      selector: [{
        key: 0,
        value: '否'
      }, {
        key: 1,
        value: '是'
      }],
      selectorChecked: '请选择',
      key: 'is_pregnant_woman',
      value: null
    },
    {
      title: '用药人是否哺乳期',
      selector: [{
        key: 0,
        value: '否'
      }, {
        key: 1,
        value: '是'
      }],
      selectorChecked: '请选择',
      key: 'is_lactation',
      value: null
    }, {
      title: '是否有药物过敏史',
      selector: [{
        key: 0,
        value: '否'
      }, {
        key: 1,
        value: '是'
      }],
      selectorChecked: '请选择',
      key: 'before_ai_result_allergy_history',
      value: null
    }
  ],
  isOpened: false,
  param: {
    page: 1,
    pageSize: 10
  },
  medicationList: [],
  selector: relationship,
  risk: false,
  listProduct: [],
  before_ai_result_allergy_history: "",
  orderInfo: null
}


function PrescriptionPnformation() {
  const [state, setState] = useImmer(initialState)

  const {
    notesList,
    isOpened,
    param,
    medicationList,
    selector,
    risk,
    listProduct,
    before_ai_result_allergy_history,
    orderInfo
  } = state

  const router = useRouter()



  // useDidShow(() => {
  //   //获取列表
  //   medicationPersonnel()
  // }, [])

  //获取列表
  useDidShow(() => {
    medicationPersonnel()
    fetch()
  })

  const fetch = async () => {
    const { order_id } = router.params
    const { orderInfo } = await api.trade.detail(order_id)
    const _orderInfo = pickBy(orderInfo, doc.trade.TRADE_ITEM)
    let list = _orderInfo.items.filter(item => item.isPrescription == 1);
    console.log(list, 'lllllllllfetch');

    setState(draft => {
      draft.listProduct = list,
        draft.orderInfo = _orderInfo
    })
  }

  const handleClickToEdit = async () => {
    const { order_id } = router.params

    //判断确诊疾病是否为空
    const haslistProduct = listProduct.some(item => {
      const medicineSymptomSetNew = item.medicineSymptomSetNew;
      console.log(medicineSymptomSetNew, 'medicineSymptomSetNew');

      if (medicineSymptomSetNew == undefined || medicineSymptomSetNew.length === 0) {
        showToast(`${item.itemName}请选择线下已确诊的疾病`);
        return true;
      }
      return false;
    });

    if (haslistProduct) {
      return;
    }

    //判断自身情况
    const hasEmptyValue = notesList.some(item => {
      if (item.value === null) {
        showToast(`请选择${item.title}`);
        return true;
      }
      return false;
    });

    // 如果有空的 value，则不执行下面的代码
    if (hasEmptyValue) {
      return;
    }

    let param = {
      order_id,
      medication_personnel_id: medicationList.filter(item => item.isShow == true)?.[0]?.id,
      third_return_url: `/subpages/trade/detail?order_id=${order_id}`,
      souce_from: isWeixin ? 0 : 2,
      before_ai_result_symptom: [],
      distributor_id: orderInfo.distributorId
    }
    listProduct.forEach(item => {
      param.before_ai_result_symptom.push({
        id: item.id,
        value: item.medicineSymptomSetNew
      })
    })
    notesList.forEach(item => {
      param[item.key] = item.value
    })

    if (!param.medication_personnel_id) {
      showToast(`请填写用药人`);
      return
    }

    if (param.before_ai_result_allergy_history == 1) {
      if (before_ai_result_allergy_history == '') {
        showToast(`请填写药物过敏说明`);
        return
      }
    }
    param.before_ai_result_allergy_history = param.before_ai_result_allergy_history == 1 ? before_ai_result_allergy_history : ""

    let res = await api.prescriptionDrug.prescriptionDiagnosis(param)
    showToast(`提交成功`)
    const webviewSrc = encodeURIComponent(res.url)
    Taro.redirectTo({
      url: `/pages/webview?url=${webviewSrc}`
    })
  }

  const medicationPersonnel = async () => {
    const res = await api.prescriptionDrug.medicationPersonnelList({ ...param })
    res.list.forEach(element => {
      element.relationship = Number(element.relationship) - 1
    });
    res.list[0].isShow = true
    res.list.forEach((item, index) => {
      item.isShow = index == 0
    })
    setState(draft => {
      draft.medicationList = res.list
    })
  }

  const pickerChange = (e, index) => {
    let notesList1 = JSON.parse(JSON.stringify(notesList))
    notesList1[index].selectorChecked = notesList1[index].selector[e.detail.value].value
    notesList1[index].value = notesList1[index].selector[e.detail.value].key
    setState(draft => {
      draft.notesList = notesList1
    })
  }

  const colsePersonnel = () => {
    setState(draft => {
      draft.isOpened = !isOpened
    })
  }

  const listChangge = (val) => {
    setState(draft => {
      draft.medicationList = val
    })
  }

  const pitchOn = (index) => {
    let list = JSON.parse(JSON.stringify(medicationList))
    list.forEach((item, i) => {
      item.isShow = i == index
    })
    setState(draft => {
      draft.medicationList = list
    })
  }

  const onClickItem = ({ itemId, distributorId }) => {
    Taro.navigateTo({
      url: `/pages/item/espier-detail?id=${itemId}&dtid=${distributorId}`
    })
  }

  const onClickTag = (item1, index, index1) => {
    let listProduct1 = JSON.parse(JSON.stringify(listProduct))
    listProduct1[index].medicineSymptomSet[index1].show = !listProduct1[index].medicineSymptomSet[index1].show
    // 筛选出 show 为 true 的元素
    let filteredItems = listProduct1[index].medicineSymptomSet.filter(item => item.show === true);
    //提取这些元素的 value
    listProduct1[index].medicineSymptomSetNew = filteredItems.map(item => item.value);
    setState(draft => {
      draft.listProduct = listProduct1
    })
  }

  return (
    <SpPage className='prescription-information'
      renderFooter={
        <View className='btn-wrap'>
          <AtButton circle type='primary' onClick={handleClickToEdit} disabled={!risk} >
            提交并开药
          </AtButton>
        </View>
      }
    >
      <View className='information'>
        <View className='title'>
          <Text className='title-num'>1</Text>
          <Text className='title-text'>填写信息</Text>
        </View>
        <View className='titled'>-----</View>
        <View className='titled'>
          <Text className='titled-num'>2</Text>
          <Text>医生开方</Text>
        </View>
        <View className='titled'>-----</View>
        <View className='titled'>
          <Text className='titled-num'>3</Text>
          <Text>支付订单</Text>
        </View>
      </View>

      <View className='prompt'>您的信息用于处方药购买，平台会严格保密，请放心填写</View>

      <View className='medication'>
        <View className='personnel'>
          <View className='personnel-title'>
            <Text className='sp-cell__xin'>* </Text>
            用药人</View>
          <View className='personnel-name' onClick={colsePersonnel}>
            <Text className='iconfont icon-bianji1'></Text>
            添加/修改
          </View>
        </View>
        <View className='prompt'>请选择实际用药人，医生可能会电话联系用药人了解病情</View>
        <ScrollView scrollX>
          <View className='relationship'>
            {
              medicationList.map((item, index) => {
                return (
                  <View className={classNames(
                    'relationship-wrap',
                    item.isShow ? 'relationship-wraps' : null
                  )} key={index} onClick={() => pitchOn(index)}>
                    <SpImage src={item.user_family_gender == 1 ? item.user_family_age >= 18 ? 'men.png' : 'children_1.png' : item.user_family_age >= 18 ? 'women.png' : 'children_2.png'} width={80} />
                    <View className='relationship-wrap-right'>
                      <View className='name'>{item.user_family_name}</View>
                      <View className='age'>{item.user_family_gender == 1 ? '男' : '女'} {item.user_family_age}</View>
                    </View>
                    <View className='label'>{selector[item.relationship].value}</View>
                  </View>
                )
              })
            }
          </View>
        </ScrollView>
        {/* <View className='prompt'>* 用药人体重为50.0kg，如有变化请及时修改已便医生诊断</View> */}
      </View>

      <View className='medication1'>
        <View className='personnel'>
          <Text> <Text className='sp-cell__xin'>* </Text>请选择线下已确诊疾病</Text>
          <Text className='personnel-title'>（每个药品至少选择一种）</Text>
        </View>
        {
          listProduct.map((item, index) => {
            return (
              <View className='medicine' key={index}>
                {/* <View className='medicine-top'>
                  <SpImage src={item.pic} width={90} />
                  <View className='medicine-top-right'>{item.item_name}</View>
                </View> */}
                <SpTradeItem
                  info={{
                    ...item
                  }}
                  onClick={onClickItem}
                />
                <View className='medicine-bot'>
                  {
                    item.medicineSymptomSet.map((item1, index1) => {
                      return (
                        <AtTag type='primary' circle active={item1.show} className='medicine-bot-name'
                          key={index1} onClick={() => onClickTag(item1, index, index1)}>{item1.value}</AtTag>
                      )
                    })
                  }
                </View>
              </View>
            )
          })
        }

      </View>

      <View className='notes'>
        {
          notesList.map((item, index) => {
            return (
              <Picker mode='selector' range={item.selector} rangeKey='value' key={index} onChange={(e) => pickerChange(e, index)}>
                {/* <AtList>
                  <AtListItem
                  iconInfo = {'iconfont icon-arrow-up'}
                    title={item.title}
                    extraText={item.selectorChecked}
                  />
                </AtList> */}
                <SpCell
                  className='logistics-no province border-bottom'
                  title={item.title}
                  isLink
                  arrow
                  certainly
                >
                  <View className='picker'>
                    {item.selectorChecked}
                  </View>
                </SpCell>
              </Picker>
            )
          })
        }
        {
          notesList[4].value == 1 &&
          <View className='notes-textarea'>
            <Text className='allergy'><Text className='sp-cell__xin'>* </Text>药物过敏说明：</Text>
            <AtTextarea
              value={before_ai_result_allergy_history}
              maxLength={200}
              placeholder='请填写药物过敏说明...'
              onChange={(e) => {
                setState(draft => {
                  draft.before_ai_result_allergy_history = e
                })
              }}
            />
          </View>
        }
      </View>

      <View className='informed'>
        <SpCheckbox
          checked={risk}
          onChange={() => {
            setState(draft => {
              draft.risk = !risk
            })
          }}
        />
        <View className='informed-notice'>
          确认已在线下就诊，使用过所购买药品且无过敏或不良反应，当前病情稳定
          ，确认监护人已知晓病情及购药行为。我已阅读并同意
          <Text className='informed-title' onClick={() => {
            Taro.navigateTo({
              url: '/subpages/auth/reg-rule?type=ehospital_risk_informed'
            })
          }}>
            《互联网诊疗风险告知及知情同意书》
          </Text>
        </View>
      </View>

      {
        isOpened &&
        <CompMedicationPersonnel isOpened={isOpened} colsePersonnel={colsePersonnel} listChangge={listChangge} />
      }

    </SpPage>
  )
}

export default PrescriptionPnformation
