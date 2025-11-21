/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import imgUploader from '@/utils/upload'
import { isArray, classNames } from '@/utils'
import { SpFloatLayout } from '@/components'
import './index.scss'

const initialState = {}

const voidFn = () => {}

function SpTimePicker(props) {
  const {
    pickerIndex,
    activeTimeId,
    show = false,
    timeSlotsValueString = false,
    weekdays = [],
    timeSlots = [],
    onClose = voidFn,
    onChangeWeekDays = voidFn,
    onChangeTimeSlot = voidFn
  } = props

  const [state, setState] = useImmer(initialState)

  const onClickWeekDays = (index) => {
    onChangeWeekDays && onChangeWeekDays(index)
  }

  const onClickTimeSlot = (item) => {
    if (item.disabled) return
    onChangeTimeSlot && onChangeTimeSlot(item)
  }

  return (
    <View className='sp-time-picker'>
      {/* 自提时间选择 */}
      <SpFloatLayout className='ziti-time-floatlayout' open={show} onClose={onClose}>
        <View className='ziti-time-container'>
          <ScrollView className='week-container' scrollY>
            {weekdays.map((item, index) => (
              <View
                className={classNames('weekday-item', {
                  active: index === pickerIndex
                })}
                key={`weekday-item__${index}`}
                onClick={() => onClickWeekDays(index)}
              >
                {item.title}
              </View>
            ))}
          </ScrollView>
          <ScrollView className='time-container' scrollY>
            {timeSlots.map((item, index) => (
              <View
                className={classNames('timeslot-item', {
                  'active': item.id === activeTimeId,
                  'disabled': item.disabled
                })}
                key={`timeslot-item__${index}`}
                onClick={() => onClickTimeSlot(item)}
              >
                {timeSlotsValueString ? item.value : `${item.value[0]} ~ ${item.value[1]}`}
              </View>
            ))}
          </ScrollView>
        </View>
      </SpFloatLayout>
    </View>
  )
}

SpTimePicker.options = {
  addGlobalClass: true
}

export default SpTimePicker
