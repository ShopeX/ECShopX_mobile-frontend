/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { AtNavBar } from 'taro-ui'
import { connect } from 'react-redux'
import { View } from '@tarojs/components'
import api from '@/api'
import { Loading, SpNavBar, SpToast } from '@/components'
import { pickBy, browser, getDistributorId } from '@/utils'
import { withLogin } from '@/hocs'
import getPaymentList from '@/utils/payment'
import { PAYTYPE } from '@/consts'
import { $t, ti } from '@/i18n'
import { AlipayPay, WeH5Pay, WePay } from './comps'
import { deleteForm } from './util'
import './index.scss'

@connect(({ sys }) => ({
  pointName: sys.pointName
}))
@withLogin()
export default class Cashier extends Component {
  $instance = getCurrentInstance() || {}
  state = {
    info: null,
    env: '',
    isHasAlipay: true,
    payType: PAYTYPE().WXH5
  }

  componentDidShow() {
    this.fetch()
    deleteForm()
  }

  async componentDidMount() {
    const { isHasAlipay } = await getPaymentList(getDistributorId())
    // const isHasAlipay = []
    this.setState({
      isHasAlipay
    })
  }

  isPointitemGood() {
    const options = this.$instance?.router?.params
    return options.type === 'pointitem'
  }

  async fetch() {
    const { order_id, pay_type = PAYTYPE().WXH5, id } = this.$instance?.router?.params

    let env = ''
    if (browser.weixin) {
      env = 'WX'
    }

    Taro.showLoading({ title: '' })
    const orderInfo = await api.cashier.getOrderDetail(order_id || id)

    const info = pickBy(orderInfo.orderInfo, {
      order_id: 'order_id',
      order_type: 'order_type',
      pay_type: 'pay_type',
      point: 'point',
      title: 'title',
      total_fee: ({ total_fee }) => (total_fee / 100).toFixed(2)
    })

    this.setState({
      info,
      env,
      payType: pay_type
    })
    Taro.hideLoading()
  }

  handleClickBack = () => {
    const { order_type, order_id } = this.state.info
    const url =
      order_type === 'recharge' ? '/pages/member/pay' : `/subpage/pages/trade/detail?id=${order_id}`
    Taro.redirectTo({
      url
    })
  }

  render() {
    const { info, env, isHasAlipay, payType } = this.state

    if (!info) {
      return <Loading />
    }

    return (
      <View className='page-cashier-index'>
        <AtNavBar
          fixed
          color='#000'
          title={$t('7187dbd0.5cbddd')}
          leftIconType='chevron-left'
          onClickLeftIcon={this.handleClickBack}
        />
        <View className='cashier-money'>
          {info.order_type !== 'recharge' ? (
            <View className='cashier-money__tip'>{$t('6b28f89b.a88c1e')}</View>
          ) : null}
          <View className='cashier-money__content'>
            <View className='cashier-money__content-title'>
              {$t('45ab5834.148237')} {info.order_id}
            </View>
            <View className='cashier-money__content-title'>
              {$t('6b28f89b.8fd90d')}
              {info.title}
            </View>
            <View className='cashier-money__content-title'>
              {$t('6b28f89b.1a8469')}
              {info.pay_type === 'point'
                ? ti('6b28f89b.a20466', [this.props.pointName])
                : $t('6b28f89b.952e02')}
            </View>
            <View className='cashier-money__content-number'>
              {info.pay_type === 'point' ? info.point : info.total_fee}
            </View>
          </View>
        </View>
        {!env ? (
          <View>
            {isHasAlipay && payType === PAYTYPE().ALIH5 && (
              <AlipayPay orderID={info.order_id} payType='alipayh5' orderType={info.order_type} />
            )}
            {payType === PAYTYPE().WXH5 && <WeH5Pay orderID={info.order_id} />}
          </View>
        ) : (
          <View>
            <WePay info={info} />
          </View>
        )}
        <SpToast />
      </View>
    )
  }
}
