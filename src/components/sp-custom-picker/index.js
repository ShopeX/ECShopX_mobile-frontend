/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef } from 'react'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import { View, Text, Image, Picker } from '@tarojs/components'
import { SpImage } from '@/components'
import './index.scss'

/**
 * 该组件接受自定义名字和下拉框内容自定义，默认全部定铺
 * customStatus：是否自定义
 * customName：自定义的名字
 * 用法：<CustomPicker customStatus customName={customName} cancel={cancel} />
 *
 */

const initialState = {
  selectorChecked: '全部店铺',
  value: '0',
  customName: ''
}

function CustomPicker(props) {
  const [state, setState] = useImmer(initialState)
  const { selector, customStatus = false, cancel = () => {}, id = '' } = props
  const { selectorChecked, value, customName } = state

  useEffect(() => {
    if (customStatus) {
      selector.map((item, index) => {
        if (id == item.value) {
          setState((draft) => {
            draft.value = String(index)
            draft.customName = item.label
          })
        }
      })
      console.log('customStatus1', id, selector)
    }
  }, [id, selector])

  const onChange = (e) => {
    console.log('e', e)
    let index = Number(e.detail.value)
    setState((draft) => {
      draft.selectorChecked = selector[index].label
    })
    cancel(index, selector[index])
  }

  return (
    <View className='custom-picker'>
      <Picker mode='selector' rangeKey='label' range={selector} onChange={onChange} value={value}>
        <View className='picker-box'>
          <Text>{customStatus ? customName : selectorChecked}</Text>
          <Text className='iconfont icon-xialajiantou'></Text>
        </View>
      </Picker>
    </View>
  )
}

CustomPicker.options = {
  addGlobalClass: true
}

CustomPicker.defaultProps = {
  selector: [{ label: '手机号', value: 'phone' }]
}

export default CustomPicker
