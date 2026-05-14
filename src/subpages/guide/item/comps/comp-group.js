/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { AtButton, AtCountdown } from 'taro-ui'
import { View, Text } from '@tarojs/components'
import { SpImage } from '@/components'
import { useTranslation, $t, ti } from '@/i18n'
import './comp-group.scss'

function CompGroup(props) {
  useTranslation()
  const { info } = props

  if (!info || !info.groupsList) {
    return null
  }

  if (info.groupsList.length == 0) {
    return null
  }

  const handleJoinGroup = (teamid) => {
    Taro.navigateTo({
      url: `/marketing/pages/item/group-detail?team_id=${teamid}`
    })
  }

  const { groupsList, activityInfo } = info
  return (
    <View className='comp-group'>
      <View className='comp-group-hd'>
        {$t('f3ce6c97.2ea5bf')}
        {/* <View>查看全部<Text className='iconfont icon-qianwang-01'></Text></View> */}
      </View>
      <View className='comp-group-bd'>
        {groupsList.map((item, index) => (
          <View className='group-item' key={`group-item__${index}`}>
            <View className='group-item-hd'>
              <SpImage src={item.member_info.headimgurl} width={80} height={80} />
            </View>
            <View className='group-item-bd'>
              <View className='group-title'>
                {ti('f3ce6c97.38dff1', [item.member_info.nickname || $t('f3ce6c97.1a75c1')])}
              </View>
              <View className='group-info'>
                {ti('f3ce6c97.53a0a7', [activityInfo.person_num - item.join_person_num])}
              </View>
              <View className='group-time'>
                {$t('f3ce6c97.43b510')}
                <AtCountdown
                  format={{ day: $t('f3ce6c97.249aba'), hours: ':', minutes: ':', seconds: '' }}
                  isShowDay
                  seconds={item.over_time}
                />
              </View>
            </View>
            <View className='group-item-ft' onClick={handleJoinGroup.bind(this, item.team_id)}>
              <AtButton circle size='small' type='primary'>
                {$t('f3ce6c97.2fd665')}
              </AtButton>
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
