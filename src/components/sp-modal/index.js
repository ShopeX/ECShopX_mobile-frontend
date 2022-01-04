import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtIcon, AtButton } from 'taro-ui'
import { classNames, navigateTo } from '@/utils'
import ModalPolicy from './modal-policy'

import './index.scss'

function SpModal (props) {
  const {
    children,
    type,
    title = '',
    cancelText = '取消',
    confirmText = '确定',
    onCancel = () => {},
    onConfirm = () => {}
  } = props
  return (
    <View className='sp-modal'>
      <View className='sp-modal-bg' />
      <View className='sp-modal-con'>
        {title && <View className='sp-modal-hd'></View>}
        <View className='sp-modal-bd'>
          {type == 'policy' && <ModalPolicy />}
          {children}
        </View>
        <View className='sp-modal-ft'>
          <View className='sp-modal-btn' onClick={onCancel}>
            {cancelText}
          </View>
          <View className='sp-modal-btn' onClick={onConfirm}>
            {confirmText}
          </View>
        </View>
      </View>
    </View>
  )
}

SpModal.options = {
  addGlobalClass: true
}

export default SpModal
