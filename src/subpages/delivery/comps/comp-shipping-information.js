/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro from '@tarojs/taro'
import { View, Picker, Text } from '@tarojs/components'
import { useEffect, useRef } from 'react'
import { useImmer } from 'use-immer'
import doc from '@/doc'
import { pickBy, showToast, classNames, isArray } from '@/utils'
import { SpUpload } from '@/components'
import { AtList, AtListItem, AtTextarea } from 'taro-ui'
import { useSyncCallback } from '@/hooks'

import './comp-shipping-information.scss'

// list: [
// {
//   title: '快递公司',   //名称
//   selector: [{ label: '商家自配送',  status: true }],  //显示数据
//   extraText: '商家自配送',   //默认显示数据
//   status: 'select',    //状态  3种  select   textarea   image
//   value: 'all'    //给接口传的值（不涉及到逻辑，只是返回让使用者好判断）
// },
// {
//   title: '配送备注',
//   selector: '',
//   extraText: '',
//   status: 'textarea',
//   value: 'delivery_remark'
// },
// {
//   title: '照片上传',
//   selector: [],
//   extraText: '',
//   status: 'image',
//   value: 'delivery_pics'
// }
// ]

const initialConfigState = {
  list: []
}

const CompShippingInformation = (props) => {
  const [state, setState] = useImmer(initialConfigState)
  const { list } = state

  const { selector, delivery, showSelect = false, deliveryItem = () => {} } = props

  useEffect(() => {
    let newlist = showSelect
      ? JSON.parse(JSON.stringify(selector)).slice(0, selector.length - 2)
      : JSON.parse(JSON.stringify(selector))

    newlist.forEach((item, index) => {
      if (item.value == 'self_delivery_operator_name') {
        item.selector[0].label = delivery.selfDeliveryOperatorName
        item.extraText = delivery.selfDeliveryOperatorName
      } else if (item.value == 'self_delivery_operator_mobile') {
        item.selector[0].label = delivery.selfDeliveryOperatorMobile
        item.extraText = delivery.selfDeliveryOperatorMobile
      } else if (item.value == 'self_delivery_status') {
        let statusSelector = item.selector[0]
        if (delivery.orderStatus == 'PAYED' && delivery.selfDeliveryStatus == 'RECEIVEORDER') {
          statusSelector.label = '已接单'
          item.extraText = '已接单'
        } else if (delivery.orderStatus == 'PAYED' && delivery.selfDeliveryStatus == 'PACKAGED') {
          statusSelector.label = '已打包'
          item.extraText = '已打包'
        } else if (
          delivery.orderStatus == 'WAIT_BUYER_CONFIRM' &&
          delivery.selfDeliveryStatus == 'DELIVERING'
        ) {
          statusSelector.label = '配送中'
          item.selector[1] = { label: '已送达', status: false }
          item.extraText = '配送中'
        } else if (
          delivery.orderStatus == 'WAIT_BUYER_CONFIRM' &&
          delivery.selfDeliveryStatus == 'DONE'
        ) {
          statusSelector.label = '已送达'
          item.extraText = '已送达'
        }
      }
    })

    setState((draft) => {
      draft.list = newlist
    })
    handleRefresh()
  }, [])

  const handleRefresh = useSyncCallback(() => {
    deliveryItem(list)
  })

  const onChange = (item, index, e) => {
    let newSelector = JSON.parse(JSON.stringify(list))
    if (item.status == 'select') {
      newSelector[index].selector.forEach((element) => {
        element.status = false
      })
      newSelector[index].selector[e.detail.value].status = true
      newSelector[index].extraText = newSelector[index].selector[e.detail.value].label
    } else {
      newSelector[index].selector = e
    }
    setState((draft) => {
      draft.list = newSelector
    })
    deliveryItem(newSelector)
  }

  return (
    <View className='comp-shipping-information'>
      {list.map((item, index) => {
        return (
          <View key={index}>
            {item.status == 'select' && (
              <Picker
                mode='selector'
                rangeKey='label'
                range={item.selector}
                onChange={(e) => onChange(item, index, e)}
              >
                <AtList>
                  <AtListItem title={item.title} extraText={item.extraText} />
                </AtList>
              </Picker>
            )}
            {item.status == 'textarea' && !showSelect && (
              <View className='textarea-name'>
                <Text className='title'>{item.title}</Text>
                <AtTextarea
                  value={item.selector}
                  onChange={(e) => onChange(item, index, e)}
                  maxLength={item.maxLength || 200}
                  placeholder={item.extraText || '请输入...'}
                />
              </View>
            )}
            {item.status == 'image' && !showSelect && (
              <View className='image-name'>
                <Text className='title'>{item.title}</Text>
                <SpUpload
                  value={item.selector}
                  max={item.max || 5}
                  placeholder={item.extraText || '添加图片'}
                  onChange={(e) => onChange(item, index, e)}
                />
              </View>
            )}
          </View>
        )
      })}
    </View>
  )
}

CompShippingInformation.options = {
  addGlobalClass: true
}

export default CompShippingInformation
