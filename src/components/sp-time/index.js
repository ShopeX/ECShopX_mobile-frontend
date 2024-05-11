import React from 'react'
import { View, Text, Picker } from '@tarojs/components'
import { classNames } from '@/utils'
import { useImmer } from 'use-immer'

import './index.scss'

const initialState = {
  selector: ['按年', '按月', '按日'],
  selectorChecked: '按年',
  seleIndex: 0,
  timeDay: '请选择'
}

function SpTime(props) {
  const [state, setState] = useImmer(initialState)
  const { selector, selectorChecked, seleIndex, timeDay } = state
  const { onTimeChange = () => {} } = props
  const onChange = (e) => {
    setState((draft) => {
      draft.selectorChecked = selector[e.detail.value]
      draft.seleIndex = e.detail.value
      draft.timeDay = '请选择'
    })
  }

  const onDateChange = (e) => {
    setState((draft) => {
      draft.timeDay = e.detail.value
    })
    onTimeChange(seleIndex, e.detail.value)
  }

  return (
    <View className='sp-time'>
      <View className='times-select'>
        <Picker className='times' mode='selector' range={selector} onChange={onChange}>
          <Text>{selectorChecked}</Text>
          <Text className='iconfont icon-arrowDown'></Text>
        </Picker>

        <Picker
          mode='date'
          fields={`${seleIndex == 0 ? 'year' : seleIndex == 1 ? 'month' : 'day'}`}
          onChange={onDateChange}
          className='specific-time'
        >
          <Text className='iconfont icon-arrowDown'></Text>
          <Text>{timeDay}</Text>
        </Picker>
      </View>
    </View>
  )
}

SpTime.options = {
  addGlobalClass: true
}

export default SpTime
