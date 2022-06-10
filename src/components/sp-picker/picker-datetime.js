import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import { useSelector } from 'react-redux'
import { useAsyncCallback } from '@/hooks'
import Taro from '@tarojs/taro'

import { View, PickerView, PickerViewColumn } from '@tarojs/components'
import format from './format'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import './picker-datetime.scss'

dayjs.extend(customParseFormat)

const initialState = {
  source: [],
  value: [],
  markMultiDateTime: false
}
function PickerDateTime(props) {
  const { start } = props
  const dateTime = [
    { mode: 'year', unit: '年' },
    { mode: 'month', unit: '月' },
    { mode: 'day', unit: '日' },
    { mode: 'hour', unit: '时' },
    { mode: 'minute', unit: '分' }
  ]
  const [state, setState] = useAsyncCallback(initialState)
  const { source, value } = state
  useEffect(() => {
    // const { dateTime, start } = this.props
    let markMultiDateTime = false
    if (dateTime && Array.isArray(dateTime)) {
      dateTime.map((dateTimeItem) => {
        //判断一维数组还是二维数组，分别对应单组选择和两组选择
        if (Array.isArray(dateTimeItem)) {
          markMultiDateTime = true
          // 取得格式化计算之后的结果
          const source1 = dateTimeItem && format(dateTimeItem, dayjs(start))
          setState((draft) => {
            draft.source = [...source, source1]
            draft.value = [...value, source1.value]
            draft.markMultiDateTime = markMultiDateTime
          })
          // this.setState((state) => ({ ...state, value: [...state.value, source.value] }))
        }
      })
      if (!markMultiDateTime) {
        const source2 = dateTime && format(dateTime, dayjs(start))
        setState((draft) => {
          draft.source = [...source, source2]
          draft.value = [...value, source2.value]
          draft.markMultiDateTime = markMultiDateTime
        })
      }
      // setState(draft => {

      // this.setState((state) => ({ ...state, markMultiDateTime }))
    }
  }, [])

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
        // debugger
        // const cur = getDayjs()
        // debugger
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
        // 对'今天'这个值进行特殊处理，其他直接返回当前的选择字符串
        time += (select === '今天' ? dayjs().format('M月D日') : select) + '-'
        // 对于二维数组取i、j；对于一维数组取j
        const item = markMultiDateTime ? dateTime[i][j] : dateTime[j]
        token += (item.format || getToken(item.mode)) + '-'
      }
      res.push(dayjs(time, token)[mode]())
    }
    return markMultiDateTime ? res : res[0]
  }

  // 标准格式化选择器
  const getToken = (mode) => {
    return {
      year: 'YYYY年',
      month: 'M月',
      day: 'D日',
      hour: 'H时',
      minute: 'm分',
      second: 's秒'
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
