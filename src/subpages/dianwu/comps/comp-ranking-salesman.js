// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import api from '@/api'
import { View, Text, Image } from '@tarojs/components'
import { SpTime, SpImage, SpTable } from '@/components'
import { classNames } from '@/utils'
import S from '@/spx'
import { useSyncCallback } from '@/hooks'

import './comp-ranking-salesman.scss'

const initialState = {
  datas: S.getNowDate(),
  datasType: 2,
  listHeader: [
    { title: '排名', id: 'ranking' },
    { title: '业务员', width: '120px', id: 'username' },
    { title: '销售额（元）', width: '120px', id: 'total_fee' },
    { title: '订单数（单）', width: '120px', id: 'order_num' },
    // { title: '顾客数', width: '120px', id: 'order_num' },
    { title: '销售业绩（元）', width: '120px', id: 'rebate_sum' }
  ],
  listData: []
}

function CompRankingSalesman(props) {
  const [state, setState] = useImmer(initialState)
  const { datas, datasType, listHeader, listData } = state
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
      draft.listData = []
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
      year: datasType == 0 ? datas : '',
      month: datasType == 1 ? datas : '',
      day: datasType == 2 ? datas : '',
      distributor_id: params.distributor_id,
      username: selectorCheckedIndex == 0 ? deliverylnformation : '',
      mobile: selectorCheckedIndex == 1 ? deliverylnformation : ''
    }
    const { list } = await api.salesman.promoterGetSalesmanStatic(res)
    Taro.hideLoading()
    list.forEach((item, index) => {
      item['ranking'] = index + 1
    })
    setState((draft) => {
      draft.listData = list
    })
  }

  return (
    <View className='page-dianwu-comp-ranking'>
      <View className='comp-ranking'>
        <SpTime onTimeChange={onTimeChange} selects={datasType} nowTimeDa={datas} />
        <View className='comp-ranking-list'>
          <SpTable listData={listData} listHeader={listHeader} />
        </View>
      </View>
    </View>
  )
}

CompRankingSalesman.options = {
  addGlobalClass: true
}

export default CompRankingSalesman
