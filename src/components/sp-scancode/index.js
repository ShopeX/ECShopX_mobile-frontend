/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import './index.scss'

export default class SpScancode extends Component {
  static options = {
    addGlobalClass: true
  }

  render() {
    return (
      <View className='sp-scan-code'>
        <Text className='iconfont icon-saoma-01'></Text>
      </View>
    )
  }
}
