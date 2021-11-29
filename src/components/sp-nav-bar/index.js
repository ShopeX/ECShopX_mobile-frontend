import React, { Component } from 'react';
 import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View } from '@tarojs/components'
import { AtNavBar } from 'taro-ui'
import { classNames, getBrowserEnv, isWeb } from '@/utils'

import './index.scss'

export default class SpNavBar extends Component {
  static defaultProps = {
    leftIconType: 'chevron-left',
    fixed: false,
    title: ''
  }

  static options = {
    addGlobalClass: true
  }

  handleClickLeftIcon = () => {
    if (this.props.onClickLeftIcon) return this.props.onClickLeftIcon()
    return Taro.navigateBack()
  }

  render() {
    const { title, leftIconType, fixed } = this.props
    if (isWeb && !getBrowserEnv().weixin) {
      return (
        <View
          className={classNames(`sp-nav-bar nav-bar-height`, {
            fixed
          })}
        >
          <AtNavBar
            fixed={fixed}
            color='#000'
            title={title}
            leftIconType={leftIconType}
            onClickLeftIcon={this.handleClickLeftIcon.bind(this)}
          />
        </View>
      )
    }

    return null
  }
}
