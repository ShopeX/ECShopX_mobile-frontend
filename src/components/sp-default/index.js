import React, { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { classNames } from '@/utils'
import SpImage from './../sp-image'

import './index.scss'

const TYPES = {
  cart: 'empty_cart.png'
}

function SpDefault (props) {
  const { className, message, children, type } = props
  return (
    <View
      className={classNames(
        {
          'sp-default': true
        },
        className
      )}
    >
      <View className='sp-default-hd'>
        {type && <SpImage className='default-img' src={TYPES[type]} width={350} />}
      </View>
      <View className='sp-default-bd'>{message}</View>
      <View className='sp-default-ft'>{children}</View>
    </View>
  )
}

export default SpDefault
