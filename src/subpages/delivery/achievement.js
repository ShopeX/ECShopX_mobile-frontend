import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { Text, View, ScrollView } from '@tarojs/components'
import { classNames, validate, showToast } from '@/utils'
import { SpImage, SpPage, SpTime, SpCustomPicker,SpTable } from '@/components'
import { useImmer } from 'use-immer'
import { useSyncCallback } from '@/hooks'
import api from '@/api'
import S from '@/spx'
import './achievement.scss'

const initialConfigState = {
  list: [],
  tabList: [{ title: '全部' }, { title: '直推业绩' }, { title: '间推业绩' }],
  types: 0,
  listData: [],
  listHeader: [
    { title: '时间', id: 'date_brokerage' },
    // { title: '业务员', id: 'salesName' },
    { title: '订单额（元）', width: '120px', id: 'total_Fee' },
    { title: '订单配送量（单）', width: '120px',id: 'order_num' },
    // { title: '新增顾客', id: 'member_num' },
    { title: '配送费（元）', width: '120px', id: 'total_rebate' }
  ],
  parameter: {
    page: 1,
    pageSize: 1000,
    datetype: 2,
    date: S.getNowDate(),
    distributor_id: '',
    tab: 'all'
  },
  selector: []
}

const Achievement = () => {
  const [state, setState] = useImmer(initialConfigState)
  const { list, tabList, types, listData, listHeader, parameter, selector } = state

  useEffect(() => {
    fetch()
    distributor()
  }, [])

  const fetch = async () => {
    Taro.showLoading({
      title: '加载中',
      icon: 'none'
    })
    let params = {
      ...parameter,
      datetype: parameter.datetype == 0 ? 'y' : parameter.datetype == 1 ? 'm' : 'd'
    }
    const res = await api.salesman.promoterGetSalesmanStatic(params)
    res.forEach((element) => {
      element.total_Fee = element.total_Fee / 100
      element.total_rebate = element.total_rebate / 100
    })
    Taro.hideLoading()
    setState((draft) => {
      draft.listData = res
    })
  }

  const distributor = async () => {
    const { list } = await api.salesman.getSalespersonSalemanShopList({
      page: 1,
      page_size: 1000
    })
    list.forEach((element) => {
      element.value = element.distributor_id
      element.label = element.name
    })
    list.unshift({
      value: '',
      label: '全部店铺'
    })
    setState((draft) => {
      draft.selector = list
    })
  }

  const cancel = (index, val) => {
    let params = {
      ...parameter,
      distributor_id: val.value
    }
    setState((draft) => {
      draft.parameter = params
    })
    handleRefresh()
  }

  const onTimeChange = (time, val) => {
    let params = {
      ...parameter,
      datetype: time,
      date: val
    }
    setState((draft) => {
      draft.parameter = params
    })
    handleRefresh()
  }

  const handleRefresh = useSyncCallback(() => {
    fetch()
  })

  return (
    <SpPage className='page-achievement'>
      <View className='page-achievement-statistics'>
        <Text className='iconfont icon-tongji'></Text>
        <Text className='title'>配送员业绩统计</Text>
      </View>
      <View className='page-achievement-list'>
        <View className='page-achievement-list-picker'>
          <SpTime
            onTimeChange={onTimeChange}
            selects={parameter.datetype}
            nowTimeDa={parameter.date}
          />
          <SpCustomPicker selector={selector} cancel={cancel} />
        </View>
        {/* <SpTabs
          current={types}
          tablist={tabList}
          onChange={(e) => {
            console.log(e, 'e')
            setState((draft) => {
              draft.types = e
              draft.parameter = { ...parameter, tab: e == 0 ? 'all' : e == 1 ? 'lv1' : 'lv2' }
            })
            handleRefresh()
          }}
        /> */}

        <SpTable listData={listData} listHeader={listHeader} />
      </View>
    </SpPage>
  )
}

export default Achievement
