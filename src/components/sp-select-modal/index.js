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
import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { classNames } from '@/utils'
import { AtModal, AtModalHeader, AtModalContent, AtModalAction, AtRadio, AtButton } from 'taro-ui'
import './index.scss'

function SpSelectModal(props) {
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
        title: '请选择'
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
        <AtModalHeader>{title}</AtModalHeader>
        <AtModalContent>
          <AtRadio options={options} value={value} onClick={handleChange} />
        </AtModalContent>
        <AtModalAction>
          <AtButton onClick={onClose}>取消</AtButton>{' '}
          <AtButton className='confirm-btn' onClick={handleConfirm}>
            确定
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
  title: '请选择',
  options: [],
  isOpened: false,
  onClose: () => {},
  onConfirm: () => {}
}

export default SpSelectModal
