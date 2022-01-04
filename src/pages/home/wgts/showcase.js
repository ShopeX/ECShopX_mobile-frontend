import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { SpImage } from '@/components'
import { navigateTo, linkPage, classNames } from '@/utils'
import './showcase.scss'

function WgtShowCase (props) {
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
        <View className='scheme-item'>
          <SpImage src={data[0].imgUrl} onClick={linkPage.bind(this, data[0])} />
        </View>
        <View className='scheme-item'>
          <SpImage src={data[1].imgUrl} onClick={linkPage.bind(this, data[1])} />
          <SpImage src={data[2].imgUrl} onClick={linkPage.bind(this, data[2])} />
        </View>
      </View>
    </View>
  )
}

WgtShowCase.options = {
  addGlobalClass: true
}

export default WgtShowCase
