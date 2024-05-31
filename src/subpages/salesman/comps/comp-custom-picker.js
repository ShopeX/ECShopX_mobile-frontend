import React, { useEffect, useRef } from 'react'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import { View, Text, Image, Picker } from '@tarojs/components'
import { SpImage } from '@/components'
import './comp-custom-picker.scss'

/**
 * 该组件接受自定义名字和下拉框内容自定义，默认全部定铺
 * customStatus：是否自定义
 * customName：自定义的名字
 * 用法：<CompCustomPicker customStatus customName={customName} cancel={cancel} />
 *
 */

const initialState = {
  selectorChecked: '全部店铺'
}

function CompCustomPicker(props) {
  const [state, setState] = useImmer(initialState)
  const {
    selector,
    customStatus = false,
    customName,
    cancel = () => {}
  } = props
  const { selectorChecked } = state

  const onChange = (e) => {
    console.log('e', e)
    let index = Number(e.detail.value)
    setState((draft) => {
      draft.selectorChecked = selector[index].label
    })
    cancel(index, selector[index])
  }

  return (
    <View className='comp-custom-picker'>
      <Picker mode='selector' rangeKey='label' range={selector} onChange={onChange}>
        <View className='picker-box'>
          <Text>{customStatus ? customName : selectorChecked}</Text>
          <Text className='iconfont icon-xialajiantou'></Text>
        </View>
      </Picker>
    </View>
  )
}

CompCustomPicker.options = {
  addGlobalClass: true
}

CompCustomPicker.defaultProps = {
  selector: [{ label: '手机号', value: 'phone' }]
}

export default CompCustomPicker
