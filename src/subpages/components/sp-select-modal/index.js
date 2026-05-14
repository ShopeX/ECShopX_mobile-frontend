/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { classNames } from '@/utils'
import { useTranslation, $t } from '@/i18n'
import { AtModal, AtModalHeader, AtModalContent, AtModalAction, AtRadio, AtButton } from 'taro-ui'
import './index.scss'

function SpSelectModal(props) {
  useTranslation()
  const { isOpened, options, onClose, title, onConfirm } = props
  const [value, setValue] = useState(null)
  useEffect(() => {
    if (!isOpened) {
      setValue(null)
    }
  }, [isOpened])

  const handleConfirm = () => {
    if (!value) {
      Taro.showToast({
        icon: 'none',
        title: $t('9ca5f9c8.708c9d')
      })
      return
    }
    onConfirm(value)
  }

  const handleChange = (e) => {
    console.log(e)
    setValue(e)
  }

  return (
    <View className={classNames('sp-select-modal', props.className)}>
      <AtModal isOpened={isOpened} onClose={onClose}>
        <AtModalHeader>{title || $t('9ca5f9c8.708c9d')}</AtModalHeader>
        <AtModalContent>
          <AtRadio options={options} value={value} onClick={handleChange} />
        </AtModalContent>
        <AtModalAction>
          <AtButton onClick={onClose}>{$t('9ca5f9c8.625fb2')}</AtButton>{' '}
          <AtButton className='confirm-btn' onClick={handleConfirm}>
            {$t('9ca5f9c8.38cf16')}
          </AtButton>
        </AtModalAction>
      </AtModal>
    </View>
  )
}

SpSelectModal.options = {
  addGlobalClass: true
}

SpSelectModal.defaultProps = {
  className: '',
  title: '',
  options: [],
  isOpened: false,
  onClose: () => {},
  onConfirm: () => {}
}

export default SpSelectModal
