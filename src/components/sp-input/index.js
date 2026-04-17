/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useState, useRef } from 'react'
import { View, Input } from '@tarojs/components'
import { classNames, isWeb } from '@/utils'
// import { SpInput as AtInput } from '@/components'
import throttle from 'lodash/throttle'
import './index.scss'

const noop = () => {}

function SpInput(props) {
  const {
    required,
    title,
    type = 'text',
    confirmType,
    onBlur = noop,
    onFocus = noop,
    onChange = noop,
    onConfirm
  } = props
  const [cursor, setCursor] = useState(-1)
  const inputRef = useRef(null)
  /** 防止 H5 上 keydown 与 Input onConfirm 等对同一次回车重复触发 */
  const lastConfirmAtRef = useRef(0)

  const safeOnConfirm = (payload) => {
    if (!onConfirm) return
    const now = Date.now()
    if (now - lastConfirmAtRef.current < 100) return
    lastConfirmAtRef.current = now
    onConfirm(payload)
  }

  const handleInput = async (event) => {
    const detail = event.detail || {}
    let value = detail.value
    const maxLen = props.maxLength

    // 回车发送：小程序等会在 input 的 detail 中带 keyCode；H5 仅用下方 handleKeyDown，避免与 input 事件重复触发
    if (onConfirm) {
      const keyCode = detail.keyCode
      const isEnter = keyCode === 13 || keyCode === 'Enter'
      if (isEnter && !isWeb) {
        const clean =
          typeof value === 'string'
            ? value.replace(/\r\n/g, '').replace(/\r/g, '').replace(/\n/g, '')
            : value
        safeOnConfirm({
          detail: {
            value: clean ?? ''
          }
        })
        await onChange(clean ?? '')
        throttle(() => {
          setCursor(typeof detail.cursor === 'number' ? detail.cursor : -1)
        }, 100)
        return
      }
    }

    if (maxLen && value?.length > maxLen) {
      return
    }
    await onChange(value)
    throttle(() => {
      setCursor(detail.cursor)
    }, 100)
  }

  const handleClear = () => {
    console.log('claer')
    setCursor(-1)
    onChange('')
  }

  // 处理确认事件（移动端的"完成"按钮和H5的回车键）
  const handleConfirm = (event) => {
    safeOnConfirm(event)
  }

  // H5：回车触发 onConfirm（读 DOM 当前值，避免 iOS 受控 props 滞后）
  const handleKeyDown = (event) => {
    if (isWeb && (event.key === 'Enter' || event.keyCode === 13)) {
      event.preventDefault()
      event.stopPropagation()
      const domVal = event.target?.value
      safeOnConfirm({
        detail: {
          value: domVal != null ? domVal : props.value ?? ''
        }
      })
    }
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
          confirmType={confirmType}
          onBlur={onBlur}
          onFocus={onFocus}
          nativeProps={isWeb ? { onKeyDown: handleKeyDown } : {}}
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
  onChange: noop,
  onBlur: noop,
  onFocus: noop
}

export default SpInput
