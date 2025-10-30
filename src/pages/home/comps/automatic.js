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
import { View, Image, Button } from '@tarojs/components'

import './automatic.scss'

export default class Automatic extends Component {
  static defaultProps = {
    info: null,
    onClick: () => {},
    onClose: () => {}
  }

  static options = {
    addGlobalClass: true
  }

  render() {
    const { info, onClick, onClose, isShow } = this.props

    if (!info) {
      return null
    }

    return (
      <View>
        {isShow && (
          <View className='gift-wrap'>
            <View className='gift'>
              <Image className='gift-bg' src={info.adPic} mode='widthFix' />
              <Button className={`btn-primary ${info.title ? null : 'gift-btn'}`} onClick={onClick}>
                {info.title}
              </Button>
              <View className='zoom-btn iconfont icon-close' onClick={onClose}></View>
            </View>
          </View>
        )}
      </View>
    )
  }
}
