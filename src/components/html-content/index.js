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
import { View, RichText } from '@tarojs/components'
import { classNames } from '@/utils'
import { wxParse } from '@/components/wxParse/wxParse'
import './index.scss'

// let wxParse;
// if (process.env.TARO_ENV === "weapp") {
//   wxParse = require("@/components/wxParse/wxParse");
// }

export default class HtmlContent extends Component {
  static defaultProps = {
    content: ''
  }

  static options = {
    addGlobalClass: true
  }

  componentDidMount() {
    if (process.env.TARO_ENV === 'weapp') {
      const { content } = this.props
      wxParse('content', 'html', content, this)
    }
  }

  render() {
    const { className } = this.props
    const classes = classNames('html-content', className)

    return process.env.TARO_ENV === 'weapp' ? (
      <View className={classes}>
        <import src='../../components/wxParse/wxParse.wxml' />
        <template is='wxParse' data='{{wxParseData:content.nodes}}' />
      </View>
    ) : (
      <View className={classes} dangerouslySetInnerHTML={{ __html: this.props.content }} />
    )
  }
}
