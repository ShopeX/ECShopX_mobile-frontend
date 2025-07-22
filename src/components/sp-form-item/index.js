import React, { useEffect, useRef, useContext } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { validate, classNames, copyText, isEmpty, isFunction } from '@/utils'
import { SpInput as AtInput } from '@/components'
import { Context } from './../sp-form/context'
import SpPicker from './../sp-picker'
import './index.scss'

const initialState = {
  message: ''
}
function SpFormItem(props) {
  const { label, prop, children, info, copy = false, onChange = () => {} } = props
  const [state, setState] = useImmer(initialState)
  const { message } = state
  const value = useRef()

  const { formData, rules, addFields, addSetMessage } = useContext(Context)
  const rule = rules[prop] || []
  //   console.log('SpFormItem:', formData, label)
  value.current = formData[prop]

  useEffect(() => {
    if (prop) {
      addFields(prop, validateItem)
      addSetMessage(prop, updateMessage)
    }
  }, [prop])

  const validateItem = async (_formData) => {
    let validateResult
    try {
      for (const item of rule) {
        if (item.required) {
          if (!validate.isRequired(value.current)) {
            throw item.message
          }
        } else if (item?.validate == 'mobile') {
          if (!validate.isMobileNum(value.current)) {
            throw item.message
          }
        } else if (item?.validate == 'email') {
          if (!validate.isEmail(value.current)) {
            throw item.message
          }
        } else if (isFunction(item?.validate)) {
          await item.validate(value.current, _formData)
        }
      }
      setState((draft) => {
        draft.message = ''
      })
    } catch (e) {
      console.error(e)
      setState((draft) => {
        draft.message = e
      })
      validateResult = {
        field: prop,
        message: e
      }
    }
    return validateResult
  }

  const updateMessage = (message) => {
    setState((draft) => {
      draft.message = message
    })
  }

  const renderInputField = () => {
    const { type, disabled = false, clear = true, placeholder = '' } = props.info
    return (
      <AtInput
        clear={clear}
        focus
        name={prop}
        value={value.current}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => {
          onChange(prop, e)
        }}
      />
    )
  }

  const renderPickerField = () => {
    const { type, options = [] } = props.info
    return <SpPicker mode='select' options={options} />
  }

  const renderDateTimeField = () => {
    const { type } = props.info
    return <SpPicker />
  }

  const renderTextField = () => {
    return (
      <View className='text-field'>
        <Text className='text-value'>{value.current}</Text>
        {info?.copy && (
          <Text
            className='iconfont icon-fuzhi'
            onClick={() => {
              copyText(value.current)
            }}
          ></Text>
        )}
      </View>
    )
  }

  const renderComponent = () => {
    const { type } = props.info
    const types = {
      'input': renderInputField,
      'picker': renderPickerField,
      'datetime': renderDateTimeField,
      'text': renderTextField,
      'split': null
    }
    return types[type] ? types[type]() : null
  }

  return (
    <View className={classNames('sp-form-item', { 'split-line': info.type == 'split' })}>
      {label && (
        <View className='form-item-label'>
          {rule.length > 0 && <Text className='required'>*</Text>}
          <Text className='label'>{label}</Text>
        </View>
      )}
      {info.type != 'split' && (
        <View className={classNames('form-item-control', { 'disabled': !!info.disabled })}>
          {!isEmpty(info) ? renderComponent() : children}
        </View>
      )}
      {info.type != 'split' && <View className='form-item-message'>{message}</View>}
    </View>
  )
}

SpFormItem.options = {
  addGlobalClass: true
}

SpFormItem.defaultProps = {
  info: Object
}

export default SpFormItem
