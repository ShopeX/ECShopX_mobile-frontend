import React, { useEffect, useRef, useContext, useImperativeHandle } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { classNames } from '@/utils'
import { View } from '@tarojs/components'
import { Context } from './context'
import './index.scss'

function SpForm(props, ref) {
  const { formData, rules, children, className } = props
  const fields = useRef([])

  const onSubmitForm = (callback) => {
    let fromValidate = true
    fields.current.forEach((validate) => {
      // console.log('SpForm onSubmitForm:', formData, validate())
      if (!validate()) {
        fromValidate = fromValidate && false
      }
    })
    if (fromValidate) {
      callback()
    }
  }

  //   console.log('SpForm:', formData)

  const addFields = (validate) => {
    fields.current.push(validate)
  }

  const onReset = () => {}

  useImperativeHandle(ref, () => ({
    onSubmit: (cb) => {
      onSubmitForm(cb)
    },
    onSubmitAsync: () => {
      return new Promise((resolve, reject) =>{
        onSubmitForm(() => {
          resolve()
        })
      })
    }
  }))

  return (
    <Context.Provider
      value={{
        formData,
        rules,
        addFields
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
