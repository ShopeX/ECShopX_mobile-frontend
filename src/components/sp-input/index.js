/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Input } from '@tarojs/components'
import { classNames } from '@/utils'
// import { SpInput as AtInput } from '@/components'
import throttle from 'lodash/throttle'
import './index.scss'

function SpInput(props) {
  const { required, title, type = 'text' } = props
  const [cursor, setCursor] = useState(-1)

  const handleInput = async (event) => {
    console.log('sp-input', event, event.detail.value, props.maxLength)
    if (props.maxLength && event.detail.value?.length > props.maxLength) {
      return
    }
    await props.onChange(event.detail.value)
    throttle(() => {
      setCursor(event.detail.cursor)
    }, 100)
  }

  const handleClear = () => {
    console.log('claer')
    setCursor(-1)
    props.onChange('')
  }

  return (
    <View className={classNames('at-input', props.className)}>
      <View className='at-input__container'>
        {title && (
          <View
            className={classNames('at-input__title', {
              'at-input__title--required': required
            })}
          >
            {title}
          </View>
        )}
        <Input
          clear={props.clear}
          value={props.value}
          type={type}
          maxLength={props.maxLength}
          placeholder={props.placeholder}
          cursor={cursor}
          onInput={handleInput}
          placeholderClass={props.placeholderClass}
          className={classNames('at-input__input', props.className)}
          onConfirm={props.onConfirm}
        />
        {/* <Input
          type={type}
          maxLength={props.maxLength}
          placeholder={props.placeholder}
          cursor={cursor}
          onInput={handleInput}
          placeholderClass={props.placeholderClass}
        ></Input> */}
        {/* {props.value && props.clear && (
          <View className='sp-input__clear' onClick={handleClear}>
            x
          </View>
        )} */}
      </View>
    </View>
  )
}

SpInput.options = {
  addGlobalClass: true
}

SpInput.defaultProps = {
  className: '',
  required: false,
  title: '',
  value: '',
  clear: false,
  placeholder: '',
  maxLength: null,
  onChange: () => {},
  onConfirm: () => {}
}

export default SpInput
