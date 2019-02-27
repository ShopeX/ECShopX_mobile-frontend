import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

import './index.scss'

export default class IconMenu extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    title: '',
    onClick: () => {},
    size: 32,
    img: '',
    icon: '',
    iconStyle: '',
    iconPrefixClass: 'sp-icon'
  }

  handleClick = () => {
    const { to, onClick } = this.props
    if (to) {
      Taro.navigateTo({
        url: to
      })
    }

    onClick()
  }

  render () {
    const { img, icon, iconStyle, iconPrefixClass, title, size, className } = this.props

    return (
      <View
        className={`sp-iconmenu ${className || ''}`}
        onClick={this.handleClick}
      >
        <View className='sp-iconmenu__icon'>
          {img && (<Image mode='aspectFill' className='sp-iconmenu__img' src={img} />)}
          {icon && (<AtIcon value={icon} prefixClass={iconPrefixClass} size={size} />)}
        </View>
        <Text className='sp-iconmenu__title'>{title}</Text>
      </View>
    )
  }
}
