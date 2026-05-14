/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance, useDidShow } from '@tarojs/taro'
import { AtButton } from 'taro-ui'
import { View, Text } from '@tarojs/components'
import { SpPage, SpButton, SpLoading } from '@/components'
import { useNavigation } from '@/hooks'
import { $t, useTranslation } from '@/i18n'
import { isArray } from '@/utils'
import api from '@/api'
import { updateCount } from '@/store/slices/cart'
import './cashier-result.scss'

const initialState = {
  tradeInfo: '',
  orderId: '',
  czOrder: false
}

function CashierResult(props) {
  const [state, setState] = useImmer(initialState)
  const { tradeInfo, orderId, czOrder } = state
  const dispatch = useDispatch()
  const { i18n } = useTranslation()
  const { setNavigationBarTitle } = useNavigation()
  const pollTimerRef = useRef(null)

  const clearPollTimer = () => {
    if (pollTimerRef.current != null) {
      clearTimeout(pollTimerRef.current)
      pollTimerRef.current = null
    }
  }

  useEffect(() => {
    Taro.hideLoading()
    return () => {
      clearPollTimer()
    }
  }, [])

  /** 同步原生导航标题，避免从详情/结算 redirect 后仍显示商品名（文案走 i18n） */
  useEffect(() => {
    if (!tradeInfo || typeof tradeInfo !== 'object') {
      setNavigationBarTitle($t('16726e8e.8f2e91'))
      return
    }
    const ts = tradeInfo.tradeState
    if (ts === 'SUCCESS') {
      setNavigationBarTitle($t('45ab5834.eb5dc9'))
    } else if (ts === 'NOTPAY') {
      setNavigationBarTitle($t('45ab5834.5e6031'))
    } else if (ts === 'fail') {
      setNavigationBarTitle($t('16726e8e.4548cc'))
    } else {
      setNavigationBarTitle($t('16726e8e.8f2e91'))
    }
  }, [tradeInfo, i18n.language])

  useDidShow(() => {
    fetch()
  })

  const fetch = async () => {
    const instance = getCurrentInstance() || {}
    const { order_id } = instance?.router?.params || {}
    if (!order_id) {
      return
    }
    clearPollTimer()
    const { tradeInfo } = await api.cashier.getOrderDetail(order_id)

    setState((draft) => {
      draft.tradeInfo =
        isArray(tradeInfo) && tradeInfo.length == 0 ? { tradeState: 'NOTPAY' } : tradeInfo
      draft.orderId = order_id
      draft.czOrder = order_id.indexOf('CZ') > -1
    })
    // 获取openid, 微信客户端支付方式
    // if (code && orderInfo.pay_type == 'wxpay') {
    //   cashierPayment({
    //     ...orderInfo,
    //     pay_type: 'wxpayjs'
    //   })
    // }

    if (tradeInfo?.tradeState != 'SUCCESS') {
      pollTimerRef.current = setTimeout(() => {
        pollTimerRef.current = null
        fetch()
      }, 3000)
    } else if (tradeInfo.tradeState == 'SUCCESS') {
      clearPollTimer()
      // 更新购物车
      await dispatch(
        updateCount({
          shop_type: 'distributor'
        })
      )
    }
  }

  return (
    <SpPage className='page-cashier-result'>
      <View className='trade-result'>
        {tradeInfo?.tradeState == 'NOTPAY' && <SpLoading />}
        {tradeInfo?.tradeState == 'SUCCESS' && (
          <Text className='iconfont icon-roundcheckfill'></Text>
        )}

        <Text className='trade-txt'>
          {
            {
              'NOTPAY': $t('45ab5834.5e6031'),
              'SUCCESS': $t('45ab5834.eb5dc9')
            }[tradeInfo?.tradeState]
          }
        </Text>
      </View>
      {tradeInfo && (
        <View className='trade-info'>
          <View>
            {$t('45ab5834.148237')}
            <Text className='trade-info-value'>{orderId}</Text>
          </View>
          <View>
            {$t('45ab5834.296b0f')}
            <Text className='trade-info-value'>{tradeInfo.tradeId}</Text>
          </View>
          {/* <View>{`创建时间：${tradeInfo.orderId}`}</View> */}
          <View>
            {$t('45ab5834.ca25d2')}
            <Text className='trade-info-value'>{tradeInfo.payDate}</Text>
          </View>
        </View>
      )}
      <View className='btn-block'>
        {/* 普通订单, 秒杀订单 */}
        {(tradeInfo?.tradeSourceType == 'normal' ||
          tradeInfo?.tradeSourceType == 'normal_seckill' ||
          tradeInfo?.tradeSourceType == 'normal_groups') && (
          <View className='btn-wrap'>
            <SpButton
              resetText={$t('45ab5834.db1c89')}
              confirmText={$t('45ab5834.8054f7')}
              onReset={() => {
                Taro.redirectTo({ url: '/pages/index' })
              }}
              onConfirm={() => {
                Taro.redirectTo({ url: `/subpages/trade/detail?order_id=${orderId}` })
              }}
            ></SpButton>
          </View>
        )}

        {/* 积分订单 */}
        {(tradeInfo?.tradeSourceType == 'normal_pointsmall' ||
          tradeInfo?.tradeSourceType == 'normal_pointsmall_pointsmall') && (
          <View className='btn-wrap'>
            <SpButton
              resetText={$t('45ab5834.db1c89')}
              confirmText={$t('45ab5834.8054f7')}
              onReset={() => {
                Taro.redirectTo({ url: '/pages/index' })
              }}
              onConfirm={() => {
                Taro.redirectTo({
                  url: `/subpages/trade/detail?order_id=${orderId}&type=pointitem`
                })
              }}
            ></SpButton>
          </View>
        )}

        {/* 社区拼团订单 */}
        {tradeInfo?.tradeSourceType == 'normal_community' && (
          <View className='btn-wrap'>
            <AtButton
              circle
              type='plain'
              onClick={() => {
                Taro.redirectTo({ url: '/subpages/community/order' })
              }}
            >
              {$t('45ab5834.07166e')}
            </AtButton>
          </View>
        )}

        {/* 充值订单 */}
        {czOrder && (
          <View className='btn-wrap cz-order'>
            <AtButton
              circle
              type='plain'
              onClick={() => {
                Taro.redirectTo({ url: '/pages/index' })
              }}
            >
              {$t('45ab5834.db1c89')}
            </AtButton>
          </View>
        )}
      </View>
    </SpPage>
  )
}

CashierResult.options = {
  addGlobalClass: true
}

export default CashierResult
