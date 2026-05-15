/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useMemo } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { Text, View } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { classNames } from '@/utils'
import { SpPage } from '@/components'
import { SpTime, SpCustomPicker } from '@/subpages/components'
import { useSyncCallback } from '@/hooks'
import { useTranslation, $t } from '@/i18n'
import api from '@/api'
import S from '@/spx'
import CompTabbar from './comps/comp-tabbar'
import './index.scss'

const initialConfigState = {
  info: {},
  parameter: {
    datetype: 2,
    date: S?.getNowDate(),
    distributor_id: ''
  },
  selector: [],
  pickerId: ''
}

const Index = () => {
  useTranslation()
  const [state, setState] = useImmer(initialConfigState)
  const { info, parameter, selector, pickerId } = state

  const funcList = useMemo(
    () => [
      {
        name: $t('eab159ba.afcd11'),
        icon: 'icon-dingdanguanli',
        path: '/subpages/salesman/list'
      },
      {
        name: $t('eab159ba.d736b9'),
        icon: 'icon-daikexiadan',
        path: '/subpages/salesman/selectCustomer'
      },
      {
        name: $t('eab159ba.138440'),
        icon: 'icon-yewuyuantuiguang',
        path: '/subpages/salesman/distribution/index'
      },
      {
        name: $t('eab159ba.21645f'),
        icon: 'icon-shangjialiebiao',
        path: `/subpages/salesman/selectShop`
      }
    ],
    []
  )

  useDidShow(() => {
    Taro.setNavigationBarTitle({
      title: $t('6cbb82b8.4163b6')
    })
    distributor()
  })

  const fetch = async () => {
    Taro.showLoading({
      title: $t('eab159ba.f013ea'),
      icon: 'none'
    })
    let params = {
      ...parameter,
      datetype: parameter.datetype == 0 ? 'y' : parameter.datetype == 1 ? 'm' : 'd'
    }
    const res = await api.salesman.getSalesmanCount(params)
    Taro.hideLoading()
    res.total_Fee = S?.formatMoney(res.total_Fee / 100)
    res.refund_Fee = S?.formatMoney(res.refund_Fee / 100)
    setState((draft) => {
      draft.info = res
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
      draft.parameter = { ...parameter, distributor_id: list[1].value }
      draft.pickerId = list[1].value
    })
    handleRefresh()
  }

  const handleFuncClick = (path) => {
    Taro.navigateTo({
      url: path
    })
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

  const cancel = (index, val) => {
    let params = {
      ...parameter,
      distributor_id: val.value
    }
    setState((draft) => {
      draft.parameter = params
      draft.pickerId = val.value
    })
    handleRefresh()
  }

  return (
    <SpPage className={classNames('page-sales-index')} renderFooter={<CompTabbar />}>
      <View className='sales-back'></View>
      <View className='sales-header'>
        <View className='sales-header-left'>
          <Text className='iconfont icon-yewuyuan sales-header-icon'></Text>
          <View className='sales-header-title'>{$t('eab159ba.aa5904')}</View>
        </View>
      </View>
      <View className='sales-content'>
        <View className='sales-content-panel'>
          <View className='sales-content-panel-item'>
            <View className='panel-header'>
              <Text className='iconfont icon-gaikuang panel-header-icon'></Text>
              <View className='panel-header-title'>{$t('eab159ba.2ce929')}</View>
            </View>
            <View className='panel-headers'>
              <SpCustomPicker selector={selector} cancel={cancel} customStatus id={pickerId} />
            </View>
          </View>
          <SpTime
            onTimeChange={onTimeChange}
            selects={parameter.datetype}
            nowTimeDa={parameter.date}
          />
          <View className='panel-content'>
            <View className='panel-content-top'>
              <View className='panel-content-top-title'>
                <View className='real-monet'>
                  <View className='panel-title  mb-0'>{$t('eab159ba.d287cc')}</View>
                  <Text className='iconfont icon-xianshi View-icon'></Text>
                </View>
                <View
                  className='look-detail'
                  onClick={() => {
                    Taro.navigateTo({
                      url: '/subpages/salesman/achievement'
                    })
                  }}
                >
                  {$t('eab159ba.d5c881')}
                  {'\u00a0 >'}
                </View>
              </View>
              <View className='panel-num mt-12'>{info.total_Fee}</View>
            </View>
            <View className='panel-content-btm'>
              <View className='panel-content-btm-item'>
                <View className='panel-title'>{$t('eab159ba.52b10c')}</View>
                <View className='panel-num'>{info.order_num}</View>
              </View>
              <View className='panel-content-btm-item'>
                <View className='panel-title'>{$t('eab159ba.6402ec')}</View>
                <View className='panel-num'>{info.aftersales_num}</View>
              </View>
              <View className='panel-content-btm-item'>
                <View className='panel-title'>{$t('eab159ba.10a068')}</View>
                <View className='panel-num'>{info.refund_Fee}</View>
              </View>
              <View className='panel-content-btm-item'>
                <View className='panel-title'>{$t('eab159ba.427e5b')}</View>
                <View className='panel-num'>{info.member_num}</View>
              </View>
            </View>
          </View>
        </View>

        <View className='sales-content-func'>
          <View className='func-title'>{$t('eab159ba.55fb04')}</View>
          <View className='func-content'>
            {funcList.map((item, index) => (
              <View
                className='func-content-item'
                onClick={() => handleFuncClick(item.path)}
                key={index}
              >
                <Text
                  className={classNames({
                    'iconfont': true,
                    [item.icon]: true,
                    'func-item-icon': true
                  })}
                ></Text>
                <View className='func-item-name'>{item.name}</View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </SpPage>
  )
}

export default Index
