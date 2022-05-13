import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { SpImage } from '@/components'
import './comp-wgts.scss'

function CompWgts(props) {
  const { info = [] } = props
  return (
    <View className='comp-wgts'>
      {info.map((item) => (
        <View className="">
          {item.type == 'bigimage' && <SpImage src={item.value} />}
          {item.type == 'text' && <View>{item.value}</View>}

        </View>
      ))}
    </View>
  )
}

CompWgts.options = {
  addGlobalClass: true
}

export default CompWgts
