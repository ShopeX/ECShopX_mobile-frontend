/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Input, Image } from '@tarojs/components'
import { AtModal, AtModalContent, AtModalAction } from 'taro-ui'
import { connect } from 'react-redux'
import api from '@/api'
import { SpNavBar, SpPage } from '@/components'
import { $t } from '@/i18n'

import './index.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))
export default class BindOrder extends Component {
  constructor(props) {
    super(props)
    this.state = {
      barCode: '',
      randomCode: '',
      showModal: false,
      tips: '',
      tipImg: ''
    }
  }

  showTips = (tipType) => {
    const tips = tipType ? $t('93f1e195.e5834e') : $t('93f1e195.cdab0c')
    const img = tipType ? require('./img/barCode.png') : require('./img/randomCode.png')
    this.setState({
      tips,
      tipImg: img,
      showModal: true
    })
  }

  hideModal = () => {
    this.setState({
      showModal: false
    })
  }

  scanCode = async (e) => {
    e.stopPropagation()
    const { result = '' } = await Taro.scanCode()
    this.setState({
      barCode: result
    })
  }

  inputChange = (type, e) => {
    const { value } = e.detail
    this.setState({
      [type]: value
    })
  }

  bindOrder = async () => {
    const { barCode, randomCode } = this.state
    if (!barCode || !randomCode) {
      Taro.showToast({
        title: $t('93f1e195.2b044c'),
        icon: 'none'
      })
      return false
    }
    const params = {
      order_id: barCode,
      auth_code: randomCode
    }
    try {
      await api.trade.bindOrder(params)
      this.setState({
        barCode: '',
        randomCode: ''
      })
      Taro.showToast({
        title: $t('93f1e195.9ec4dc'),
        icon: 'none'
      })
    } catch (e) {}
  }

  render() {
    const { barCode, randomCode, showModal, tips, tipImg } = this.state
    const { colors } = this.props

    return (
      <SpPage
        className='bindOrder'
        renderFooter={
          <View
            className='btn'
            style={`background: ${colors.data[0].primary}`}
            onClick={this.bindOrder.bind(this)}
          >
            {$t('93f1e195.1c3cf7')}
          </View>
        }
      >
        <View className='min-h-full bind-order-content'>
          <View className='barCode'>
            <View className='line'>
              {$t('93f1e195.a3b79c')}
              <View className='iconfont icon-info' onClick={this.showTips.bind(this, 1)}></View>
            </View>
            <View className='input'>
              <Input
                className='text'
                value={barCode}
                type='text'
                placeholder={$t('93f1e195.1e8dc2')}
                onInput={this.inputChange.bind(this, 'barCode')}
              />
              <View className='iconfont icon-scan' onClick={this.scanCode.bind(this)}></View>
            </View>
          </View>
          <View className='barCode'>
            <View className='line'>
              {$t('93f1e195.f75552')}
              <View className='iconfont icon-info' onClick={this.showTips.bind(this, 0)}></View>
            </View>
            <View className='input'>
              <Input
                className='text'
                value={randomCode}
                type='text'
                placeholder={$t('93f1e195.3aa27a')}
                onInput={this.inputChange.bind(this, 'randomCode')}
              />
            </View>
          </View>
          <AtModal isOpened={showModal} className='tipsModal' onClose={this.hideModal.bind(this)}>
            <AtModalContent>
              {tips}
              <Image src={tipImg} className='img' mode='aspectFit' />
            </AtModalContent>
            <AtModalAction>
              <View
                className='confirm'
                onClick={this.hideModal.bind(this)}
                style={`background: ${colors.data[0].primary}`}
              >
                {$t('61e2d21a.e83a25')}
              </View>
            </AtModalAction>
          </AtModal>
        </View>
      </SpPage>
    )
  }
}
