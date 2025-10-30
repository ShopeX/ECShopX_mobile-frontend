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
import { classNames, linkPage } from '@/utils'
import './hot-topic.scss'

export default class WgtHotTopic extends Component {
  static options = {}

  static defaultProps = {
    info: {}
  }

  constructor(props) {
    super(props)
    this.state = {
      current: '',
      list: []
    }
  }

  componentDidMount() {
    const { info } = this.props
    this.setState({
      list: info.data
    })
  }

  handleClick(value, Page, id) {
    this.setState({
      current: value
    })
    linkPage(Page, id)
  }

  render() {
    const { current, list } = this.state
    const { info } = this.props
    const { base } = info

    return (
      <View
        className={classNames('wgt', 'wgt-hot-topic', {
          'wgt__padded': base.padded
        })}
      >
        {base.title && (
          <View className='wgt-head'>
            <View className='wgt-hd'>
              <Text className='wgt-title'>{base.title}</Text>
            </View>
          </View>
        )}
        <View className='wgt-body topic-list'>
          {list.map((item, idx) => {
            return (
              <View
                key={`wgt-hot__${idx}`}
                className={classNames('topic-list-gambit', idx === current ? 'checked' : '')}
                onClick={this.handleClick.bind(this, idx, item)}
              >
                {item.topic}
              </View>
            )
          })}
        </View>
      </View>
    )
  }
}
