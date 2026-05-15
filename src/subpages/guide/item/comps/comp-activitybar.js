/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React from 'react'
import { AtCountdown } from 'taro-ui'
import { View } from '@tarojs/components'
import { useTranslation, $t, ti } from '@/i18n'
import './comp-activitybar.scss'

const ACTIVITY_TITLE_I18N = {
  group: '02f831a3.0dc5dc',
  seckill: '02f831a3.55c758',
  limited_time_sale: '02f831a3.a0aaca'
}

const ACTIVITY_STATUS_I18N = {
  seckill: {
    in_the_notice: '02f831a3.f20d70',
    in_sale: '02f831a3.77c458'
  },
  limited_time_sale: {
    in_the_notice: '02f831a3.f20d70',
    in_sale: '02f831a3.77c458'
  },
  group: {
    nostart: '02f831a3.f20d70',
    noend: '02f831a3.77c458'
  }
}

function CompActivityBar(props) {
  useTranslation()
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
    activityDesc = ti('02f831a3.053d4a', [person_num])
  }

  const statusKey = type == 'group' ? show_status : status
  const titleKey = ACTIVITY_TITLE_I18N[type]
  const countdownTitleKey = ACTIVITY_STATUS_I18N[type]?.[statusKey]

  return (
    <View className='comp-activitybar'>
      <View className='activitybar-hd'>
        <View className='activity-name'>
          {[titleKey && $t(titleKey), activityDesc].filter(Boolean).join(' ')}
        </View>
        <View className='goods-price'>{children}</View>
      </View>
      <View className='activitybar-ft'>
        <View className='title'>{countdownTitleKey ? $t(countdownTitleKey) : ''}</View>
        <AtCountdown
          format={{ day: $t('02f831a3.249aba'), hours: ':', minutes: ':', seconds: '' }}
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
