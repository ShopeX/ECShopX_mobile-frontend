/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { withTranslation } from 'react-i18next'
import { SpInput as AtInput, SpPage } from '@/components'
import { showToast } from '@/utils'
import { $t } from '@/i18n'
import api from '@/api'
import './withdrawals-acount.scss'

class DistributionWithdrawalsAcount extends Component {
  constructor(props) {
    super(props)

    this.state = {
      acount: '',
      name: ''
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
      name: alipay_name || '',
      acount: alipay_account || ''
    })
  }

  handleChange = (name, val) => {
    this.setState({
      [name]: val
    })
  }

  handleSubmit = async () => {
    const { name, acount } = this.state
    if (!name) {
      return showToast($t('eacb27d9.8093e3'))
    }
    if (!acount) {
      return showToast($t('eacb27d9.f821a7'))
    }
    const params = {
      alipay_name: name,
      alipay_account: acount
    }
    const { list } = await api.distribution.update(params)
    const { alipay_name, alipay_account } = list[0]
    this.setState({
      name: alipay_name,
      acount: alipay_account
    })
    Taro.navigateBack()
  }

  render() {
    const { name, acount } = this.state

    return (
      <SpPage
        className='page-distribution-acount'
        footerHeight={186}
        renderFooter={
          <>
            <View className='content-padded'>
              <Button type='primary' onClick={this.handleSubmit}>
                {$t('eacb27d9.b7cfa0')}
              </Button>
            </View>
            <View className='g-ul'>
              <View className='g-ul-li'>{$t('eacb27d9.27e7b2')}</View>
            </View>
          </>
        }
      >
        <View className='section list message min-h-full'>
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
      </SpPage>
    )
  }
}

export default withTranslation()(DistributionWithdrawalsAcount)
