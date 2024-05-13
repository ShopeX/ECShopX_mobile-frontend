import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { usePullDownRefresh, useRouter, useDidShow } from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View, Text } from '@tarojs/components'
import { SpImage, SpPage, SpScrollView } from '@/components'
import './comp-delivery.scss'

const initialState = {
  list: []
}

function CompDelivery(props) {
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
    const { list: _list, total_count } = await api.dianwu.accountaManagement(res)
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
                    编辑
                  </View>
                </View>
                <View>
                  <View className='information'>
                    <Text className='information-tltle'>手机号</Text>
                    <Text>{item.mobile}</Text>
                  </View>
                  <View className='information'>
                    <Text className='information-tltle'>编码</Text>
                    <Text>{item.staff_no}</Text>
                  </View>
                  <View className='information'>
                    <Text className='information-tltle'>每单配送费</Text>
                    <Text>
                      {item.payment_fee}
                      {item.payment_method === 'order' ? '元/每单' : '%/每单'}
                    </Text>
                  </View>
                  <View className='information'>
                    <Text className='information-tltle'>配送员属性</Text>
                    <Text>{item.staff_attribute === 'full_time' ? '全职' : '兼职'}</Text>
                  </View>
                  <View className='information'>
                    <Text className='information-tltle'>创建时间</Text>
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
            url: `/subpages/dianwu/edit-deliveryman?&distributor_id=${params.distributor_id}&name=${params.name}`
          })
        }}
      >
        <View>创建配送员</View>
      </View>
    </View>
  )
}

CompDelivery.options = {
  addGlobalClass: true
}

export default CompDelivery
