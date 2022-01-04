import React, { Component } from 'react'
import { View, Image, Text } from '@tarojs/components'
import { classNames } from '@/utils'
import './index.scss'

export default class SpLoading extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    type: '',
    img: null,
    size: null
  }

  render () {
    const { className, type, img, size } = this.props

    return (
      <View className={classNames('sp-loading', type && `sp-loading__${type}`, className)}>
        {img ? (
          <Image src={img} className='sp-loading-img' />
        ) : (
          <View className='spiner' style={`${size ? `width: ${size}, height: ${size}` : ''}`} />
        )}
        <Text className='sp-loading-text'>{this.props.children}</Text>
      </View>
    )
  }
}
