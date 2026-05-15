/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useState, useMemo } from 'react'
import { View, Image, Text } from '@tarojs/components'
import { AtCountdown } from 'taro-ui'
import { calcTimer } from '@/utils'
import { useTranslation, $t, ti } from '@/i18n'

import './grouping-item.scss'

function GroupingItem(props) {
  const { i18n } = useTranslation()
  const { info, total, onClick } = props
  const [remaining_time, setRemainingTime] = useState(null)

  const countdownFormat = useMemo(
    () => ({
      day: $t('12b6c337.249aba'),
      hours: ':',
      minutes: ':',
      seconds: ''
    }),
    [i18n.language]
  )

  useEffect(() => {
    const rt = calcTimer(info.over_time)
    console.log(rt)
    setRemainingTime(rt)
  }, [info.over_time])

  if (!remaining_time) return null

  return (
    <View className='grouping-item view-flex view-flex-middle' onClick={onClick}>
      <Image className='group-sponsor-avatar' src={info.member_info.headimgurl} />
      <View className='view-flex-item'>
        <View className='name'>
          {ti('12b6c337.38dff1', [info.member_info.nickname || $t('12b6c337.1a75c1')])}
        </View>
        <View>
          {$t('12b6c337.a1b490')}
          <Text className='group-num'>{total - info.join_person_num}</Text>
          {$t('12b6c337.fe1360')}
        </View>
        <View className='text-muted'>
          {$t('12b6c337.43b510')}
          <AtCountdown
            isShowDay
            format={countdownFormat}
            day={remaining_time.dd}
            hours={remaining_time.hh}
            minutes={remaining_time.mm}
            seconds={remaining_time.ss}
          />
        </View>
      </View>
      <View className='group-join'>{$t('12b6c337.2fd665')}</View>
    </View>
  )
}

GroupingItem.options = {
  addGlobalClass: true
}

GroupingItem.defaultProps = {
  info: {},
  onClick: () => {}
}

export default GroupingItem
