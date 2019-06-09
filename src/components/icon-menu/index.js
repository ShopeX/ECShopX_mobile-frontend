import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import { styleNames } from '@/utils'

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
    iconPrefixClass: 'sp-icon',
    hoverClass: '',
    openType: null
  }

  handleClick = () => {
    const { to, onClick } = this.props
    if (to) {
      if(to === 'new-mini'){
        Taro.navigateToMiniProgram({
          appId: 'wx2fb97cb696f68d22', // 要跳转的小程序的appid
          path: '/pages/index/index', // 跳转的目标页面
          envVersion: 'trial',
          success(res) {
            // 打开成功
            console.log(res)
          }
        })
      } else {
        Taro.navigateTo({
          url: to
        })
      }

    }

    onClick()
  }

  render () {
    const { img, icon, iconStyle, iconPrefixClass, title, size, className, hoverClass, openType } = this.props

    return (
      <Button
        className={`sp-iconmenu ${className || ''}`}
        hoverClass={hoverClass}
        onClick={this.handleClick}
        openType={openType}
      >
        <View className='sp-iconmenu__icon'>
          {img && (<Image mode='aspectFill' className='sp-iconmenu__img' src={img} />)}
          {icon && (<AtIcon value={icon} prefixClass={iconPrefixClass} style={styleNames(iconStyle)} size={size} />)}
        </View>
        <Text className='sp-iconmenu__title'>{title}</Text>
      </Button>
    )
  }
}
