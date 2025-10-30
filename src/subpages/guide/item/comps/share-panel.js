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
import { View, Button } from '@tarojs/components'
import { AtFloatLayout } from 'taro-ui'

import './share-panel.scss'

export default class SharePanel extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null,
    onClose: () => {},
    onClick: () => {}
  }
  render() {
    const { info, isOpen, onClose, onClick } = this.props

    return (
      <AtFloatLayout isOpened={isOpen} title=' ' onClose={onClose} scrollX={false} scrollY={false}>
        <View className='share-panel'>
          <View className='share-panel__item'>
            <Button openType='share' className='icon-weChart'>
              <View
                style='font-size:80rpx;margin-bottom:24rpx'
                className='at-icon at-icon-message'
              ></View>
              <View>分享给微信好友</View>
            </Button>
          </View>
          <View className='share-panel__item' onClick={onClick}>
            <View className='icon-picture1'></View>
            <View>生成分享图片</View>
          </View>
        </View>
      </AtFloatLayout>
    )
  }
}
