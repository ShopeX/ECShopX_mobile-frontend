/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { Button, Image, View } from '@tarojs/components'
import api from '@/api'
import { formatDateTime } from '@/utils'
import { $t, ti } from '@/i18n'
import paySuccessPng from '../../../assets/imgs/pay_success.png'
import payFailPng from '../../../assets/imgs/pay_fail.png'
import './cashier-result.scss'

export default class CashierResult extends Component {
  $instance = getCurrentInstance() || {}
  constructor(props) {
    super(props)

    this.state = {
      orderInfo: null,
      tradeInfo: {
        tradeState: ''
      },
      showTabBar: ''
    }
  }
  componentDidMount() {
    // 仅兜底：收银台等上一页 showLoading 未关闭时，进入结果页关掉全局 loading（不改变原有轮询与 fetch 逻辑）
    Taro.hideLoading()
    setInterval(() => {
      this.fetch()
    }, 1000)
  }

  async fetch() {
    const { order_id } = this.$instance?.router?.params
    const { orderInfo, tradeInfo } = await api.cashier.getOrderDetail(order_id)

    if (tradeInfo.orderId.indexOf('CZ') !== -1) {
      this.setState({
        showTabBar: 'CZ'
      })
    }
    this.setState({
      orderInfo,
      tradeInfo
    })
  }

  handleClickBack = (orderId) => {
    if (orderId.indexOf('CJ') === -1) {
      Taro.navigateTo({
        url: `/subpage/pages/trade/detail?id=${orderId}`
      })
    } else {
      Taro.navigateTo({
        url: `/pages/member/point-draw-order`
      })
    }
  }

  handleClickRoam = () => {
    Taro.navigateTo({
      url: process.env.APP_HOME_PAGE
    })
  }

  render() {
    const { orderInfo, tradeInfo, showTabBar } = this.state

    if (!orderInfo) return null
    let create_time = formatDateTime(orderInfo.create_time * 1000)
    let ingUrl = payFailPng
    if (tradeInfo.tradeState === 'SUCCESS') {
      ingUrl = paySuccessPng
    }

    console.log('===tradeInfo===', tradeInfo)

    return (
      <View className='page-cashier-index'>
        <View className='cashier-content'>
          <View className='cashier-result'>
            <View className='cashier-result__img'>
              <Image className='note__img' mode='aspectFill' src={ingUrl} />
            </View>
            <View className='cashier-result__info'>
              <View className='cashier-result__info-title'>
                {tradeInfo.tradeState === 'SUCCESS' ? $t('f48d0dba.07834a') : $t('f48d0dba.a9eebc')}
              </View>
              <View className='cashier-result__info-news'>
                {$t('45ab5834.148237')}
                {tradeInfo.orderId}
              </View>
              {tradeInfo.tradeState === 'SUCCESS' ? (
                <View className='cashier-result__info-news'>
                  {$t('45ab5834.296b0f')}
                  {tradeInfo.tradeId}
                </View>
              ) : null}
              <View className='cashier-result__info-news'>
                {ti('1d9cdff5.968975', [create_time])}
              </View>
              {tradeInfo.tradeState === 'SUCCESS' ? (
                <View className='cashier-result__info-news'>
                  {$t('45ab5834.ca25d2')}
                  {tradeInfo.payDate}
                </View>
              ) : null}
            </View>
          </View>
        </View>

        {showTabBar === 'CZ' ? (
          <View className='goods-buy-toolbar'>
            <View className='goods-buy-toolbar__btns'>
              <Button
                className='goods-buy-toolbar__btn btn-add-cart'
                onClick={this.handleClickRoam}
              >
                {$t('7bacdf29.5a1367')}
              </Button>
            </View>
          </View>
        ) : (
          <View className='goods-buy-toolbar'>
            {tradeInfo.tradeState === 'fail' ? (
              <View className='goods-buy-toolbar__btns'>
                <Button
                  className='goods-buy-toolbar__btn btn-fast-buy'
                  onClick={this.handleClickBack.bind(this, tradeInfo.orderId)}
                >
                  {$t('45ab5834.8054f7')}
                </Button>
              </View>
            ) : (
              <View className='goods-buy-toolbar__btns'>
                <Button
                  className='goods-buy-toolbar__btn btn-add-cart'
                  onClick={this.handleClickRoam}
                >
                  {$t('7bacdf29.5a1367')}
                </Button>
                <Button
                  className='goods-buy-toolbar__btn btn-fast-buy'
                  onClick={this.handleClickBack.bind(this, tradeInfo.orderId)}
                >
                  {$t('45ab5834.8054f7')}
                </Button>
              </View>
            )}
          </View>
        )}
      </View>
    )
  }
}
