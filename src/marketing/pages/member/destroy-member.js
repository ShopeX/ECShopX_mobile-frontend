/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from 'react-redux'
import { SpPage, SpCheckbox } from '@/components'
import { $t, ti } from '@/i18n'
import req from '@/api/req'
import configStore from '@/store'
import { VERSION_IN_PURCHASE } from '@/utils'
import DestoryConfirm from './comps/destory-comfirm-modal'
import './destroy-member.scss'

const { store } = configStore()

class SettingIndex extends Component {
  $instance = getCurrentInstance() || {}

  constructor(props) {
    super(props)
    this.state = {
      checked: false,
      visible: false,
      title: '',
      content: '',
      confirmBtnContent: '',
      cancelBtnContent: ''
    }
  }

  syncNavTitle = () => {
    Taro.setNavigationBarTitle({ title: $t('20b64b82.ec41af') })
  }

  componentDidMount() {
    this.syncNavTitle()
  }

  componentDidUpdate(prevProps) {
    if (this.props.i18n?.language !== prevProps.i18n?.language) {
      this.syncNavTitle()
    }
  }

  handleSelect = () => {
    this.setState({
      checked: !this.state.checked
    })
  }

  handleNextStep = (checked) => {
    if (checked) {
      this.setState({
        visible: true,
        title: $t('684b1635.322e52'),
        content: $t('684b1635.d09541'),
        confirmBtnContent: $t('684b1635.c0498d'),
        cancelBtnContent: $t('684b1635.0e166a')
      })
    } else {
      Taro.showToast({ title: $t('684b1635.9b477c'), icon: 'none' })
    }
  }

  handCancel = (parmas) => {
    if (parmas === 'cancel') {
      // 确认注销账号
      req.delete('/member', { is_delete: '1' }).then((res) => {
        if (res.status) {
          Taro.removeStorageSync('token')
          Taro.removeStorageSync('policy_updatetime')
          store.dispatch({
            type: 'user/clearUserInfo'
          })
          Taro.reLaunch({
            url: VERSION_IN_PURCHASE ? '/pages/purchase/auth' : '/pages/index'
          })
        }
      })
    }
    this.setState({ visible: false })
  }

  render() {
    const { checked, visible, content, title, cancelBtnContent, confirmBtnContent } = this.state
    const { colors } = this.props
    return (
      <SpPage className='destory-member'>
        <View className='title'>
          {ti('684b1635.71d218', [this.$instance?.router?.params?.phone || ''])}
        </View>
        <View className='content'>
          <View className='margin fonts'>{$t('684b1635.bb4a6d')}</View>
          <View className='fonts'>{$t('684b1635.a84798')}</View>
          <View className='fonts'>{$t('684b1635.674222')}</View>
          <View className='fonts'>{$t('684b1635.50b09b')}</View>
          <View className='fonts'>{$t('684b1635.e21bb2')}</View>
          <View className='fonts'>{$t('684b1635.22d9bc')}</View>
          <View className='bottom fonts'>{$t('684b1635.e1b655')}</View>
        </View>
        <View
          className='button'
          style={`background: ${colors.data[0].primary}`}
          onClick={this.handleNextStep.bind(this, checked)}
        >
          {$t('d121a348.38ce27')}
        </View>
        <View className='check-box'>
          <SpCheckbox checked={checked} colors={colors} onChange={this.handleSelect.bind(this)} />
          <View>
            {$t('4289b966.ed8fae')}
            <Text
              onClick={() => Taro.navigateTo({ url: '/subpages/auth/reg-rule?type=member_logout' })}
              style={`color: ${colors.data[0].primary}`}
            >
              {$t('684b1635.1ac19b')}
            </Text>
          </View>
        </View>
        <DestoryConfirm
          visible={visible}
          content={content}
          title={title}
          cancelBtn={cancelBtnContent}
          confirmBtn={confirmBtnContent}
          onCancel={this.handCancel}
        />
      </SpPage>
    )
  }
}

export default connect(({ colors }) => ({
  colors: colors.current
}))(withTranslation()(SettingIndex))
