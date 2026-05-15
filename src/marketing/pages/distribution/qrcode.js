/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { SpNavBar, SpPage } from '@/components'
import { $t } from '@/i18n'
import api from '@/api'
import userIcon from '@/assets/imgs/user-icon.png'
import './qrcode.scss'

class DistributionQrcode extends Component {
  $instance = getCurrentInstance() || {}
  constructor(props) {
    super(props)

    this.state = {
      info: {}
    }
  }

  componentDidMount() {
    const { colors } = this.props
    Taro.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: colors.data[0].marketing
    })
    this.fetch()
  }

  async fetch() {
    const { username, avatar } = Taro.getStorageSync('userinfo')
    let { isOpenShop, status } = this.$instance?.router?.params
    isOpenShop = JSON.parse(isOpenShop)
    status = JSON.parse(status)
    const url = isOpenShop && status ? `marketing/pages/distribution/shop-home` : `pages/index`
    const res = await api.distribution.qrcode({ path: url })
    const { qrcode } = res

    this.setState({
      info: {
        username,
        avatar,
        qrcode
      }
    })
  }

  render() {
    const { colors } = this.props
    const { info } = this.state

    return (
      <SpPage
        className='page-distribution-qrcode'
        style={'background: ' + colors.data[0].marketing}
      >
        <SpNavBar title={$t('91ef1ae8.22b03c')} leftIconType='chevron-left' />
        <View className='page-distribution-qrcode-content h-full w-full'>
          <View className='qrcode-bg'>
            <View className='title'>{$t('91ef1ae8.634a7a')}</View>
            <Image className='avatar' src={info.avatar || userIcon} mode='aspectFit' />
            <View className='name'>{info.username}</View>
            <View className='welcome-words'>{$t('91ef1ae8.b3fd8b')}</View>
            <View className='qrcode'>
              <Image src={info.qrcode} mode='aspectFit' />
            </View>
            <View className='tips'>{$t('91ef1ae8.e28e53')}</View>
          </View>
        </View>
      </SpPage>
    )
  }
}

export default connect(({ colors }) => ({
  colors: colors.current
}))(withTranslation()(DistributionQrcode))
