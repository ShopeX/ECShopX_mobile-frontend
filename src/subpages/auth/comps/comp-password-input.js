/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React from 'react'
import { View, Text } from '@tarojs/components'
import { classNames } from '@/utils'
import { useImmer } from 'use-immer'
import { SpInput as AtInput } from '@/components'
import { useTranslation, $t } from '@/i18n'
import './comp-password-input.scss'

const initialValue = {
  //一种是正常的 text 一种是 password
  type: 'password'
}

const CompPasswordInput = (props) => {
  useTranslation()
  const {
    onChange = () => {},
    disabled,
    onFocus = () => {},
    onBlur = () => {},
    value,
    placeholder
  } = props

  const placeholderText = placeholder ?? $t('24f4b47f.c4d0c8')

  const [state, setState] = useImmer(initialValue)

  const { type } = state

  const handleToggle = () => {
    setState((_state) => {
      _state.type = type === 'text' ? 'password' : 'text'
    })
  }

  return (
    <View className='comp-password-input'>
      <AtInput
        clear
        type={type}
        placeholder={placeholderText}
        placeholderClass='input-placeholder'
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        value={value}
        disabled={disabled}
      />
      <View className='input-icon' onClick={handleToggle}>
        <Text
          className={classNames('icon iconfont', [
            type === 'text' ? 'icon-xianshi' : 'icon-yincang'
          ])}
        ></Text>
      </View>
    </View>
  )
}

CompPasswordInput.options = {
  addGlobalClass: true
}

export default CompPasswordInput
