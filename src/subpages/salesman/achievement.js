/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro from '@tarojs/taro'
import { useEffect, useMemo } from 'react'
import { Text, View } from '@tarojs/components'
import { SpPage, SpTabs } from '@/components'
import { SpTime, SpCustomPicker, SpTable } from '@/subpages/components'
import { useImmer } from 'use-immer'
import { useSyncCallback } from '@/hooks'
import api from '@/api'
import S from '@/spx'
import { $t, useTranslation } from '@/i18n'
import './achievement.scss'

const initialConfigState = {
  list: [],
  types: 0,
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
  const { types, listData, parameter, selector } = state

  const tabList = useMemo(
    () => [
      { title: $t('f1d3181c.a8b0c2') },
      { title: $t('74f8cc1e.b37a6e') },
      { title: $t('74f8cc1e.f6087a') }
    ],
    [i18n.language]
  )

  const listHeader = useMemo(
    () => [
      { title: $t('74f8cc1e.19fcb9'), width: '130px', id: 'date_brokerage' },
      { title: $t('8a819f4f.808d6c'), id: 'salesName' },
      { title: $t('74f8cc1e.cf6d47'), width: '120px', id: 'total_Fee' },
      { title: $t('74f8cc1e.fbb493'), id: 'order_num' },
      { title: $t('74f8cc1e.e11cb6'), id: 'member_num' },
      { title: $t('74f8cc1e.7ae8f6'), width: '120px', id: 'total_rebate' }
    ],
    [i18n.language]
  )

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('24311a5c.b0bf8e') })
  }, [i18n.language])

  useEffect(() => {
    fetch()
    distributor()
  }, [])

  const fetch = async () => {
    Taro.showLoading({
      title: $t('74f8cc1e.f013ea'),
      icon: 'none'
    })
    let params = {
      ...parameter,
      datetype: parameter.datetype == 0 ? 'y' : parameter.datetype == 1 ? 'm' : 'd'
    }
    const res = await api.salesman.promoterGetSalesmanStatic(params)
    res.forEach((element) => {
      element.total_Fee = element.total_Fee ? element.total_Fee / 100 : 0
      element.total_rebate = element.total_rebate ? element.total_rebate / 100 : 0
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
      label: $t('eab159ba.77678b')
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
        <Text className='title'>{$t('74f8cc1e.25ae6c')}</Text>
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
        <SpTabs
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
        />

        <SpTable listData={listData} listHeader={listHeader} />
      </View>
    </SpPage>
  )
}

export default Achievement
