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
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtTabBar } from 'taro-ui'

export default class TabBar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      backgroundColor: '',
      color: '#999999',
      selectedColor: '#000000',
      tabList: [
        {
          title: '首页',
          iconType: 'shouye',
          iconPrefixClass: 'icon',
          url: '/mdugc/pages/index/index'
        },
        {
          title: '分类',
          iconType: 'mquan',
          iconPrefixClass: 'icon',
          url: '/mdugc/pages/list/index'
        },
        { title: '创作', iconType: 'bi', iconPrefixClass: 'icon', url: '/mdugc/pages/make/index' },
        {
          title: '我的',
          iconType: 'gerenzhongxin',
          iconPrefixClass: 'icon',
          url: '/mdugc/pages/member/index'
        }
      ]
    }
  }

  handleClick = (current) => {
    const curTab = this.state.tabList[current]
    const { url } = curTab
    Taro.redirectTo({ url })
  }

  render() {
    const { color, backgroundColor, selectedColor, tabList } = this.state
    const { current } = this.props
    return (
      <View>
        <AtTabBar
          fixed
          color={color}
          backgroundColor={backgroundColor}
          selectedColor={selectedColor}
          tabList={tabList}
          onClick={this.handleClick}
          current={current}
        />
      </View>
    )
  }
}
