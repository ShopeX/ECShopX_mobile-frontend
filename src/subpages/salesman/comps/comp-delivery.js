/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef } from 'react'
import { useImmer } from 'use-immer'
import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import * as dianwuApi from '@/api/dianwu'
import { View, Text } from '@tarojs/components'
import { SpImage, SpScrollView } from '@/components'
import { useTranslation } from 'react-i18next'
import { $t } from '@/i18n'
import './comp-delivery.scss'

const initialState = {
  list: []
}

function CompDelivery(props) {
  useTranslation()
  const [state, setState] = useImmer(initialState)
  const { params } = useRouter()
  const { selectorCheckedIndex, deliverylnformation, refreshData } = props
  const goodsRef = useRef()
  const { list } = state

  useEffect(() => {
    setState((draft) => {
      draft.list = []
    })
    goodsRef.current.reset()
  }, [refreshData])

  useDidShow(() => {
    setState((draft) => {
      draft.list = []
    })
    goodsRef.current.reset()
  })

  const fetch = async ({ pageIndex, pageSize }) => {
    let res = {
      page: pageIndex,
      pageSize,
      distributor_id: params.distributor_id,
      operator_type: 'self_delivery_staff',
      username: selectorCheckedIndex == 0 ? deliverylnformation : '',
      mobile: selectorCheckedIndex == 1 ? deliverylnformation : ''
    }
    const { list: _list, total_count } = await dianwuApi.accountaManagement(res)
    _list.forEach((item) => {
      const date = new Date(item.created * 1000)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      item.created = `${year}-${month}-${day}`
    })
    setState((draft) => {
      draft.list = [...list, ..._list]
    })
    return {
      total: total_count
    }
  }
  return (
    <View className='comp-delivery'>
      <SpScrollView auto={false} ref={goodsRef} fetch={fetch}>
        <View className='comp-delivery-scroll'>
          {list.map((item, index) => {
            return (
              <View className='comp-delivery-scroll-list' key={index}>
                <View className='name'>
                  <View>{item.username}</View>
                  <View
                    className='edit'
                    onClick={() => {
                      Taro.navigateTo({
                        url: `/subpages/dianwu/edit-deliveryman?&distributor_id=${params.distributor_id}&name=${params.name}&operator_id=${item.operator_id}`
                      })
                    }}
                  >
                    <Text className='iconfont icon-bianji1'></Text>
                    {$t('d9f41fea.95b351')}
                  </View>
                </View>
                <View>
                  <View className='information'>
                    <Text className='information-tltle'>{$t('90aaacd7.8098e2')}</Text>
                    <Text>{item.mobile}</Text>
                  </View>
                  <View className='information'>
                    <Text className='information-tltle'>{$t('4ea84201.cc6c35')}</Text>
                    <Text>{item.staff_no}</Text>
                  </View>
                  <View className='information'>
                    <Text className='information-tltle'>{$t('4ea84201.296430')}</Text>
                    <Text>
                      {item.payment_fee}
                      {item.payment_method === 'order'
                        ? $t('4ea84201.034575')
                        : $t('4ea84201.b48464')}
                    </Text>
                  </View>
                  <View className='information'>
                    <Text className='information-tltle'>{$t('74b954b7.b6fd31')}</Text>
                    <Text>
                      {item.staff_attribute === 'full_time'
                        ? $t('74b954b7.63f85b')
                        : $t('74b954b7.7c4f46')}
                    </Text>
                  </View>
                  <View className='information'>
                    <Text className='information-tltle'>{$t('4ea84201.eca37c')}</Text>
                    <Text>{item.created}</Text>
                  </View>
                </View>
              </View>
            )
          })}
        </View>
      </SpScrollView>
      <View
        className='comp-delivery-scroll-establish'
        onClick={() => {
          Taro.navigateTo({
            url: `/subpages/dianwu/edit-deliveryman`
          })
        }}
      >
        <View>{$t('74b954b7.96692c')}</View>
      </View>
    </View>
  )
}

CompDelivery.options = {
  addGlobalClass: true
}

export default CompDelivery
