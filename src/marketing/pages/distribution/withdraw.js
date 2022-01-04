import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Navigator, Button, Picker } from '@tarojs/components'
import { AtInput } from 'taro-ui'
import api from '@/api'

import './withdraw.scss'

export default class DistributionWithdraw extends Component {
  constructor (props) {
    super(props)

    this.state = {
      limit_rebate: 0,
      cashWithdrawalRebate: 0,
      submitLoading: false,
      amount: null,
      curIdx: 'alipay',
      payList: [{ name: '支付宝', value: 'alipay' }],
      alipay_account: '',
      accountInfo: {}
    }
  }

  componentDidShow () {
    this.fetch()
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

  async fetch () {
    const { cashWithdrawalRebate } = await api.distribution.statistics()
    let res = await api.member.getTradePaymentList()
    let { payList } = this.state
    res.forEach((i) => {
      if (i.pay_type_code == 'wxpay') {
        payList.push({
          name: '微信(<=800)',
          value: 'wechat'
        })
      } else {
        payList.push({
          name: i.pay_type_name,
          value: i.pay_type_code
        })
      }
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
    // if (config.limit_rebate) {
    //   this.setState({
    //     limit_rebate: config.limit_rebate,
    //   })
    // }
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
  }

  render () {
    const { cashWithdrawalRebate, limit_rebate, amount, curIdx, payList, alipay_account } =
      this.state
    let payText = {
      'alipay': '支付宝',
      'wechat': '微信(<=800)',
      'hfpay': '微信支付'
    }
    return (
      <View className='page-distribution-withdraw'>
        <View className='section withdraw'>
          <View className='withdraw-title'>可提现金额(元)：￥{cashWithdrawalRebate / 100}</View>
          <View className='withdraw-body'>
            <AtInput
              className='withdraw-body-input'
              onChange={this.handleChange.bind(this)}
              type='number'
              placeholder='请输入提现金额'
              value={amount}
            />
            <View className='withdraw-body-btn' onClick={this.handleWithdrawAll}>
              全部提现
            </View>
          </View>
        </View>
        <View className='section list'>
          <View className='list-item' style='position: relative;'>
            <Picker onChange={this.handlePick.bind(this)} range={payList} rangeKey='name'>
              <View className='pay-type-picker'></View>
            </Picker>
            <View className='label'>提现方式</View>
            <View className='list-item-txt content-right'>{payText[curIdx]}</View>
            <View className='item-icon-go icon-arrowRight'></View>
          </View>
          {curIdx === 'alipay' && (
            <Navigator url='/marketing/pages/distribution/withdrawals-acount' className='list-item'>
              <View className='label'>提现账户</View>
              <View className='list-item-txt content-right'>
                {alipay_account ? alipay_account : '去设置'}
              </View>
              <View className='item-icon-go icon-arrowRight'></View>
            </Navigator>
          )}
        </View>
        <View className='content-padded'>
          <Button
            className="g-button {{isClick ? '_off' : ''}}"
            type='primary'
            onClick={this.goWithdraw}
            disabled={curIdx == 'wechat' && amount > 800}
          >
            提现
          </Button>
        </View>
        <View className='g-ul'>
          {curIdx == 'wechat' && (
            <View className='g-ul-li'>每月只能提取2次，每次需大于等于{limit_rebate}元</View>
          )}
          <View className='g-ul-li'>仅实名认证且绑卡会员才可提现</View>
          <View className='g-ul-li'>提现申请审核通过后1个工作日后到账</View>
          <View className='g-ul-li'>未实名认证的微信用户，将无法提现到收款账户</View>
        </View>
      </View>
    )
  }
}
