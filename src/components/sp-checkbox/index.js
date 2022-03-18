import React, { Component, useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { classNames, getThemeStyle, styleNames } from '@/utils'
import './index.scss'

function SpCheckboxNew(props) {
  const {
    className,
    children,
    checked = false,
    label,
    onChange = () => {},
    disabled = false
  } = props

  const [isChecked, setChecked] = useState(checked)

  const onChangeCheckbox = () => {
    if (disabled) return
    setChecked(!isChecked)
    onChange && onChange(!isChecked)
  }

  useEffect(() => {
    setChecked(props.checked)
  })

  return (
    <View
      className={classNames(
        {
          'sp-checkbox-new': true
        },
        className
      )}
      onClick={onChangeCheckbox}
    >
      <Text
        className={classNames(
          {
            iconfont: true
          },
          disabled ? 'icon-circle1' : isChecked ? 'icon-roundcheckfill' : 'icon-round',
          disabled && isChecked && 'icon-roundcheckfill'
        )}
      ></Text>
      <View className='sp-checkbox-new__label'>{label || children}</View>
    </View>
  )
}

export default SpCheckboxNew
