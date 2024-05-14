import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import api from '@/api'
import { View, Text } from '@tarojs/components'
import {
  SpTime,
} from '@/components'
import { classNames } from '@/utils'
import { useSyncCallback } from '@/hooks'
import './comp-ranking.scss'

const initialState = {
  list: [],
  valList: [],
  total_count: 0,
  datas: '',
  datasType: 0
}

function CompRanking(props) {
  const [state, setState] = useImmer(initialState)
  const { list, total_count, datas, datasType, valList } = state
  const { params } = useRouter()
  const { selectorCheckedIndex, deliverylnformation, refreshData } = props

  useEffect(() => {
    fetch()
  }, [refreshData])

  useDidShow(() => {
    fetch()
  })

  //val 年(0)月(1)日(2)   ele 具体时间
  const onTimeChange = (val, ele) => {
    setState((draft) => {
      draft.list = []
      draft.datas = ele
      draft.datasType = val
    })
    handleRefresh()
  }

  const handleRefresh = useSyncCallback(() => {
    fetch()
  })

  const fetch = async () => {
    Taro.showLoading()
    let res = {
      page: 1,
      pageSize: 1000,
      is_sort: 1,
      year: datasType == 0 ? datas : '',
      month: datasType == 1 ? datas : '',
      day: datasType == 2 ? datas : '',
      distributor_id: params.distributor_id,
      username: selectorCheckedIndex == 0 ? deliverylnformation : '',
      mobile: selectorCheckedIndex == 1 ? deliverylnformation : ''
    }
    const { list: _list, total_count } = await api.dianwu.datacubeDeliverystaffdata(res)
    Taro.hideLoading()
    setState((draft) => {
      draft.list = _list.slice(0, 5)
      draft.valList = _list
      draft.total_count = total_count
    })
  }

  return (
    <View className='page-dianwu-comp-ranking'>
      <View className='comp-ranking'>
        <SpTime onTimeChange={onTimeChange} />
        <View className='comp-ranking-list'>
          <View className='comp-ranking-list-item comp-ranking-list-title'>
            <Text>排名</Text>
            <Text>配送员</Text>
            <Text>订单额(元)</Text>
            <Text>配送订单量(单)</Text>
            <Text>配送费用(元)</Text>
          </View>
          {list.map((item, index) => {
            return (
              <View
                className={classNames(
                  'comp-ranking-list-item',
                  index == 0 ? 'one' : index == 1 ? 'two' : index == 2 ? 'three' : ''
                )}
                key={index}
              >
                <Text>{index}</Text>
                <Text>{item.username}</Text>
                <Text>{item.total_fee_count}</Text>
                <Text>{item.order_count}</Text>
                <Text>{item.self_delivery_fee_count}</Text>
              </View>
            )
          })}

          {total_count - list.length > 0 && (
            <View
              className='launch'
              onClick={() => {
                setState((draft) => {
                  draft.list = valList
                })
              }}
            >
              <Text>展开更多</Text>
              <Text className='iconfont icon-arrowDown'></Text>
            </View>
          )}
        </View>
      </View>

      {total_count - list.length <= 0 && <View className='end'>--没有更多数据了--</View>}
    </View>
  )
}

CompRanking.options = {
  addGlobalClass: true
}

export default CompRanking
