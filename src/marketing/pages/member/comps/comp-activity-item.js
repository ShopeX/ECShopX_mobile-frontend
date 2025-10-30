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
import React, { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpImage, SpPrice, SpTradeItem } from '@/components'
import { ACTIVITY_STATUS_MAP } from '@/consts'
import classNames from 'classnames'
import './comp-activity-item.scss'

function CompActivityItem(props) {
  const { info = {}, isActivity = false, onClick = () => {}, onBtnAction = () => {} } = props

  if (!info) {
    return null
  }

  const {
    activityName,
    reason,
    areaName,
    statusName,
    activityStatus,
    pics,
    actionCancel,
    showCity,
    actionEdit,
    actionApply,
    activityStartTime,
    joinLimit,
    totalJoinNum,
    isAllowDuplicate,
    recordId,
    status
  } = info

  const activityAreaShow = useMemo(() => {
    if (!isActivity) return true
    return showCity
  }, [info, isActivity])

  const signDisabled = useMemo(() => {
    // 活动结束
    //已报名次数 == 报名次数上限
    //不能重复报名，有报名记录了
    if (!info || status == 'end') return true

    return (joinLimit <= totalJoinNum && joinLimit != 0) || (!isAllowDuplicate && recordId)
  }, [info])

  const handleBtnClick = (e, type) => {
    e.stopPropagation()
    if (isActivity && signDisabled) return
    onBtnAction(info, type)
  }

  console.log('info', info)

  return (
    <View
      className={classNames('activity-item', { 'has-end': status == 'end' })}
      onClick={() => onClick(info)}
    >
      <SpImage className='activity-item__pic' src={pics?.[0]} />
      <View className='activity-item__status'>{activityStatus}</View>
      <View className='activity-item__content'>
        <View className='flex-between-center'>
          <View className='activity-item__content-title'>{activityName}</View>
          {!isActivity && <View className='activity-item__content-status'>{statusName}</View>}
        </View>
        <View className='flex-between-center'>
          <View className='activity-item__content-time'>{activityStartTime}</View>
          {activityAreaShow && <View className='activity-item__content-address'>{areaName}</View>}
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
          {!isActivity && actionApply && (
            <View className='activity-item__content-btn' onClick={(e) => handleBtnClick(e, 'sign')}>
              立即报名
            </View>
          )}

          {isActivity && (
            <View
              className={classNames('activity-item__content-btn', {
                ' disabled-btn': signDisabled
              })}
              onClick={(e) => handleBtnClick(e, 'sign')}
            >
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
