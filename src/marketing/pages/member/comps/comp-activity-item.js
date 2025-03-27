import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpImage, SpPrice, SpTradeItem } from '@/components'
import { ACTIVITY_STATUS_MAP } from '@/consts'
import './comp-activity-item.scss'
import classNames from 'classnames'

function CompActivityItem(props) {
  const { info, isActivity = false, onClick = () => {}, onBtnAction = () => {} } = props
  if (!info) {
    return null
  }

  const handleBtnClick = (e, type) => {
    e.stopPropagation()
    onBtnAction(info, type)
  }

  console.log('info', info)
  const {
    activityName,
    reason,
    areaName,
    statusName,
    activityStatus,
    pics,
    actionCancel,
    actionEdit,
    actionApply,
    activityStartTime
  } = info

  return (
    <View className={classNames('activity-item',{'has-end':false})} onClick={() => onClick(info)}>
      <SpImage className='activity-item__pic' src={pics?.[0]} />
      <View className='activity-item__status'>{activityStatus}</View>
      <View className='activity-item__content'>
        <View className='flex-between-center'>
          <View className='activity-item__content-title'>{activityName}</View>
          {!isActivity && <View className='activity-item__content-status'>{statusName}</View>}
        </View>
        <View className='flex-between-center'>
          <View className='activity-item__content-time'>{activityStartTime}</View>
          <View className='activity-item__content-address'>{areaName}</View>
        </View>
        {reason && !isActivity && (
          <View className='activity-item__content-reject'>
            拒绝原因：
            <Text className='activity-item__content-reject-reason'>{reason}</Text>
          </View>
        )}
        <View className='activity-item__content-btns'>
          {isActivity && <View className='activity-item__content-btn activity-btn'>会员免费</View>}
          {actionEdit && !isActivity && (
            <View
              className='activity-item__content-btn'
              onClick={(e) => handleBtnClick(e, 'reFill')}
            >
              重新填写
            </View>
          )}
          {actionApply && (
            <View className='activity-item__content-btn' onClick={(e) => handleBtnClick(e, 'sign')}>
              立即报名
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

CompActivityItem.options = {
  addGlobalClass: true
}

export default CompActivityItem
