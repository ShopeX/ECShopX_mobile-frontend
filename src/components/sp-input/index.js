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
    const detail = event.detail || {}
    let value = detail.value
    const maxLen = props.maxLength

    // 回车发送：部分端在 input 的 detail 中带 keyCode（与 H5 keydown、原生监听互为补充）
    if (props.onConfirm) {
      const keyCode = detail.keyCode
      const isEnter = keyCode === 13 || keyCode === 'Enter'
      if (isEnter) {
        const clean =
          typeof value === 'string' ? value.replace(/\r\n/g, '').replace(/\r/g, '').replace(/\n/g, '') : value
        props.onConfirm({
          detail: {
            value: clean ?? ''
          }
        })
        await props.onChange(clean ?? '')
        throttle(() => {
          setCursor(typeof detail.cursor === 'number' ? detail.cursor : -1)
        }, 100)
        return
      }
    }

    if (maxLen && value?.length > maxLen) {
      return
    }
    await props.onChange(value)
    throttle(() => {
      setCursor(detail.cursor)
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

  // H5：回车触发 onConfirm（读 DOM 当前值，避免 iOS 受控 props 滞后）
  const handleKeyDown = (event) => {
    if (isWeb && (event.key === 'Enter' || event.keyCode === 13)) {
      event.preventDefault()
      event.stopPropagation()
      if (props.onConfirm) {
        const domVal = event.target?.value
        props.onConfirm({
          detail: {
            value: domVal != null ? domVal : props.value || ''
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
