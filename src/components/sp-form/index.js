/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef, useContext, useImperativeHandle } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { classNames, isArray, isObject } from '@/utils'
import { View } from '@tarojs/components'
import { Context } from './context'
import './index.scss'

function SpForm(props, ref) {
  const { formData, rules, children, className } = props
  const fields = useRef([])
  const fieldsMessage = useRef({})

  const onSubmitForm = (callback, keys = []) => {
    return new Promise(async (resolve, reject) => {
      const fieldList =
        keys.length > 0 ? fields.current.filter((item) => keys.includes(item.prop)) : fields.current
      let formValidateResult = []
      for (const field of fieldList) {
        const fieldResult = await field.validate(formData)
        if (fieldResult) {
          formValidateResult.push(fieldResult)
        }
      }
      callback(!formValidateResult.length, formValidateResult)
    })
  }

  const onSubmitAsync = (keys = []) => {
    return new Promise(async (resolve, reject) => {
      const fieldList =
        keys.length > 0 ? fields.current.filter((item) => keys.includes(item.prop)) : fields.current
      let formValidateResult = []
      for (const field of fieldList) {
        const fieldResult = await field.validate(formData)
        if (fieldResult) {
          formValidateResult.push(fieldResult)
        }
      }
      if (formValidateResult.length > 0) {
        reject(formValidateResult)
      } else {
        resolve()
      }
    })
  }

  const setMessage = (arr) => {
    if (isArray(arr)) {
      arr.forEach((item) => {
        fieldsMessage.current[item.prop](item.message)
      })
    } else if (isObject(arr)) {
      fieldsMessage.current[arr.prop](arr.message)
    }
  }

  const addFields = (prop, validate) => {
    fields.current.push({ prop, validate })
  }

  const addSetMessage = (prop, updateMessage) => {
    fieldsMessage.current[prop] = updateMessage
  }

  useImperativeHandle(ref, () => ({
    onSubmit: onSubmitForm,
    onSubmitAsync,
    setMessage
  }))

  return (
    <Context.Provider
      value={{
        formData,
        rules,
        addFields,
        addSetMessage
      }}
    >
      <View className={classNames('sp-form', className)}>{children}</View>
    </Context.Provider>
  )
}

SpForm.options = {
  addGlobalClass: true
}

export default React.forwardRef(SpForm)
