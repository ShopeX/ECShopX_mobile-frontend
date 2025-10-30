// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
import React, { useEffect } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { useImmer } from 'use-immer'
import api from '@/api'
import { SpInput as AtInput } from '@/components'
import classNames from 'classnames'
import './comp-input-phone.scss'

const initialValue = {
  error: false
}

const CompInputPhone = (props) => {
  const {
    name,
    type,
    placeholder,
    onChange = () => {},
    onFocus = () => {},
    onBlur = () => {},
    value,
    needValidate,
    ...restProps
  } = props

  const [state, setState] = useImmer(initialValue)

  const { error } = state

  const handleChange = async (val) => {
    let errorStatus = false
    if (val.length === 11) {
      const { is_new } = await api.wx.getIsNew({ mobile: val })
      errorStatus = !!is_new
      setState((_state) => {
        _state.error = errorStatus
      })
    }
    if (val.length === 0) {
      errorStatus = false
      setState((_state) => {
        _state.error = errorStatus
      })
    }
    onChange?.(val, errorStatus)
  }

  // useEffect(()=>{
  //   console.log("===needValidate===>",needValidate)
  //   setState(_state=>{
  //     _state.error=needValidate?_state.error:false
  //   })
  // },[needValidate])

  return (
    <View
      className={classNames('comp-input-phone', {
        'error': error
      })}
    >
      <AtInput
        clear
        name='mobile'
        maxLength={11}
        type='tel'
        placeholder='请输入您的手机号码'
        onChange={handleChange}
        value={value}
        {...restProps}
      />
      {error && needValidate && <View className='error'>该手机号码未注册</View>}
    </View>
  )
}

CompInputPhone.options = {
  addGlobalClass: true
}

export default CompInputPhone
