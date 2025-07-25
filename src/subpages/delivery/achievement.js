import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { Text, View, ScrollView } from '@tarojs/components'
import { classNames, validate, showToast } from '@/utils'
import { SpImage, SpPage, SpTime, SpCustomPicker, SpTable } from '@/components'
import { useImmer } from 'use-immer'
import { useSyncCallback } from '@/hooks'
import { useSelector } from 'react-redux'
import api from '@/api'
import S from '@/spx'
import './achievement.scss'

const initialConfigState = {
  list: [],
  tabList: [{ title: '全部' }, { title: '直推业绩' }, { title: '间推业绩' }],
  types: 0,
  listData: [],
  listHeader: [
    { title: '时间', width: '120px', id: 'date_time' },
    // { title: '业务员', id: 'salesName' },
    { title: '订单额（元）', width: '120px', id: 'total_fee_count' },
    { title: '订单配送量（单）', width: '120px', id: 'order_count' },
    // { title: '新增顾客', id: 'member_num' },
    { title: '配送费（元）', width: '120px', id: 'self_delivery_fee_count' }
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
  const { deliveryPersonnel } = useSelector((state) => state.cart)

  useEffect(() => {
    fetch()
    // distributor()
  }, [])

  const fetch = async () => {
    Taro.showLoading({
      title: '加载中',
      icon: 'none'
    })
    let params = {
      ...parameter,
      datetype: parameter.datetype == 0 ? 'y' : parameter.datetype == 1 ? 'm' : 'd',
      ...deliveryPersonnel
    }
    const res = await api.delivery.datacubeDeliverystaffdataDetail(params)
    res.forEach((element) => {
      element.self_delivery_fee_count = element.self_delivery_fee_count / 100
      element.total_fee_count = element.total_fee_count / 100
    })
    //生成对应的年月日
    let res1 = time(res)
    Taro.hideLoading()
    setState((draft) => {
      draft.listData = res1
    })
  }

  const time = (res) => {
    res?.forEach((item, index) => {
      if (parameter.datetype == 0) {
        //y 年
        item['date_time'] = `${index + 1}月`
      } else if (parameter.datetype == 1) {
        //m  月
        item['date_time'] = `${parameter.date}-${index + 1}`
      } else {
        item['date_time'] = parameter.date
      }
    })
    return res
  }

  // const distributor = async () => {
  //   const { list } = await api.delivery.getDistributorList({
  //     page: 1,
  //     page_size: 1000,
  //     self_delivery_operator_id:deliveryPersonnel.self_delivery_operator_id
  //   })
  //   list.forEach((element) => {
  //     element.value = element.distributor_id
  //     element.label = element.name
  //   })
  //   list.unshift({
  //     value: '',
  //     label: '全部店铺'
  //   })
  //   setState((draft) => {
  //     draft.selector = list
  //   })
  // }

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
          {/* <SpCustomPicker selector={selector} cancel={cancel} /> */}
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
        {listData.length > 0 && <SpTable listData={listData} listHeader={listHeader} />}
      </View>
    </SpPage>
  )
}

export default Achievement
