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
import { View, ScrollView } from '@tarojs/components'
import { connect } from 'react-redux'
import { classNames } from '@/utils'

import './index.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))
export default class TagsBar extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    current: '',
    list: []
  }

  constructor(props) {
    super(props)

    const { current } = props
    this.state = {
      curId: current
    }
  }

  handleClickItem(id) {
    this.setState({
      curId: id
    })
    this.props.onChange({
      current: id
    })
  }

  render() {
    const { list, colors } = this.props

    return (
      <ScrollView className='tags' scrollX>
        {list.length > 0 &&
          list.map((item, idx) => {
            const isCurrent = this.state.curId === item.tag_id

            return (
              <View
                className='tag-item'
                style={isCurrent ? `color: ${colors.data[0].primary}` : `color: inherit;`}
                onClick={this.handleClickItem.bind(this, item.tag_id)}
                key={item.tag_id}
              >
                {item.tag_name}
              </View>
            )
          })}
      </ScrollView>
    )
  }
}
