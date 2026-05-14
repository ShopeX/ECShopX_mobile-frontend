/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Navigator, Button, Picker } from '@tarojs/components'
import { withTranslation } from 'react-i18next'
import { isArray } from '@/utils'
import { SpPage, SpInput as AtInput } from '@/components'
import { $t, ti } from '@/i18n'
import api from '@/api'
import './withdraw.scss'

const PAY_TYPE_I18N = {
  alipay: '175b20c3.ccd097',
  wechat: '175b20c3.a53f1a',
  hfpay: '175b20c3.bffe28',
  bankcard: '175b20c3.774267'
}

class DistributionWithdraw extends Component {
  constructor(props) {
    super(props)

    this.state = {
      limit_rebate: 0,
      cashWithdrawalRebate: 0,
      amount: null,
      curIdx: 'alipay',
      payList: [],
      alipay_account: '',
      bank_code: null
    }
  }

  componentDidMount() {
    this.syncNavTitle()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.i18n?.language !== this.props.i18n?.language) {
      this.syncNavTitle()
    }
  }

  syncNavTitle = () => {
    Taro.setNavigationBarTitle({ title: $t('175b20c3.db7971') })
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
        content: $t('175b20c3.a27707'),
        confirmText: $t('175b20c3.5197d0'),
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

    this.setState({
      cashWithdrawalRebate,
      payList
    })

    const { alipay_account, config } = await api.distribution.info()

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
    }

    if (!this.state.bank_code && curIdx === 'bankcard') {
      this.ongetCertInfo()
      return
    }

    const { confirm } = await Taro.showModal({
      title: $t('175b20c3.77ffa4'),
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

    const payTypeLabel = (code) => $t(PAY_TYPE_I18N[code] || PAY_TYPE_I18N.alipay)

    return (
      <SpPage
        className='page-distribution-withdraw'
        footerHeight={186}
        renderFooter={
          <View className='content-padded'>
            <Button
              className='g-button'
              onClick={this.goWithdraw}
              disabled={curIdx == 'wechat' && amount > 800}
            >
              {$t('175b20c3.db7971')}
            </Button>
          </View>
        }
      >
        <View className='min-h-full'>
          <View className='withdraw'>
            <View className='withdraw-title'>
              <View className='title'>{$t('175b20c3.70f8f2')}</View>
              <View className='content'>{cashWithdrawalRebate / 100}</View>
            </View>
            <View className='withdraw-body'>
              <View style={{ color: '#666666' }}>{$t('175b20c3.292a28')}</View>
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
                  {$t('175b20c3.5eb161')}
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
              <View className='label'>{$t('175b20c3.e5bd6e')}</View>
              <View className='list-item-txt content-right'>{payTypeLabel(curIdx)}</View>
              <View className='iconfont item-icon-go icon-arrowRight'></View>
            </View>
            {curIdx === 'alipay' && (
              <Navigator
                url='/marketing/pages/distribution/withdrawals-acount'
                className='list-item'
              >
                <View className='label'>{$t('175b20c3.24f1fc')}</View>
                <View className='list-item-txt content-right'>
                  {alipay_account ? alipay_account : $t('175b20c3.241141')}
                </View>
                <View className='iconfont item-icon-go icon-arrowRight'></View>
              </Navigator>
            )}
            {curIdx == 'bankcard' && bank_code && (
              <View className='list-item'>
                <View className='label'>{$t('175b20c3.774267')}</View>
                <View className='list-item-txt content-right'>{bank_code}</View>
              </View>
            )}
          </View>
          <View className='g-ul'>
            {curIdx == 'wechat' && (
              <View className='g-ul-li'>{ti('175b20c3.003548', [limit_rebate])}</View>
            )}
            <View className='g-ul-li'>{$t('175b20c3.12dbb6')}</View>
            <View className='g-ul-li'>{$t('175b20c3.b3b4c6')}</View>
            <View className='g-ul-li'>{$t('175b20c3.06099f')}</View>
          </View>
        </View>
      </SpPage>
    )
  }
}

export default withTranslation()(DistributionWithdraw)
