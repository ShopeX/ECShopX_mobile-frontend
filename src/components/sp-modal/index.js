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
    onCancel = () => {},
    onConfirm = () => {}
  } = props
  return (
    // <RootPortal>
    <View className='sp-modal'>
      <View className='sp-modal__overlay' />
      <View className='sp-modal__content'>
        {title && <View className='sp-modal__content-hd'>{title}</View>}
        <View className={classNames('sp-modal__content-bd', contentAlign)}>{content}</View>
        <View className='sp-modal__content-ft'>
          {showCancel && (
            <View className='btn-cancel' onClick={onCancel}>
              {cancelText}
            </View>
          )}
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
