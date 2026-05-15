/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useMemo } from 'react'
import { useAsyncCallback } from '@/hooks'

import { View, PickerView, PickerViewColumn } from '@tarojs/components'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import 'dayjs/locale/zh-cn'
import { useTranslation, $t, ti } from '@/i18n'
import format from './format'
import './picker-datetime.scss'

dayjs.extend(customParseFormat)

const initialState = {
  source: [],
  value: [],
  markMultiDateTime: false
}

const EMPTY_UNITS = [
  { mode: 'year', unit: '' },
  { mode: 'month', unit: '' },
  { mode: 'day', unit: '' },
  { mode: 'hour', unit: '' },
  { mode: 'minute', unit: '' }
]

function PickerDateTime(props) {
  const { i18n } = useTranslation()
  const { start } = props

  const dateTime = useMemo(() => {
    const zh = (i18n.language || '').toLowerCase().startsWith('zh')
    if (!zh) {
      return EMPTY_UNITS
    }
    return [
      { mode: 'year', unit: $t('5e8ac5b7.465260') },
      { mode: 'month', unit: $t('5e8ac5b7.e42b99') },
      { mode: 'day', unit: $t('5e8ac5b7.3edddd') },
      { mode: 'hour', unit: $t('5e8ac5b7.609b5f') },
      { mode: 'minute', unit: $t('5e8ac5b7.daf783') }
    ]
  }, [i18n.language])

  const [state, setState] = useAsyncCallback(initialState)
  const { source, value } = state
  useEffect(() => {
    let markMultiDateTime = false
    const nextSource = []
    const nextValue = []
    if (!dateTime || !Array.isArray(dateTime)) {
      return
    }
    dateTime.forEach((dateTimeItem) => {
      if (Array.isArray(dateTimeItem)) {
        markMultiDateTime = true
        const source1 = dateTimeItem && format(dateTimeItem, dayjs(start))
        if (source1) {
          nextSource.push(source1)
          nextValue.push(source1.value)
        }
      }
    })
    if (!markMultiDateTime) {
      const source2 = format(dateTime, dayjs(start))
      if (source2) {
        nextSource.push(source2)
        nextValue.push(source2.value)
      }
    }
    setState((draft) => {
      draft.source = nextSource
      draft.value = nextValue
      draft.markMultiDateTime = markMultiDateTime
    })
  }, [dateTime, start])

  const onChange = (e, index) => {
    // const _value = [...value]
    // _value[index] = e.detail.value
    console.log(value, e.detail.value)

    // const { source, value } = state
    // source.item[]

    setState(
      (draft) => {
        draft.value = e.detail.value
      },
      ({ source, value }) => {
        // const res = []
        // for (let i = 0; i < source.length; i++) {
        //   let time = '',
        //     token = ''
        //   // source[i].item.length为可选项的列数
        //   for (let j = 0; j < source[i].item.length; j++) {
        //     const select = source[i].item[j][value[i][j]]
        //     time += (select === '今天' ? dayjs().format('M月D日') : select) + '-'
        //     // 对于二维数组取i、j；对于一维数组取j
        //     const item = markMultiDateTime ? dateTime[i][j] : dateTime[j]
        //     token += (item.format || getToken(item.mode)) + '-'
        //   }
        //   res.push(dayjs(time, token)[mode]())
        // }
        // return markMultiDateTime ? res : res[0]
        // const res = source.map((item, index) => item[value[index]])
        // const cur = getDayjs()
        // const source2 = dateTime && format(dateTime, dayjs(start))
        // console.log('source2:', source2)
      }
    )

    // 月份
    // if(index == 1) {

    // }
  }

  // 根据可选项和当前选择索引返回已选中的时间
  const getDayjs = (mode = 'unix') => {
    let { source, value, markMultiDateTime } = state
    // const { dateTime } = this.props
    const res = []
    // 此处遍历dateTime和遍历source的区别在于一维数组还是二维数组
    for (let i = 0; i < source.length; i++) {
      let time = '',
        token = ''
      // source[i].item.length为可选项的列数
      for (let j = 0; j < source[i].item.length; j++) {
        // source[i].item[j]为每一列的数据组成的数组,value[i][j]为对应这列数组的选中值
        const select = source[i].item[j][value[i][j]]
        const todayLabel = $t('db02f988.800dfd')
        time +=
          (select === todayLabel
            ? ti('db02f988.b5ed77', [dayjs().month() + 1, dayjs().date()])
            : select) + '-'
        // 对于二维数组取i、j；对于一维数组取j
        const item = markMultiDateTime ? dateTime[i][j] : dateTime[j]
        token += (item.format || getToken(item.mode)) + '-'
      }
      res.push(dayjs(time, token)[mode]())
    }
    return markMultiDateTime ? res : res[0]
  }

  const getToken = (mode) => {
    const zh = (i18n.language || '').toLowerCase().startsWith('zh')
    if (!zh) {
      return { year: 'YYYY', month: 'M', day: 'D', hour: 'H', minute: 'm', second: 's' }[mode]
    }
    return {
      year: `YYYY${$t('5e8ac5b7.465260')}`,
      month: `M${$t('5e8ac5b7.e42b99')}`,
      day: `D${$t('5e8ac5b7.3edddd')}`,
      hour: `H${$t('5e8ac5b7.609b5f')}`,
      minute: `m${$t('5e8ac5b7.daf783')}`,
      second: `s${$t('5e8ac5b7.0c1fec')}`
    }[mode]
  }

  return (
    <View className='picker-datetime'>
      {source.map((element, index) => (
        <PickerView
          key={'element' + index}
          indicator-style='height: 50px;'
          value={value[index]}
          onChange={(e) => onChange(e, index)}
          // 使用acc.concat将多维数组打平成一维数组再求数组长度
        >
          {element.item.map((item, elementIndex) => (
            <PickerViewColumn key={elementIndex}>
              {item.map((time) => (
                <View key={time}>{time}</View>
              ))}
            </PickerViewColumn>
          ))}
        </PickerView>
      ))}
    </View>
  )
}

PickerDateTime.options = {
  addGlobalClass: true
}

export default PickerDateTime
