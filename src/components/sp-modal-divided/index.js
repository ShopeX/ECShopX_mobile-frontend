import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtIcon, AtButton } from 'taro-ui'
import { classNames, navigateTo } from '@/utils'

import './index.scss'

function SpModalDivided(props) {
  const {
    children,
    title = '',
    content = '抱歉，本店会员才可以访问，如有需要可电话联系店铺',
    contentAlign = 'left',
    cancelText = '联系店铺',
    confirmText = '',
    showCancel = true,
    onCancel = () => { },
    onConfirm = () => { }
  } = props
  return (
    // <RootPortal>
    <View className='sp-modal-divided'>
      <View className='sp-modal__overlay' />
      <View className='sp-modal__content'>
        {title && <View className='sp-modal__content-hd'>{title}</View>}
        <View className={classNames('sp-modal__content-bd', contentAlign)}>
          {content}
        </View>
        <View className='sp-modal__content-ft'>
          <View className='btn-confirm' onClick={onConfirm}>
            {confirmText}
          </View>
          {showCancel && <View className='btn-cancel' onClick={onCancel}>
            {cancelText}
          </View>}
        </View>
      </View>
    </View>
    // </RootPortal>
  )
}

SpModalDivided.options = {
  addGlobalClass: true
}

export default SpModalDivided
