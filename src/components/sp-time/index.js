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
import { View, Text, Picker } from '@tarojs/components'
import { classNames } from '@/utils'
import { useImmer } from 'use-immer'

import './index.scss'

const initialState = {
  selector: ['按年', '按月', '按日'],
  selectorChecked: '按年',
  seleIndex: 0,
  timeDay: '请选择',
  setPicker: true
}

function SpTime(props) {
  const [state, setState] = useImmer(initialState)
  const { selector, selectorChecked, seleIndex, timeDay, setPicker } = state
  const { onTimeChange = () => {}, selects = 0, nowTimeDa = '请选择' } = props
  const onChange = (e) => {
    setState((draft) => {
      draft.selectorChecked = selector[e.detail.value]
      draft.seleIndex = e.detail.value
      draft.timeDay = '请选择'
      draft.setPicker = false
    })
  }

  useEffect(() => {
    setState((draft) => {
      draft.seleIndex = selects
      draft.selectorChecked = selector[selects]
      draft.timeDay = nowTimeDa
    })
    console.log('selects999999', timeDay)
  }, [])

  useEffect(() => {
    if (!setPicker) {
      setState((draft) => {
        draft.setPicker = true
      })
    }
  }, [setPicker])

  const onDateChange = (e) => {
    setState((draft) => {
      draft.timeDay = e.detail.value
    })
    onTimeChange(seleIndex, e.detail.value)
  }

  return (
    <View className='sp-time'>
      <View className='times-select'>
        <Picker mode='selector' range={selector} onChange={onChange} value={seleIndex}>
          <View className='times'>
            <Text>{selectorChecked}</Text>
            <Text className='iconfont icon-xialajiantou'></Text>
          </View>
        </Picker>
        {setPicker && (
          <Picker
            mode='date'
            fields={`${seleIndex == 0 ? 'year' : seleIndex == 1 ? 'month' : 'day'}`}
            onChange={onDateChange}
            className='specific-time'
          >
            <Text className='iconfont icon-riqi'></Text>
            <Text>{timeDay}</Text>
          </Picker>
        )}
      </View>
    </View>
  )
}

SpTime.options = {
  addGlobalClass: true
}

export default SpTime
