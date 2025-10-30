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
import { connect } from 'react-redux'

import './destory-comfirm-modal.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))
export default class SettingIndex extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { visible, onCancel, confirmBtn, cancelBtn, content, title, colors } = this.props
    return visible ? (
      <View className='destory-comfirm-modal'>
        <View className='content'>
          <View className='title' style={cancelBtn ? { color: '#D9001B' } : { color: '#666' }}>
            {title}
          </View>
          <View>{content}</View>
          <View
            onClick={() => onCancel('confirm')}
            className='confirm-button'
            style={`background: ${colors.data[0].primary}`}
          >
            {confirmBtn}
          </View>
          {cancelBtn && (
            <View onClick={() => onCancel('cancel')} className='cancel-button'>
              {cancelBtn}
            </View>
          )}
        </View>
      </View>
    ) : null
  }
}
