/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef } from 'react'
import { useImmer } from 'use-immer'
import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import api from '@/api'
import { View, Text } from '@tarojs/components'
import { SpScrollView } from '@/components'
import { useTranslation, $t } from '@/i18n'
import './comp-delivery-salesman.scss'

const initialState = {
  list: []
}

function CompDeliverySalesman(props) {
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
    const { list: _list, total_count } = await api.salesman.salespersonadminSalespersonlist(res)
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
                  <View>{item.name}</View>
                  <View
                    className='edit'
                    onClick={() => {
                      Taro.navigateTo({
                        url: `/subpages/dianwu/edit-deliveryman-salesman?&salesperson_id=${item.salesperson_id}&distributor_id=${item.storeInfo.distributor_id}`
                      })
                    }}
                  >
                    <Text className='iconfont icon-bianji1'></Text>
                    {$t('1b835d14.95b351')}
                  </View>
                </View>
                <View>
                  <View className='information'>
                    <Text className='information-tltle'>{$t('1b835d14.8098e2')}</Text>
                    <Text>{item.mobile}</Text>
                  </View>
                  {/* <View className='information'>
                    <Text className='information-tltle'>编码</Text>
                    <Text>{item.staff_no}</Text>
                  </View> */}
                  {/* <View className='information'>
                    <Text className='information-tltle'>每单业务费</Text>
                    <Text>
                      {item.payment_fee/100}
                      {item.payment_method === 'order' ? '元/每单' : '%/每单'}
                    </Text>
                  </View> */}
                  <View className='information'>
                    <Text className='information-tltle'>{$t('1b835d14.b6fd31')}</Text>
                    <Text>
                      {item.staff_attribute === 'part_time'
                        ? $t('1b835d14.7c4f46')
                        : $t('1b835d14.63f85b')}
                    </Text>
                  </View>
                  <View className='information'>
                    <Text className='information-tltle'>{$t('1b835d14.780afe')}</Text>
                    <Text>{item.is_valid ? $t('1b835d14.cc42dd') : $t('1b835d14.b15d91')}</Text>
                  </View>
                  <View className='information'>
                    <Text className='information-tltle'>{$t('1b835d14.eca37c')}</Text>
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
            url: `/subpages/dianwu/edit-deliveryman-salesman?distributor_id=${params.distributor_id}&name=${params.name}`
          })
        }}
      >
        <View>{$t('1b835d14.96692c')}</View>
      </View>
    </View>
  )
}

CompDeliverySalesman.options = {
  addGlobalClass: true
}

export default CompDeliverySalesman
