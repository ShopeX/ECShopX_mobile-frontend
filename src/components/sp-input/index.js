/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useState, useRef } from 'react'
import Taro from '@tarojs/taro'
import { View, Input } from '@tarojs/components'
import { classNames, isWeb } from '@/utils'
// import { SpInput as AtInput } from '@/components'
import throttle from 'lodash/throttle'
import './index.scss'

function SpInput(props) {
  const { required, title, type = 'text' } = props
  const [cursor, setCursor] = useState(-1)
  const inputRef = useRef(null)
  const containerRef = useRef(null)

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

  // 处理确认事件（移动端的"完成"按钮和H5的回车键）
  const handleConfirm = (event) => {
    if (props.onConfirm) {
      props.onConfirm(event)
    }
  }

  // H5环境下处理回车键，触发onConfirm
  const handleKeyDown = (event) => {
    if (isWeb && (event.key === 'Enter' || event.keyCode === 13)) {
      event.preventDefault()
      event.stopPropagation()
      if (props.onConfirm) {
        props.onConfirm({
          detail: {
            value: props.value || ''
          }
        })
      }
    }
  }

  // 使用useEffect直接绑定DOM事件（作为备用方案）
  useEffect(() => {
    if (!isWeb) return

    let timeoutId = null
    let inputElement = null
    let handleNativeKeyDown = null
    let handleNativeKeyPress = null

    const findInputAndBind = () => {
      if (!containerRef.current) {
        timeoutId = setTimeout(findInputAndBind, 100)
        return
      }

      inputElement = containerRef.current.querySelector('input')
      if (!inputElement) {
        timeoutId = setTimeout(findInputAndBind, 100)
        return
      }

      handleNativeKeyDown = (e) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
          e.preventDefault()
          e.stopPropagation()
          if (props.onConfirm) {
            props.onConfirm({
              detail: {
                value: props.value || inputElement.value || ''
              }
            })
          }
        }
      }

      // 监听键盘完成按钮（移动端）
      handleNativeKeyPress = (e) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
          e.preventDefault()
          e.stopPropagation()
          if (props.onConfirm) {
            props.onConfirm({
              detail: {
                value: props.value || inputElement.value || ''
              }
            })
          }
        }
      }

      inputElement.addEventListener('keydown', handleNativeKeyDown)
      inputElement.addEventListener('keypress', handleNativeKeyPress)
    }

    findInputAndBind()

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      if (inputElement && handleNativeKeyDown && handleNativeKeyPress) {
        inputElement.removeEventListener('keydown', handleNativeKeyDown)
        inputElement.removeEventListener('keypress', handleNativeKeyPress)
      }
    }
  }, [isWeb, props.value, props.onConfirm])

  return (
    <View className={classNames('at-input', props.className)}>
      <View ref={containerRef} className='at-input__container'>
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
          ref={inputRef}
          clear={props.clear}
          value={props.value}
          type={type}
          maxLength={props.maxLength}
          placeholder={props.placeholder}
          cursor={cursor}
          onInput={handleInput}
          placeholderClass={props.placeholderClass}
          className={classNames('at-input__input', props.className)}
          onConfirm={handleConfirm}
          nativeProps={isWeb ? { onKeyDown: handleKeyDown, onKeyPress: handleKeyDown } : {}}
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
