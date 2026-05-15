/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { withTranslation } from 'react-i18next'
import { showToast } from '@/utils'
import { SpInput as AtInput } from '@/components'
import { $t } from '@/i18n'
import api from '@/api'
import './withdrawals-acount.scss'

class DistributionWithdrawalsAcount extends Component {
  constructor(props) {
    super(props)

    this.state = {
      acount: '',
      name: '',
      new_acount: '',
      hasBind: false,
      isEdit: false
    }
  }

  componentDidMount() {
    this.syncNavTitle()
    this.fetch()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.i18n?.language !== this.props.i18n?.language) {
      this.syncNavTitle()
    }
  }

  syncNavTitle = () => {
    Taro.setNavigationBarTitle({ title: $t('175b20c3.24f1fc') })
  }

  async fetch() {
    const { alipay_name, alipay_account } = await api.distribution.info()
    this.setState({
      name: alipay_name,
      acount: alipay_account,
      hasBind: !!alipay_name && !!alipay_account
    })
  }

  handleChange = (name, val) => {
    this.setState({
      [name]: val
    })
  }

  handleClick = () => {
    this.setState({
      isEdit: true
    })
  }

  handleSubmit = async () => {
    const { name, acount, new_acount, hasBind, isEdit } = this.state
    if (!name) {
      return showToast($t('eacb27d9.8093e3'))
    }
    if (!acount) {
      return showToast($t('eacb27d9.f821a7'))
    }
    const params = {
      alipay_name: name,
      //alipay_account: !hasBind ? acount : new_acount
      alipay_account: acount
    }
    const { list } = await api.distribution.update(params)
    const { alipay_name, alipay_account } = list[0]
    this.setState({
      name: alipay_name,
      acount: alipay_account,
      new_acount: '',
      isEdit: false
    })
    Taro.navigateBack()
  }

  render() {
    const { name, acount, isEdit, hasBind } = this.state
    console.log('00', hasBind)

    return (
      <View className='page-distribution-acount'>
        <View className='section list message'>
          <AtInput
            className='message-input'
            title={$t('eacb27d9.094eee')}
            type='text'
            maxLength='30'
            name='name'
            onChange={this.handleChange.bind(this, 'name')}
            value={name}
            placeholder={$t('eacb27d9.fb1b19')}
          />
          <AtInput
            className='message-input'
            title={$t('eacb27d9.83ab43')}
            type='text'
            maxLength='30'
            name='acount'
            onChange={this.handleChange.bind(this, 'acount')}
            value={acount}
            placeholder={$t('eacb27d9.f821a7')}
          />
        </View>
        <View className='content-padded'>
          <Button type='primary' onClick={this.handleSubmit}>
            {$t('eacb27d9.b7cfa0')}
          </Button>
          {/* { !hasBind && <Button type="primary" onClick={this.handleSubmit}>确认绑定</Button> }
          { hasBind && !isEdit && <Button type="primary" onClick={this.handleClick}>修改支付宝账号</Button> }
          { hasBind && isEdit && <Button type="primary" onClick={this.handleSubmit}>确认修改并保存</Button> } */}
        </View>
        <View className='g-ul'>
          <View className='g-ul-li'>{$t('eacb27d9.27e7b2')}</View>
          {/* <View className="g-ul-li">支持支付宝账户的修改，但每天仅限1次</View> */}
        </View>
      </View>
    )
  }
}

export default withTranslation()(DistributionWithdrawalsAcount)
