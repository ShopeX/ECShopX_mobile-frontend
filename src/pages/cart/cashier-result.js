import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance, useDidShow } from '@tarojs/taro'
import { AtButton } from 'taro-ui'
import { View, Text } from '@tarojs/components'
import { SpPage, SpButton, SpLoading } from '@/components'
import { usePayment } from '@/hooks'
import { isArray } from '@/utils'
import api from '@/api'
import './cashier-result.scss'

const initialState = {
  tradeInfo: '',
  orderId: '',
  czOrder: false
}

function CashierResult(props) {
  const $instance = getCurrentInstance()

  const { cashierPayment } = usePayment()
  const [state, setState] = useImmer(initialState)
  const { tradeInfo, orderId, czOrder } = state
  useEffect(() => {
    const { order_id } = $instance.router.params
    if (order_id) {
      fetch()
    }
  }, [])

  // useDidShow(() => {
  //   fetch()
  // })

  const fetch = async () => {
    const { order_id, code } = $instance.router.params
    if(!order_id) {
      return
    }
    const { orderInfo, tradeInfo } = await api.cashier.getOrderDetail(order_id)

    setState((draft) => {
      draft.tradeInfo = isArray(tradeInfo) && tradeInfo.length == 0 ? { tradeState: 'NOTPAY' } : tradeInfo
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

    if (tradeInfo && tradeInfo.tradeState != 'SUCCESS') {
      setTimeout(() => {
        fetch()
      }, 3000)
    }
  }

  return (
    <SpPage className='page-cashier-result' navbar={false}>
      <View className='trade-result'>
        {tradeInfo.tradeState == 'NOTPAY' && <SpLoading />}
        {tradeInfo.tradeState == 'SUCCESS' && (
          <Text className='iconfont icon-roundcheckfill'></Text>
        )}

        <Text className='trade-txt'>
          {
            {
              'NOTPAY': '等待支付',
              'SUCCESS': '支付成功'
            }[tradeInfo.tradeState]
          }
        </Text>
      </View>
      {tradeInfo && (
        <View className='trade-info'>
          <View>
            订单编号：<Text className='trade-info-value'>{orderId}</Text>
          </View>
          <View>
            支付单号：<Text className='trade-info-value'>{tradeInfo.tradeId}</Text>
          </View>
          {/* <View>{`创建时间：${tradeInfo.orderId}`}</View> */}
          <View>
            支付时间：<Text className='trade-info-value'>{tradeInfo.payDate}</Text>
          </View>
        </View>
      )}
      <View className='btn-block'>
        {/* 普通订单, 秒杀订单 */}
        {(tradeInfo?.tradeSourceType == 'normal' || tradeInfo?.tradeSourceType == 'normal_seckill') && (
          <View className='btn-wrap'>
            <SpButton
              resetText='首页'
              confirmText='订单详情'
              onReset={() => {
                Taro.redirectTo({ url: '/pages/index' })
              }}
              onConfirm={() => {
                Taro.redirectTo({ url: `/subpage/pages/trade/detail?id=${orderId}` })
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
              订单列表
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
              首页
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
