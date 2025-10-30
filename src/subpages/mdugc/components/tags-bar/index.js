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
import { View, ScrollView } from '@tarojs/components'

//import '../../font/iconfont.scss'
import './index.scss'

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

    this.state = {
      curId: ''
    }
  }
  componentWillReceiveProps(nextProps) {
    const { current } = nextProps
    this.setState({
      curId: current
    })
  }
  handleClickItem(id) {
    this.props.onChange(id)
  }
  delete(idx, e) {
    e && e.stopPropagation()
    this.props.delete(idx)
  }

  render() {
    const { list, isedit } = this.props
    const { curId } = this.state
    return (
      <ScrollView className='tags' scrollX>
        {list.length > 0 &&
          list.map((item, idx) => {
            const isCurrent = curId == item.topic_id

            return (
              <View
                className={isCurrent ? 'tag-item tag-item_active' : 'tag-item'}
                // style={isCurrent ? `color: ${colors.data[0].primary}` : `color: inherit;`}
                onClick={this.handleClickItem.bind(this, item.topic_id)}
                key={item.topic_id}
              >
                #{item.topic_name}
                {isedit && (
                  <View onClick={this.delete.bind(this, idx)} className='tag-item_delete'>
                    <View className='iconfont icon-tianjia1'></View>
                  </View>
                )}
              </View>
            )
          })}
      </ScrollView>
    )
  }
}
