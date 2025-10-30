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
import { classNames, isArray } from '@/utils'

import './index.scss'

export default class SpFilterBar extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    sort: {},
    current: 0,
    list: []
  }

  constructor(props) {
    super(props)

    const { current } = props
    this.state = {
      curIdx: current,
      sortOrder: 1
    }
  }

  handleClickItem(idx, type = '') {
    const item = this.props.list[idx]
    let sortOrder = null
    if (typeof item.sort !== 'undefined') {
      sortOrder = idx === this.state.curIdx ? this.state.sortOrder * -1 : item.sort
    }

    this.setState({
      curIdx: idx,
      sortOrder
    })
    console.log('handleClickItem', idx, sortOrder, type)
    this.props.onChange({
      current: idx,
      sort: sortOrder,
      type
    })
  }

  render() {
    const { list, className, custom, color } = this.props
    const { sortOrder, curIdx } = this.state
    return (
      <View className={classNames('sp-filter-bar', className)}>
        <View className='filter-bar-body'>
          {custom &&
            list.map((item, idx) => (
              <View
                className={classNames('sp-filter-bar__item', {
                  active: curIdx === idx
                })}
                onClick={this.handleClickItem.bind(this, idx, item.type)}
                key={`sp-filter-bar-item__${idx}`}
              >
                <Text className={`sp-filter-bar__item-text ${curIdx === idx ? 'active' : ''}`}>
                  {item.title}
                </Text>
                {item.icon && (
                  <Text
                    className={classNames(
                      'iconfont',
                      isArray(item.icon) ? item.icon[sortOrder == 1 ? 0 : 1] : item.icon
                    )}
                  ></Text>
                )}
              </View>
            ))}
        </View>
        <View className='sp-filter-bar__extra'>{this.props.children}</View>
      </View>
    )
  }
}
