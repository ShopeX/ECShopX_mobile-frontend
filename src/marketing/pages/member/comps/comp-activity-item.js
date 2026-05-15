/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useMemo } from 'react'
import { View, Text } from '@tarojs/components'
import { SpImage } from '@/components'
import { useTranslation, $t } from '@/i18n'
import classNames from 'classnames'
import './comp-activity-item.scss'

function CompActivityItem(props) {
  useTranslation()
  const {
    info = {},
    isActivity = false,
    onClick = () => {},
    onBtnAction = () => {},
    onViewRecords = () => {}
  } = props

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
            {$t('925d1b2b.2624eb')}
            <Text className='activity-item__content-reject-reason'>{reason}</Text>
          </View>
        )}

        <View className='activity-item__content-btns'>
          {isActivity && (
            <View className='activity-item__content-btn activity-btn'>{$t('c012603a.048ca2')}</View>
          )}
          <View className='activity-item__content-btn-wrapper'>
            {isActivity && recordId ? (
              <View
                className='activity-item__view-records'
                onClick={(e) => {
                  e.stopPropagation()
                  onViewRecords(info)
                }}
              >
                {$t('925d1b2b.b38ce3')}
              </View>
            ) : null}
            {actionEdit && !isActivity && (
              <View
                className='activity-item__content-btn'
                onClick={(e) => handleBtnClick(e, 'reFill')}
              >
                {$t('925d1b2b.a5c7b5')}
              </View>
            )}
            {!isActivity && actionApply && (
              <View
                className='activity-item__content-btn'
                onClick={(e) => handleBtnClick(e, 'sign')}
              >
                {$t('925d1b2b.1e6c87')}
              </View>
            )}

            {isActivity && (
              <View
                className={classNames('activity-item__content-btn', {
                  ' disabled-btn': signDisabled
                })}
                onClick={(e) => handleBtnClick(e, 'sign')}
              >
                {$t('925d1b2b.1e6c87')}
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  )
}

CompActivityItem.options = {
  addGlobalClass: true
}

export default CompActivityItem
