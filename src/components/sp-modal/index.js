/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React from 'react'
import { View, Text } from '@tarojs/components'
import { AtIcon, AtButton } from 'taro-ui'
import { classNames, navigateTo } from '@/utils'
import { useTranslation, $t } from '@/i18n'
import ModalPolicy from './modal-policy'

import './index.scss'

function SpModal(props) {
  useTranslation()
  const {
    children,
    title = '',
    content = '',
    contentAlign = 'left',
    cancelText = $t('fa2c4a92.625fb2'),
    confirmText = $t('fa2c4a92.38cf16'),
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
