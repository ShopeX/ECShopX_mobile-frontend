import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtIcon, AtButton } from 'taro-ui'
import { classNames, navigateTo } from '@/utils'
import ModalPolicy from './modal-policy'

import './index.scss'

function SpModal(props) {
  const {
    children,
    title = '',
    content = '',
    contentAlign = 'left',
    cancelText = '取消',
    confirmText = '确定',
    showCancel = true,
    onCancel = () => { },
    onConfirm = () => { }
  } = props
  return (
    // <RootPortal>
    <View className='sp-modal'>
      <View className='sp-modal__overlay' />
      <View className='sp-modal__content'>
        {title && <View className='sp-modal__content-hd'>{title}</View>}
        <View className={classNames('sp-modal__content-bd', contentAlign)}>
          {content}
        </View>
        <View className='sp-modal__content-ft'>
          {showCancel && <View className='btn-cancel' onClick={onCancel}>
            {cancelText}
          </View>}
          <View className='btn-confirm' onClick={onConfirm}>
            {confirmText}
          </View>
        </View>
      </View>
    </View>
    // </RootPortal>
  )
}

SpModal.options = {
  addGlobalClass: true
}

export default SpModal
