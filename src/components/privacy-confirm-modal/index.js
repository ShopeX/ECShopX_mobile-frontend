/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Image, Button, Text } from '@tarojs/components'
import api from '@/api'
import { connect } from 'react-redux'
import i18n, { $t } from '@/i18n'

import './index.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))
export default class PrivacyConfirmModal extends Component {
  static defaultProps = {}
  constructor(props) {
    super(props)
    this.state = {
      info: null
    }
  }

  componentDidMount() {
    this.fetch()
    i18n.on('languageChanged', this.handleLanguageChanged)
  }

  componentWillUnmount() {
    i18n.off('languageChanged', this.handleLanguageChanged)
  }

  handleLanguageChanged = () => {
    this.forceUpdate()
  }

  handleClickAgreement = (type) => {
    Taro.navigateTo({
      url: '/subpages/auth/reg-rule?type=' + type
    })
  }

  async fetch() {
    const data = await api.shop.getStoreBaseInfo()
    this.setState({
      info: data
    })
  }

  wexinBindPhone = async (e) => {
    const { encryptedData, iv } = e.detail
    const { onChange } = this.props
    if (encryptedData && iv) {
      const { update_time } = await api.wx.getPrivacyTime()
      Taro.setStorageSync('policy_updatetime', update_time)
    }
    onChange && onChange('agree', e)
  }

  render() {
    const { info } = this.state
    const { visible, onChange, isPhone, colors } = this.props

    return (
      <View>
        {visible && (
          <View className='privacy-confirm-modal'>
            <View className='block'>
              <Image
                src='https://b-img-cdn.yuanyuanke.cn/image/21/2021/11/11/ceb224c25e89e4960dd85e30c82983f3oF9GVfNTQKu3n0hXhf2774ZxYlF1Yhgx'
                className='background'
              />
              <View className='container'>
                <View className='top'>
                  <Image src={`${process.env.APP_IMAGE_CDN}/privacy_tips.png`} className='tips' />
                  <View className='texts'>{$t('ed40c676.5a98bd')}</View>
                </View>
                <View className='content'>
                  <Text>{$t('c1881067.fe728a')}</Text>
                  <Text
                    style={`color: ${colors.data[0].primary}`}
                    onClick={this.handleClickAgreement.bind(this, 'member_register')}
                  >
                    《{(info || { protocol: {} }).protocol.member_register}》
                  </Text>
                  <Text>{$t('ed40c676.b50566')}</Text>
                  <Text
                    style={`color: ${colors.data[0].primary}`}
                    onClick={this.handleClickAgreement.bind(this, 'privacy')}
                  >
                    《{(info || { protocol: {} }).protocol.privacy}》
                  </Text>
                  <Text>{$t('ed40c676.4d67be')}</Text>
                </View>
                <View className='bottom-box'>
                  <Button className='cancel' onClick={() => onChange('reject')}>
                    {$t('7c40f12d.7173f8')}
                  </Button>
                  {isPhone ? (
                    <Button
                      style={`background: ${colors.data[0].primary}`}
                      className='agree'
                      openType='getPhoneNumber'
                      onGetPhoneNumber={this.wexinBindPhone}
                    >
                      {$t('ed40c676.e61f2c')}
                    </Button>
                  ) : (
                    <Button
                      style={`background: ${colors.data[0].primary}`}
                      onClick={() => onChange('agree')}
                      className='agree'
                    >
                      {$t('ed40c676.e61f2c')}
                    </Button>
                  )}
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    )
  }
}
