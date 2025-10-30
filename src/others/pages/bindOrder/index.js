// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Input, Image } from '@tarojs/components'
import { AtModal, AtModalContent, AtModalAction } from 'taro-ui'
import { connect } from 'react-redux'
import api from '@/api'
import { SpNavBar } from '@/components'

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
    const tips = tipType
      ? '找到门店购物小票如下图红框位置，可手动输入或者扫码输入订单号'
      : '找到门店购物小票如下图红框位置内容输入'
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
        title: '请输入订单号和随机码',
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
        title: '关联成功，请至订单列表查看',
        icon: 'none'
      })
    } catch (e) {}
  }

  render() {
    const { barCode, randomCode, showModal, tips, tipImg } = this.state
    const { colors } = this.props

    return (
      <View className='bindOrder'>
        <SpNavBar title='线下订单关联' leftIconType='chevron-left' fixed='true' />
        <View className='barCode'>
          <View className='line'>
            请输入或者扫码录入订单号
            <View className='iconfont icon-info' onClick={this.showTips.bind(this, 1)}></View>
          </View>
          <View className='input'>
            <Input
              className='text'
              value={barCode}
              type='text'
              placeholder='订单号'
              onInput={this.inputChange.bind(this, 'barCode')}
            />
            <View className='iconfont icon-scan' onClick={this.scanCode.bind(this)}></View>
          </View>
        </View>
        <View className='barCode'>
          <View className='line'>
            请输入订单随机码
            <View className='iconfont icon-info' onClick={this.showTips.bind(this, 0)}></View>
          </View>
          <View className='input'>
            <Input
              className='text'
              value={randomCode}
              type='text'
              placeholder='随机码'
              onInput={this.inputChange.bind(this, 'randomCode')}
            />
          </View>
        </View>
        <View
          className='btn'
          style={`background: ${colors.data[0].primary}`}
          onClick={this.bindOrder.bind(this)}
        >
          关联
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
              确认
            </View>
          </AtModalAction>
        </AtModal>
      </View>
    )
  }
}
