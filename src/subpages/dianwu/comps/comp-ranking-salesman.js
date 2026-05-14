/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useMemo } from 'react'
import { useImmer } from 'use-immer'
import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import api from '@/api'
import { View } from '@tarojs/components'
import { SpTime, SpTable } from '@/subpages/components'
import S from '@/spx'
import { useSyncCallback } from '@/hooks'
import { useTranslation, $t, i18n } from '@/i18n'
import './comp-ranking-salesman.scss'

const initialState = {
  datas: S?.getNowDate(),
  datasType: 2,
  listData: []
}

function CompRankingSalesman(props) {
  useTranslation()
  const listHeader = useMemo(
    () => [
      { title: $t('a8c83ef2.a4dc00'), id: 'ranking' },
      { title: $t('a8c83ef2.808d6c'), width: '120px', id: 'username' },
      { title: $t('a8c83ef2.cf6d47'), width: '120px', id: 'total_fee' },
      { title: $t('a8c83ef2.5ffd2f'), width: '120px', id: 'order_num' },
      // { title: '顾客数', width: '120px', id: 'order_num' },
      { title: $t('a8c83ef2.112f85'), width: '120px', id: 'rebate_sum' }
    ],
    [i18n.language]
  )

  const [state, setState] = useImmer(initialState)
  const { datas, datasType, listData } = state
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
