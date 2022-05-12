import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { classNames } from '@/utils'
import PickerDateTime from './picker-datetime'
import './index.scss'

const initialState = {
  visible: false,
  value: ''
}
function SpPicker(props) {
  const { mode } = props
  const [state, setState] = useImmer(initialState)
  const { value, visible } = state

  const handlerChange = () => {}

  const onPickerCancel = () => {
    setState((draft) => {
      draft.visible = false
    })
  }

  const pickerConfirm = () => {}
  return (
    <View className='sp-picker'>
      <View
        className='picker-value'
        onClick={() => {
          setState((draft) => {
            draft.visible = true
          })
        }}
      >
        2022/04/27 12:08
      </View>

      <View
        className={classNames('mask', {
          visible: visible
        })}
        onTap={onPickerCancel}
        catchtouchmove
      ></View>

      <View
        class={classNames('sp-picker-cnt', {
          visible: visible
        })}
      >
        <View className='sp-picker-hd' catchtouchmove>
          <Text onTap={onPickerCancel}>取消</Text>
          {/* {this.props.children} */}
          <Text onTap={pickerConfirm}>确定</Text>
        </View>
        <View className='sp-picker-bd'>
          {mode == 'datetime' && (
            <PickerDateTime
              className='w-picker-wrapper'
              value={value}
              fields='minute'
              change={handlerChange}
            />
          )}
        </View>
      </View>
    </View>
  )
}

SpPicker.options = {
  addGlobalClass: true
}

export default SpPicker
