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
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { AtCountdown } from 'taro-ui'
import { View } from '@tarojs/components'
import { SpPrice } from '@/components'
import { ACTIVITY_LIST, ACTIVITY_STATUS } from '@/consts'
import './comp-activitybar.scss'

function CompActivityBar(props) {
  const { info, type, onTimeUp = () => {}, children } = props
  if (!info) {
    return null
  }
  const { remaining_time, last_seconds, status, show_status, person_num } = info
  let TIME = 0,
    activityDesc = ''
  if (type == 'group') {
    TIME = remaining_time
  } else {
    TIME = last_seconds
  }

  if (type == 'group') {
    activityDesc = `(${person_num}人团)`
  }

  return (
    <View className='comp-activitybar'>
      <View className='activitybar-hd'>
        <View className='activity-name'>{`${ACTIVITY_LIST()[type]} ${activityDesc}`}</View>
        <View className='goods-price'>{children}</View>
      </View>
      <View className='activitybar-ft'>
        <View className='title'>
          {ACTIVITY_STATUS()[type][type == 'group' ? show_status : status]}
        </View>
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
