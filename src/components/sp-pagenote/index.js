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
import { View, Text } from '@tarojs/components'
import { classNames, navigateTo } from '@/utils'
import SpLoading from '../sp-loading'
import SpNote from '../sp-note'

import './index.scss'

export default class SpPageNote extends Component {
  static defaultProps = {
    info: null,
    to: ''
  }

  static options = {
    addGlobalClass: true
  }

  navigateTo = navigateTo

  handleClick = () => {}

  render() {
    const { info: page, className, title, button, value, btnText, to } = this.props
    if (!page) {
      return null
    }
    return (
      <View className={classNames('sp-page-note', className)}>
        {page.isLoading && <SpLoading>正在加载...</SpLoading>}
        {page.done && page.total == 0 && (
          <SpNote icon title='没有查询到数据' button btnText='去逛逛' to={to} />
        )}
        {!page.isLoading && !page.hasNext && page.total > 0 && (
          <SpNote className='no-more' title='--没有更多数据了--'></SpNote>
        )}
      </View>
    )
  }
}
