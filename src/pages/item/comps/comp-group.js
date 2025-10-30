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
import { AtButton, AtCountdown } from 'taro-ui'
import { View, Text } from '@tarojs/components'
import { SpImage } from '@/components'
import './comp-group.scss'

function CompGroup(props) {
  const { info } = props
  console.log()
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
        正在进行中的团，可参与拼单
        {/* <View>查看全部<Text className='iconfont icon-qianwang-01'></Text></View> */}
      </View>
      <View className='comp-group-bd'>
        {groupsList.map((item, index) => (
          <View className='group-item' key={`group-item__${index}`}>
            <View className='group-item-hd'>
              <SpImage src={item.member_info.headimgurl} width={80} height={80} />
            </View>
            <View className='group-item-bd'>
              <View className='group-title'>{`${item.member_info.nickname || '匿名'}的团`}</View>
              <View className='group-info'>
                还差
                <Text className='group-num'>{activityInfo.person_num - item.join_person_num}</Text>
                人成团
              </View>
              <View className='group-time'>
                剩余
                <AtCountdown
                  format={{ day: '天', hours: ':', minutes: ':', seconds: '' }}
                  isShowDay
                  seconds={item.over_time}
                />
              </View>
            </View>
            <View className='group-item-ft' onClick={handleJoinGroup.bind(this, item.team_id)}>
              <AtButton circle size='small' type='primary'>
                去参团
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
