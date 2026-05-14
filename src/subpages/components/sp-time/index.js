/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { View, Text, Picker } from '@tarojs/components'
import { classNames } from '@/utils'
import { useImmer } from 'use-immer'
import { useTranslation, $t } from '@/i18n'
import './index.scss'

const initialState = {
  seleIndex: 0,
  timeDay: '',
  setPicker: true
}

function SpTime(props) {
  useTranslation()
  const [state, setState] = useImmer(initialState)
  const { seleIndex, timeDay, setPicker } = state
  const { onTimeChange = () => {}, selects = 0, nowTimeDa = '' } = props
  const selectorLabels = [$t('59865c9f.1c9485'), $t('59865c9f.e14971'), $t('59865c9f.06a374')]
  const onChange = (e) => {
    const idx = Number(e.detail.value)
    setState((draft) => {
      draft.seleIndex = idx
      draft.timeDay = ''
      draft.setPicker = false
    })
  }

  useEffect(() => {
    setState((draft) => {
      draft.seleIndex = selects
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
        <Picker mode='selector' range={selectorLabels} onChange={onChange} value={seleIndex}>
          <View className='times'>
            <Text>{selectorLabels[seleIndex]}</Text>
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
            <Text>{timeDay || $t('59865c9f.708c9d')}</Text>
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
