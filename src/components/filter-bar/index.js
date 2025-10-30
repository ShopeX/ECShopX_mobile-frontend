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
import { connect } from 'react-redux'
import { classNames } from '@/utils'

import './index.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))
export default class FilterBar extends Component {
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
      sortOrder: null
    }
  }

  handleClickItem(idx) {
    const item = this.props.list[idx]
    let sortOrder = null

    if (item.sort) {
      sortOrder = idx === this.state.curIdx ? this.state.sortOrder * -1 : item.sort
    }

    this.setState({
      curIdx: idx,
      sortOrder
    })

    this.props.onChange({
      current: idx,
      sort: sortOrder
    })
  }

  render() {
    const { list, className, custom, colors } = this.props
    const { sortOrder, curIdx } = this.state

    return (
      <View className={classNames('filter-bar', className)}>
        {custom &&
          list.map((item, idx) => {
            const isCurrent = curIdx === idx

            return (
              <View
                className={classNames(
                  'filter-bar__item',
                  isCurrent && 'filter-bar__item-active',
                  item.key && `filter-bar__item-${item.key}`,
                  item.sort
                    ? `filter-bar__item-sort filter-bar__item-sort-${
                        sortOrder > 0 ? 'asc' : 'desc'
                      }`
                    : null
                )}
                style={isCurrent ? 'color: ' + colors.data[0].primary : 'color: #999999'}
                onClick={this.handleClickItem.bind(this, idx)}
                key={item.title}
              >
                <Text className='filter-bar__item-text'>{item.title}</Text>
                <View className='active-bar' style={'background: ' + colors.data[0].primary}></View>
              </View>
            )
          })}
        {this.props.children}
      </View>
    )
  }
}
