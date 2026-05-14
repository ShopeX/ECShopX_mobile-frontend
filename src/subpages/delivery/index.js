/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro, { useDidShow } from '@tarojs/taro'
import { Text, View } from '@tarojs/components'
import { useEffect, useMemo } from 'react'
import { useImmer } from 'use-immer'
import { useTranslation, $t } from '@/i18n'
import { classNames } from '@/utils'
import { SpPage } from '@/components'
import { SpTime, SpCustomPicker } from '@/subpages/components'
import { useSelector, useDispatch } from 'react-redux'
import { useSyncCallback } from '@/hooks'
import api from '@/api'
import * as deliveryApi from '@/api/delivery'
import S from '@/spx'
import { updateDeliveryPersonnel } from '@/store/slices/cart'
import CompTabbar from './comps/comp-tabbar'
import './index.scss'

const initialConfigState = {
  codeStatus: false,
  information: { name: 'cx' },
  info: {},
  parameter: {
    datetype: 2,
    date: S?.getNowDate(),
    distributor_id: ''
  },
  selector: []
}

const Index = () => {
  const { i18n } = useTranslation()
  const [state, setState] = useImmer(initialConfigState)
  const { codeStatus, information, info, parameter, selector } = state
  const { deliveryPersonnel } = useSelector((state) => state.cart)
  const dispatch = useDispatch()

  const funcList = useMemo(
    () => [
      { name: $t('ac21eb4c.afcd11'), icon: 'icon-dingdanguanli', path: '/subpages/delivery/list' },
      {
        name: $t('ac21eb4c.7fd78c'),
        icon: 'icon-daikexiadan',
        path: '/subpages/delivery/after-sale-list'
      },
      {
        name: $t('ac21eb4c.a5aedc'),
        icon: 'icon-yewuyuantuiguang',
        path: '/subpages/delivery/achievement'
      },
      {
        name: $t('ac21eb4c.1398bf'),
        icon: 'icon-shangjialiebiao',
        path: '/subpages/delivery/selectShop'
      }
    ],
    [i18n.language]
  )

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('ac21eb4c.78f717') })
  }, [i18n.language])

  useDidShow(() => {
    fetch()
    distributor()
  })

  const fetch = async () => {
    Taro.showLoading({
      title: $t('ac21eb4c.f013ea'),
      icon: 'none'
    })
    let params = {
      ...parameter,
      datetype: parameter.datetype == 0 ? 'y' : parameter.datetype == 1 ? 'm' : 'd',
      ...deliveryPersonnel,
      from: 'api'
    }
    const res = await deliveryApi.datacubeDeliverystaffdata(params)
    Taro.hideLoading()
    res.self_delivery_fee_count = S?.formatMoney(res.self_delivery_fee_count / 100)
    res.refund_fee_count = S?.formatMoney(res.refund_fee_count / 100)
    res.total_fee_count = S?.formatMoney(res.total_fee_count / 100)
    setState((draft) => {
      draft.info = res
    })
  }

  const distributor = async () => {
    const { list } = await deliveryApi.getDistributorList({
      page: 1,
      page_size: 1000,
      self_delivery_operator_id: deliveryPersonnel.self_delivery_operator_id
    })
    list.forEach((element) => {
      element.value = element.distributor_id
      element.label = element.name
    })
    list.unshift({
      value: '',
      label: $t('ac21eb4c.77678b'),
      distributor_id: ''
    })
    setState((draft) => {
      draft.selector = list
    })
  }

  const handleCardClick = () => {
    // Taro.navigateTo({
    //   url: `/subpages/salesman/card`
    // })
    setState((draft) => {
      draft.codeStatus = true
    })
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
    })
    dispatch(updateDeliveryPersonnel({ ...deliveryPersonnel, distributor_id: val.value }))
    handleRefresh()
  }

  return (
    <SpPage className={classNames('page-sales-index')} renderFooter={<CompTabbar />}>
      <View className='sales-back'></View>
      <View className='sales-header'>
        <View className='sales-header-left'>
          <Text className='iconfont icon-yewuyuan sales-header-icon'></Text>
          <View className='sales-header-title'>{$t('ac21eb4c.b0bfcb')}</View>
        </View>
        {/* <View className='sales-header-left rigth' onClick={handleCardClick}>
          <Text className='iconfont icon-quanbu'></Text>
          <View className='sales-header-title'>会员码</View>
        </View> */}
      </View>
      <View className='sales-content'>
        <View className='sales-content-panel'>
          <View className='sales-content-panel-item'>
            <View className='panel-header'>
              <Text className='iconfont icon-gaikuang panel-header-icon'></Text>
              <View className='panel-header-title'>{$t('ac21eb4c.2ce929')}</View>
            </View>
            <View className='panel-headers'>
              {selector && (
                <SpCustomPicker
                  selector={selector}
                  cancel={cancel}
                  customStatus
                  id={deliveryPersonnel.distributor_id}
                />
              )}
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
                  <View className='panel-title  mb-0'>{$t('ac21eb4c.a14418')}</View>
                  <Text className='iconfont icon-xianshi View-icon'></Text>
                </View>
                <View
                  className='look-detail'
                  onClick={() => {
                    Taro.navigateTo({
                      url: '/subpages/delivery/achievement'
                    })
                  }}
                >
                  {$t('ac21eb4c.d5c881')}&nbsp; &gt;
                </View>
              </View>
              <View className='panel-num mt-12'>{info.total_fee_count}</View>
            </View>
            <View className='panel-content-btm'>
              <View className='panel-content-btm-item'>
                <View className='panel-title'>{$t('ac21eb4c.3760bd')}</View>
                <View className='panel-num'>{info.order_count}</View>
              </View>
              <View className='panel-content-btm-item'>
                <View className='panel-title'>{$t('ac21eb4c.d05d08')}</View>
                <View className='panel-num'>{info.self_delivery_fee_count}</View>
              </View>
              {/* <View className='panel-content-btm-item'>
                <View className='panel-title'>退款（元）</View>
                <View className='panel-num'>{info.refund_fee_count}</View>
              </View>
              <View className='panel-content-btm-item'>
                <View className='panel-title'>退款订单（笔）</View>
                <View className='panel-num'>{info.aftersales_count}</View>
              </View> */}
            </View>
          </View>
        </View>

        <View className='sales-content-func'>
          <View className='func-title'>{$t('ac21eb4c.55fb04')}</View>
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
