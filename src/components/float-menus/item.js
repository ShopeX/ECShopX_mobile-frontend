import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './item.scss'

export default class Index extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    onClick: null,
    iconPrefixClass: 'sp-icon',
    icon: '',
    hide: false
  }

  render () {
    const{ onClick, iconPrefixClass, hide, icon, hide } = this.props

    return (
      <View
        className={`float-menu__item ${hide ? 'hidden' : ''}`}
        onClick={onClick}
      >
        <View className={`${iconPrefixClass} ${iconPrefixClass}-${icon}`}></View>
        {this.props.children}
      </View>
    )
  }
}
