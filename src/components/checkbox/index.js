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
import { View } from '@tarojs/components'
import { classNames, styleNames, getThemeStyle } from '@/utils'
import './index.scss'

export default class SpCheckbox extends Component {
  static defaultProps = {
    checked: false,
    disabled: false,
    onChange: () => {}
  }

  constructor(props) {
    super(props)
    this.state = {
      isChecked: this.props.checked
    }
  }

  componentWillReceiveProps(nextProps) {
    const { checked } = nextProps

    if (checked !== this.state.isChecked) {
      this.setState({
        isChecked: checked
      })
    }
  }

  static options = {
    addGlobalClass: true
  }

  handleClick = (e) => {
    if (this.props.disabled) return
    const isChecked = !this.state.isChecked
    this.setState({
      isChecked
    })
    this.props.onChange && this.props.onChange(isChecked)
  }

  render() {
    const { isChecked } = this.state

    return (
      <View
        className={classNames('sp-checkbox__wrap', isChecked ? 'sp-checkbox__checked' : null)}
        onClick={this.handleClick.bind(this)}
        style={styleNames(getThemeStyle())}
      >
        <View className='sp-checkbox'>
          <View className='iconfont icon-check'></View>
        </View>
        <View className='sp-checkbox__label'>{this.props.children}</View>
      </View>
    )
  }
}
