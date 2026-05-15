/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { useMemo } from 'react'
import { AtCountdown } from 'taro-ui'
import { View } from '@tarojs/components'
import { useTranslation, $t, ti } from '@/i18n'
import './comp-activitybar.scss'

function CompActivityBar(props) {
  const { i18n } = useTranslation()
  const activityList = useMemo(
    () => ({
      group: $t('31564471.0dc5dc'),
      seckill: $t('31564471.55c758'),
      limited_time_sale: $t('31564471.a0aaca')
    }),
    [i18n.language]
  )
  const activityStatusMap = useMemo(
    () => ({
      seckill: {
        in_the_notice: $t('31564471.f20d70'),
        in_sale: $t('31564471.77c458')
      },
      limited_time_sale: {
        in_the_notice: $t('31564471.f20d70'),
        in_sale: $t('31564471.77c458')
      },
      group: {
        nostart: $t('31564471.f20d70'),
        noend: $t('31564471.77c458')
      }
    }),
    [i18n.language]
  )
  const countdownFormat = useMemo(
    () => ({
      day: $t('31564471.249aba'),
      hours: ':',
      minutes: ':',
      seconds: ''
    }),
    [i18n.language]
  )

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
    activityDesc = ti('31564471.e1b349', [person_num])
  }

  const statusKey = type == 'group' ? show_status : status

  return (
    <View className='comp-activitybar'>
      <View className='activitybar-body'>
        <View className='activitybar-hd'>
          <View className='activity-name'>{`${activityList[type] || ''} ${activityDesc}`}</View>
          <View className='goods-price'>{children}</View>
        </View>
        <View className='activitybar-ft'>
          <View className='title'>{activityStatusMap[type]?.[statusKey]}</View>
          <AtCountdown
            format={countdownFormat}
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
