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
import { View, Text } from '@tarojs/components'
import { SpImage } from '@/components'
import { navigateTo, linkPage, classNames } from '@/utils'
import './showcase.scss'

function WgtShowCase(props) {
  const { info } = props
  const { base, data, config } = info

  return (
    <View
      className={classNames('wgt wgt-showcase', {
        wgt__padded: base.padded
      })}
    >
      {base.title && (
        <View className='wgt-head'>
          <View className='wgt-hd'>
            <Text className='wgt-title'>{base.title}</Text>
            <Text className='wgt-subtitle'>{base.subtitle}</Text>
          </View>
        </View>
      )}
      <View className={`showcase-scheme showcase-scheme-${config.style}`}>
        <View className='left-item'>
          <SpImage src={data[0].imgUrl} mode='aspectFill' onClick={linkPage.bind(this, data[0])} />
        </View>
        <View className='right-item'>
          <SpImage
            src={data[1].imgUrl}
            className='top-img'
            mode='aspectFill'
            onClick={linkPage.bind(this, data[1])}
          />
          <SpImage
            src={data[2].imgUrl}
            className='bot-img'
            mode='aspectFill'
            onClick={linkPage.bind(this, data[2])}
          />
        </View>
      </View>
    </View>
  )
}

WgtShowCase.options = {
  addGlobalClass: true
}

export default WgtShowCase
