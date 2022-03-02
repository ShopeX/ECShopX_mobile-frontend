import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { AtButton } from 'taro-ui'
import { View } from '@tarojs/components'
import './comp-group.scss'

function CompGroup (props) {
  const { info } = props

  if (!info || info.length == 0) {
    return null
  }

  return (
    <View className='comp-group'>
      <View className='comp-group-hd'>正在进行中的团，可参与拼单</View>
      <View className='comp-group-bd'>
        {info.map((item, index) => (
          <View className='group-item' key={`group-item__${index}`}>
            <View className='group-item-hd'></View>
            <View className='group-item-bd'></View>
            <View className='group-item-ft'>
              <AtButton type='primary'>去参团</AtButton>
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}

CompGroup.options = {
  addGlobalClass: true
}

export default CompGroup
