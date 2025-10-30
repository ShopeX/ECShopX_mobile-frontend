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
import { View, Button } from '@tarojs/components'

import './item.scss'

export default class Index extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    onClick: null,
    iconPrefixClass: 'sp-icon',
    icon: '',
    openType: null,
    hide: false
  }

  render() {
    const { onClick, openType, iconPrefixClass, hide, icon, sessionFrom } = this.props

    return (
      <Button
        className={`float-menu__item  ${hide ? 'hidden' : ''}`}
        onClick={onClick}
        openType={openType}
        sessionFrom={sessionFrom || ''}
      >
        <View className={`iconfont ${iconPrefixClass}-${icon}`}></View>
        {this.props.children}
      </Button>
    )
  }
}
