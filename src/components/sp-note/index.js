import React, { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtIcon, AtButton } from 'taro-ui'
import { classNames, navigateTo } from '@/utils'

import './index.scss'

export default class SpNote extends Component {
  static defaultProps = {
    icon: false,
    button: false,
    value: 'goods_new_fill_light',
    title: '',
    btnText: '',
    to: '',
    isUrl: false,
    img: ''
  }

  static options = {
    addGlobalClass: true
  }

  navigateTo = navigateTo

  handleClick = () => {}

  resolveUrl (img) {
    return `/assets/imgs/${img}`
  }

  render () {
    const { icon, className, title, button, value, btnText, to, isUrl, img } = this.props

    return (
      <View className={classNames('sp-note', className)}>
        {/* {icon && <AtIcon prefixClass='sw-icon' value={value} size='60' color='#cdcdcd' />} */}
        {img && (
          <Image
            className='sp-note__img'
            mode='widthFix'
            src={isUrl ? img : this.resolveUrl(img)}
          />
        )}
        <Text className='sp-note__text'>{title || this.props.children}</Text>
        {button && to && (
          <View className='sp-note__btn'>
            <AtButton circle onClick={this.navigateTo.bind(this, to)}>
              {btnText}
            </AtButton>
          </View>
        )}
      </View>
    )
  }
}
