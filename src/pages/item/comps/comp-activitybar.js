import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { AtCountdown } from 'taro-ui'
import { View } from '@tarojs/components'
import { SpPrice } from '@/components'
import { ACTIVITY_LIST, ACTIVITY_STATUS } from '@/consts'
import './comp-activitybar.scss'

function CompActivityBar (props) {
  const { info, type, onTimeUp = () => {} } = props
  if (!info) {
    return null
  }
  const { remaining_time, last_seconds, status } = info
  let TIME = 0
  if (type == 'group') {
    TIME = remaining_time
  } else {
    TIME = last_seconds
  }

  return (
    <View className='comp-activitybar'>
      <View className='activitybar-hd'>
        <View className='activity-name'>{ACTIVITY_LIST[type]}</View>
        <View className='goods-price'>
          <SpPrice value={100}></SpPrice>
          <SpPrice value={100}></SpPrice>
        </View>
      </View>
      <View className='activitybar-ft'>
        <View className='title'>{ACTIVITY_STATUS[type][status]}</View>
        <AtCountdown
          format={{ day: '天', hours: ':', minutes: ':', seconds: '' }}
          isCard
          isShowDay
          seconds={TIME}
          onTimeUp={onTimeUp}
        />
      </View>
    </View>
  )
}

CompActivityBar.options = {
  addGlobalClass: true
}

export default CompActivityBar
