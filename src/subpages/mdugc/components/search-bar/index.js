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
import { View, Form, Text, Image } from '@tarojs/components'
import { AtSearchBar } from 'taro-ui'

import './index.scss'

export default class SearchBar extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  handleChangeSearch = (value) => {
    this.props.onChange(value)
  }

  handleClear = () => {
    this.props.onClear()
  }

  handleConfirm = (e) => {
    this.props.onConfirm(e.detail.value)
  }

  render() {
    const { keyword, _placeholder, bgc, maxLength } = this.props
    const {} = this.state
    return (
      <View className='search-inputugc'>
        <Form className='search-inputugc__form'>
          <AtSearchBar
            className={bgc ? 'search-inputugc__bar' : 'search-inputugc__bar search-inputugc__bgc'}
            value={keyword}
            placeholder={!_placeholder ? '请输入关键词' : _placeholder}
            onClear={this.handleClear.bind(this)}
            maxLength={maxLength ? maxLength : 140}
            onChange={this.handleChangeSearch.bind(this)}
            onConfirm={this.handleConfirm.bind(this)}
          />
        </Form>
      </View>
    )
  }
}
