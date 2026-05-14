/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { connect } from 'react-redux'
import { View } from '@tarojs/components'
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'
import api from '@/api'
import { $t, ti } from '@/i18n'
import './point-deposit.scss'

@connect(({ sys }) => ({
  pointName: sys.pointName
}))
export default class PointDepositBtn extends Component {
  static options = {
    addGlobalClass: true
  }

  constructor(props) {
    super(props)

    this.state = {
      isOpened: false,
      pay_pay_type: ''
    }
  }

  handleClickPayment = async (type) => {
    this.setState({
      isOpened: true,
      pay_pay_type: type
    })
  }
  handleClosePay = () => {
    this.setState({
      isOpened: false
    })
  }
  handleConfirmPay = async () => {
    const { pay_pay_type } = this.state

    const query = {
      order_id: this.props.orderID,
      pay_type: pay_pay_type,
      order_type: this.props.orderType
    }
    try {
      await api.cashier.getPayment(query)
      Taro.redirectTo({
        url: `/pages/cashier/cashier-result?payStatus=success&order_id=${this.props.orderID}`
      })
    } catch (e) {
      console.log(e)
      this.setState({
        isOpened: false
      })
    }

    // .then(()=> {
    //   Taro.redirectTo({
    //     url: `/subpage/pages/cashier/cashier-result?payStatus=success&order_id=${this.props.orderID}`
    //   })
    // })
    // .catch(() => {
    //   Taro.redirectTo({
    //     url: `/subpage/pages/cashier/cashier-result?payStatus=fail&order_id=${this.props.orderID}`
    //   })
    // })
  }

  render() {
    const { payType } = this.props
    const { isOpened } = this.state

    return (
      <View className='point-deposit-index'>
        <View className='pay-mode' onClick={this.handleClickPayment.bind(this, payType)}>
          {payType === 'deposit'
            ? $t('2b6e9b14.460dcb')
            : ti('2b6e9b14.717604', [this.props.pointName])}
        </View>

        <AtModal
          isOpened={isOpened}
          cancelText={$t('61e2d21a.625fb2')}
          confirmText={$t('61e2d21a.e83a25')}
          onClose={this.handleClosePay}
          onCancel={this.handleClosePay}
          onConfirm={this.handleConfirmPay}
          content={$t('2b6e9b14.29a03f')}
        />
      </View>
    )
  }
}
