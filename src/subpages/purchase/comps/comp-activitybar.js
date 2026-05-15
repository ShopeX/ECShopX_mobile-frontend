/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React from 'react'
import { AtCountdown } from 'taro-ui'
import { View } from '@tarojs/components'
import { SpPrice, SpVipLabel } from '@/components'
import { ACTIVITY_LIST, ACTIVITY_STATUS } from '@/consts'
import { useTranslation, ti } from '@/i18n'
import './comp-activitybar.scss'

function CompActivityBar(props) {
  useTranslation()
  const { info, type, onTimeUp = () => {}, children } = props
  if (!info) {
    return null
  }
  const { remaining_time, last_seconds, status, show_status, person_num, priceObj } = info
  let TIME = 0,
    activityDesc = ''
  if (type == 'group') {
    TIME = remaining_time
  } else {
    TIME = last_seconds
  }

  if (type == 'group') {
    activityDesc = ti('84ed74e1.e1b349', [person_num])
  }

  return (
    <View className='comp-activitybar'>
      <View className='activitybar-body'>
        <View className='activitybar-hd'>
          <View className='activity-name'>{`${ACTIVITY_LIST()[type]} ${activityDesc}`}</View>
          <View className='goods-price'>{children}</View>
        </View>
        <View className='activitybar-ft'>
          <View className='title'>
            {ACTIVITY_STATUS()[type][type == 'group' ? show_status : status]}
          </View>
          <AtCountdown
            format={{
              day: ti('84ed74e1.249aba'),
              hours: ':',
              minutes: ':',
              seconds: ''
            }}
            isCard
            isShowDay
            seconds={TIME}
            onTimeUp={onTimeUp}
          />
        </View>
      </View>
      {/* <View className='activitybar-footer'>
        <View className='vip-price'>
          <SpPrice value={priceObj?.vipPrice} />
          <SpVipLabel content='VIP' type='vip' />
        </View>
        <View className='svip-price'>
          <SpPrice value={priceObj?.svipPrice} />
          <SpVipLabel content='SVIP' type='svip' />
        </View>
      </View> */}
    </View>
  )
}

CompActivityBar.options = {
  addGlobalClass: true
}

export default CompActivityBar
