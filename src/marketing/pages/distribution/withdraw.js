import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Navigator, Button, Picker } from '@tarojs/components'
import { isArray } from '@/utils'
import { AtInput } from 'taro-ui'
import { SpPage } from '@/components'
import api from '@/api'

import './withdraw.scss'

export default class DistributionWithdraw extends Component {
  constructor(props) {
    super(props)

    this.state = {
      limit_rebate: 0,
      cashWithdrawalRebate: 0,
      amount: null,
      curIdx: 'alipay',
      payList: [],
      alipay_account: '',
      // accountInfo: {},
      bank_code: null
    }
  }

  componentDidShow() {
    this.fetch()
    if (this.state.curIdx == 'bankcard') {
      this.ongetCertInfo()
    }
  }

  ongetCertInfo = async () => {
    const { cert_status, card_id } = await api.distribution.adapayCert({ is_data_masking: '0' })
    if (isArray(cert_status) || cert_status.audit_state != 'E') {
      Taro.showModal({
        content: '未实名认证不可提现，快去认证叭',
        confirmText: '实名认证',
        confirmColor: '#1aad19',
        success: (res) => {
          if (res.confirm) {
            Taro.navigateTo({
              url: `/subpages/marketing/certification`
            })
          }
        }
      })
    } else {
      this.setState({ bank_code: card_id })
    }
  }

  // async getUserInfo () {
  //   let userInfo = this.get('userInfo')
  //   const token = this.getAuthToken()
  //   if (!userInfo && token) {
  //     userInfo = await api.user.info()
  //     this.set('userInfo', userInfo)
  //   }

  //   return userInfo
  // }

  async fetch() {
    const { cashWithdrawalRebate } = await api.distribution.statistics()
    let res = await api.member.getNewTradePaymentList()
    let { payList } = this.state
    res.forEach((i) => {
      payList.push({
        name: i.pay_type_name,
        value: i.pay_type_code
      })
    })

    // if (cashWithdrawalRebate) {
    this.setState({
      cashWithdrawalRebate,
      payList
    })
    // }

    const { alipay_account, config } = await api.distribution.info()
    //const dataInfo = await api.distribution.info()

    if (alipay_account) {
      this.setState({
        alipay_account
      })
    }
    if (config && config.limit_rebate) {
      this.setState({
        limit_rebate: config.limit_rebate
      })
    }
    // this.setState({
    //   accountInfo:dataInfo
    // })
  }

  handleWithdrawAll = () => {
    const { cashWithdrawalRebate } = this.state
    if (!cashWithdrawalRebate) return
    this.setState({
      amount: (cashWithdrawalRebate / 100).toFixed(2)
    })
  }
  goWithdraw = async () => {
    const { amount, curIdx } = this.state
    const query = {
      money: amount * 100,
      pay_type: curIdx
      //money:(amount/100).toFixed(2)
    }

    if (!this.state.bank_code && this.state.payText[curIdx] == '银行卡') {
      this.ongetCertInfo()
      return
    }

    const { confirm } = await Taro.showModal({
      title: '确定提现？',
      content: ''
    })
    if (confirm) {
      await api.distribution.getCash(query)
      setTimeout(() => {
        Taro.navigateBack()
      }, 700)
    }
    return
  }

  handleChange = (val) => {
    this.setState({
      amount: val
    })
  }

  handlePick = (e) => {
    let { payList } = this.state
    const idx = payList[e.detail.value].value
    this.setState({
      curIdx: idx
    })
    if (idx == 'bankcard') {
      this.ongetCertInfo()
    }
  }

  render() {
    const {
      cashWithdrawalRebate,
      limit_rebate,
      amount,
      curIdx,
      payList,
      alipay_account,
      bank_code
    } = this.state
    let payText = {
      'alipay': '支付宝',
      'wechat': '微信(<=800)',
      'hfpay': '微信支付',
      'bankcard': '银行卡'
    }
    return (
      <SpPage className='page-distribution-withdraw'>
        <View className='withdraw'>
          <View className='withdraw-title'>
            <View className='title'>可提现金额（元）</View>
            <View className='content'>{cashWithdrawalRebate / 100}</View>
          </View>
          <View className='withdraw-body'>
            <View style={{ color: '#666666' }}>提现金额</View>
            <View className='withdraw-flex'>
              <AtInput
                className='withdraw-body-input'
                onChange={this.handleChange.bind(this)}
                type='digit'
                title='¥'
                value={amount}
                clear
              />
              <View className='withdraw-body-btn' onClick={this.handleWithdrawAll}>
                全部提现
              </View>
            </View>
          </View>
        </View>
        <View className='section list'>
          <View className='list-item' style='position: relative'>
            {payList.length > 0 && (
              <Picker
                onChange={this.handlePick.bind(this)}
                mode='selector'
                range={payList}
                rangeKey='name'
              >
                <View className='pay-type-picker'></View>
              </Picker>
            )}
            <View className='label'>提现方式</View>
            <View className='list-item-txt content-right'>{payText[curIdx]}</View>
            <View className='iconfont item-icon-go icon-arrowRight'></View>
          </View>
          {curIdx === 'alipay' && (
            <Navigator url='/marketing/pages/distribution/withdrawals-acount' className='list-item'>
              <View className='label'>提现账户</View>
              <View className='list-item-txt content-right'>
                {alipay_account ? alipay_account : '去设置'}
              </View>
              <View className='iconfont item-icon-go icon-arrowRight'></View>
            </Navigator>
          )}
          {curIdx == 'bankcard' && bank_code && (
            <View className='list-item'>
              <View className='label'>银行卡</View>
              <View className='list-item-txt content-right'>{bank_code}</View>
            </View>
          )}
        </View>
        <View className='g-ul'>
          {curIdx == 'wechat' && (
            <View className='g-ul-li'>每月只能提取2次，每次需大于等于{limit_rebate}元</View>
          )}
          <View className='g-ul-li'>提现至银行卡需实名认证</View>
          <View className='g-ul-li'>提现申请审核通过后1个工作日后到账，节假日顺延</View>
          <View className='g-ul-li'>修改银行卡信息请前往实名认证信息进行修改</View>
        </View>
        <View className='content-padded'>
          <Button
            className='g-button'
            onClick={this.goWithdraw}
            disabled={curIdx == 'wechat' && amount > 800}
          >
            提现
          </Button>
        </View>
      </SpPage>
    )
  }
}
