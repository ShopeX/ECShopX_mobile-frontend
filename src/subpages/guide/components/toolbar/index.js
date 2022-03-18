import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { classNames } from '@/utils'
import S from '@/subpages/guide/lib/Spx.js'

import './index.scss'

export default class SpToolbar extends Component {
  static options = {
    addGlobalClass: true
  }

  defaultProps = {
    inline: false
  }

  render() {
    const { inline } = this.props
    const ipxClass = S.get('ipxClass') || ''

    return (
      <View className={classNames('sp-toolbar', { 'sp-toolbar__inline': inline }, ipxClass)}>
        {this.props.children}
      </View>
    )
  }
}
