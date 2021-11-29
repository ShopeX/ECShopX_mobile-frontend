import React, { Component } from 'react';
import { View, Text } from '@tarojs/components'
import { connect } from 'react-redux'
import { classNames, checkClassName } from '@/utils'
import './index.scss'

function SpCheckboxNew(props) {
  const { className, children, isChecked = false, label, onChange = () => {} } = this.props

  const onChangeCheckbox = () => {
    onChange(!isChecked)
  }

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
          isChecked ? 'icon-roundcheckfill' : 'icon-round'
        )}
      ></Text>
      <View className='sp-checkbox-new__label'>{label || children}</View>
    </View>
  )
}

export default SpCheckboxNew
