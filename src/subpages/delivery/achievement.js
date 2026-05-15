/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro from '@tarojs/taro'
import { useEffect, useMemo } from 'react'
import { Text, View } from '@tarojs/components'
import { SpPage } from '@/components'
import { SpTime, SpCustomPicker, SpTable } from '@/subpages/components'
import { useImmer } from 'use-immer'
import { useSyncCallback } from '@/hooks'
import { useSelector } from 'react-redux'
import * as deliveryApi from '@/api/delivery'
import S from '@/spx'
import { useTranslation, $t, ti } from '@/i18n'
import './achievement.scss'

const initialConfigState = {
  listData: [],
  parameter: {
    page: 1,
    pageSize: 1000,
    datetype: 2,
    date: S?.getNowDate(),
    distributor_id: '',
    tab: 'all'
  },
  selector: []
}

const Achievement = () => {
  const { i18n } = useTranslation()
  const [state, setState] = useImmer(initialConfigState)
  const { listData, parameter, selector } = state
  const { deliveryPersonnel } = useSelector((state) => state.cart)

  const listHeader = useMemo(
    () => [
      { title: $t('feef92ba.19fcb9'), width: '120px', id: 'date_time' },
      { title: $t('feef92ba.753945'), width: '120px', id: 'total_fee_count' },
      { title: $t('feef92ba.9c368a'), width: '120px', id: 'order_count' },
      { title: $t('feef92ba.616ce3'), width: '120px', id: 'self_delivery_fee_count' }
    ],
    [i18n.language]
  )

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('feef92ba.d6f79b') })
  }, [i18n.language])

  useEffect(() => {
    fetch()
    // distributor()
  }, [])

  const fetch = async () => {
    Taro.showLoading({
      title: $t('feef92ba.f013ea'),
      icon: 'none'
    })
    let params = {
      ...parameter,
      datetype: parameter.datetype == 0 ? 'y' : parameter.datetype == 1 ? 'm' : 'd',
      ...deliveryPersonnel
    }
    const res = await deliveryApi.datacubeDeliverystaffdataDetail(params)
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
        item['date_time'] = ti('feef92ba.f63e95', [index + 1])
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
  //   const { list } = await deliveryApi.getDistributorList({
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
        <Text className='title'>{$t('feef92ba.1ff33a')}</Text>
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
