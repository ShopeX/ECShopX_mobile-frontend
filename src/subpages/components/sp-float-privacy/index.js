/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { Button, View, Text } from '@tarojs/components'
import { connect } from 'react-redux'
import { AtButton, AtFloatLayout } from 'taro-ui'
import S from '@/spx'
import api from '@/api'
import { isWeixin, isWeb, isAlipay, classNames, showToast, navigateTo } from '@/utils'
import { i18n } from '@/i18n'
// import { Tracker } from '@/service'
import './index.scss'

@connect(
  () => ({}),
  (dispatch) => ({
    setMemberInfo: (memberInfo) => dispatch({ type: 'member/init', payload: memberInfo })
  })
)
export default class SpFloatPrivacy extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    isOpened: false,
    wxUserInfo: true,
    callback: () => {},
    onClose: () => {},
    onConfirm: () => {},
    onChange: () => {}
  }

  constructor(props) {
    super(props)
    this.state = {
      info: null
    }
  }

  componentDidMount() {
    this.fetch()
    this._onI18n = () => this.forceUpdate()
    i18n.on('languageChanged', this._onI18n)
  }

  componentWillUnmount() {
    i18n.off('languageChanged', this._onI18n)
  }

  async fetch() {
    const data = await api.shop.getStoreBaseInfo()
    this.setState({
      info: data
    })
  }

  navigateTo = navigateTo

  handleCancel() {
    this.props.onClose()
  }

  handleValidate = (fn) => {
    this.handleCancel()
    if (this.props.wxUserInfo) {
      fn && fn()
    } else {
      this.props.onChange()
    }
    Taro.setStorageSync('Privacy_agress', '1')
  }

  handleConfirm() {
    this.handleValidate(() => {
      S?.OAuthWxUserProfile(() => {
        this.props.onChange()
      }, true)
    })
  }

  handleConfirmAlipay = (e) => {
    this.handleValidate(() => {
      if (!S.getAuthToken()) {
        showToast(i18n.t('ed40c676.8d2433'))
        return
      }
      my.getOpenUserInfo({
        fail: (res) => {},
        success: async (res) => {
          let userInfo = JSON.parse(res.response).response
          await api.member.updateMemberInfo({
            username: userInfo.nickName,
            avatar: userInfo.avatar
          })
          await S?.getMemberInfo()
          this.props.onChange()
        }
      })
    })
  }

  render() {
    const { isOpened } = this.props
    const { info } = this.state
    if (!info) {
      return null
    }
    return (
      <View
        className={classNames(
          'sp-float-privacy',
          {
            'sp-float-privacy__active': isOpened
          },
          this.props.className
        )}
      >
        <View className='sp-float-privacy__overlay'></View>
        <View className='sp-float-privacy__wrap'>
          <View className='privacy-hd'>{i18n.t('ed40c676.5a98bd')}</View>

          {(isWeixin || isWeb) && (
            <View className='privacy-bd'>
              <Text>{i18n.t('ed40c676.dc9930')}</Text>
              <Text>{i18n.t('ed40c676.267f96')}</Text>
              <Text
                className='privacy-txt'
                onClick={this.navigateTo.bind(this, '/subpages/auth/reg-rule?type=member_register')}
              >
                《{info.protocol.member_register}》
              </Text>
              <Text>{i18n.t('ed40c676.b50566')}</Text>
              <Text
                className='privacy-txt'
                onClick={this.navigateTo.bind(this, '/subpages/auth/reg-rule?type=privacy')}
              >
                《{info.protocol.privacy}》
              </Text>
              <Text>{i18n.t('ed40c676.4d67be')}</Text>
              <Text>{i18n.t('ed40c676.252e94')}</Text>
              <Text>{i18n.t('ed40c676.5c1d13')}</Text>
            </View>
          )}

          {isAlipay && (
            <View className='privacy-bd'>
              <Text>{i18n.t('ed40c676.252e94')}</Text>
              <Text>{i18n.t('ed40c676.5c1d13')}</Text>
            </View>
          )}

          <View className='privacy-ft'>
            <View className='btn-wrap'>
              <AtButton onClick={this.handleCancel.bind(this)}>
                {i18n.t('ed40c676.1bf19c')}
              </AtButton>
            </View>
            <View className='btn-wrap'>
              {isWeixin && (
                <AtButton type='primary' onClick={this.handleConfirm.bind(this)}>
                  {i18n.t('ed40c676.e61f2c')}
                </AtButton>
              )}
              {isAlipay && (
                <Button
                  className='ali-button'
                  openType='getAuthorize'
                  scope='userInfo'
                  onGetAuthorize={this.handleConfirmAlipay}
                >
                  {i18n.t('ed40c676.e61f2c')}
                </Button>
              )}
            </View>
          </View>
        </View>
      </View>
    )
  }
}
