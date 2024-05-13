import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance, useDidShow, useRouter } from '@tarojs/taro'
import { AtButton, AtTabs, AtTabsPane, AtDivider } from 'taro-ui'
import api from '@/api'
import { View, Text, Picker } from '@tarojs/components'
import {
  SpPage,
  SpTime,
  SpScrollView,
  SpPrice,
  SpImage,
  SpSearchInput,
  SpVipLabel
} from '@/components'
import { classNames, pickBy, showToast } from '@/utils'
import './comp-ranking.scss'

const initialState = {
  list: [],
  total_count: 0,
  page: 1,
  datas: '',
  datasType: 0
}

function CompRanking(props) {
  const [state, setState] = useImmer(initialState)
  const { list, total_count, page, datas, datasType } = state
  const { params } = useRouter()
  const { selectorCheckedIndex, deliverylnformation, refreshData } = props

  useEffect(() => {
    fetch(true)
  }, [refreshData]) // 仅在 refreshData 更改时执行

  useDidShow(() => {
    fetch(true)
  })

  //val 年(0)月(1)日(2)   ele 具体时间
  const onTimeChange = (val, ele) => {
    console.log(val, ele, 'val,ele===')
    setState((draft) => {
      draft.datas = ele
      draft.datasType = val
    })
    fetch(true, val, ele)
  }

  const fetch = async (val, ele, par) => {
    Taro.showLoading()
    let res = {
      page: val ? 1 : page,
      pageSize: 10,
      datasType: ele ? ele : datasType,
      datas: par ? par : datas,
      distributor_id: params.distributor_id,
      username: selectorCheckedIndex == 0 ? deliverylnformation : '',
      mobile: selectorCheckedIndex == 1 ? deliverylnformation : ''
    }
    // const { list: _list, total_count } = await api.dianwu.goodsItems(res)
    const { list: _list, total_count } = await api.dianwu.datacubeDeliverystaffdata(res)
    Taro.hideLoading()
    setState((draft) => {
      draft.list = val ? _list : [...list, ..._list]
      draft.total_count = total_count
      draft.page = val ? 2 : page + 1
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
                fetch(false)
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
