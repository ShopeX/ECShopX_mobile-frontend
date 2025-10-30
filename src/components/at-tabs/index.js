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
import { View, Image } from '@tarojs/components'
import { classNames } from '@/utils'
import { connect } from 'react-redux'
import './index.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))
export default class AtTabslist extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    tabList: [],
    onClick: () => {}
  }
  constructor(props) {
    super(props)
    this.state = {
      current: 0
    }
  }

  handleClick(value) {
    this.setState(
      {
        current: value
      },
      () => {
        this.props.onClick(value)
      }
    )
  }

  render() {
    const { current } = this.state
    const { tabList, colors } = this.props
    return (
      <View className='outer'>
        {tabList.map((item, index) => {
          return (
            <View
              key={`${index}1`}
              className='tab_li'
              style={current === index ? 'color:var(--color-primary)' : null}
              onClick={this.handleClick.bind(this, index)}
            >
              {item.tabTitle}
            </View>
          )
        })}
      </View>
    )
  }
}
