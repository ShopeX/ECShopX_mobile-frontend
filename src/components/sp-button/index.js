/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro from '@tarojs/taro'
import React, { useCallback, useState, useMemo } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { $t } from '@/i18n'
import './index.scss'

const voidFunc = () => {}

const SpButton = (props) => {
  const { resetText = '', confirmText = '', onConfirm = voidFunc, onReset = voidFunc } = props

  return (
    <View className='sp-button'>
      <View className='sp-button__reset' onClick={onReset}>
        {resetText || $t('61e2d21a.625fb2')}
      </View>
      <View className='sp-button__confirm' onClick={onConfirm}>
        {confirmText || $t('settings.confirm')}
      </View>
    </View>
  )
}

SpButton.options = {
  addGlobalClass: true
}

export default SpButton
