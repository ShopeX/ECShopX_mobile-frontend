import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { classNames } from '@/utils'
import './index.scss'
import { AtModal, AtModalHeader, AtModalContent, AtModalAction, AtRadio } from 'taro-ui'

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
          <Button onClick={onClose}>取消</Button> <Button onClick={handleConfirm}>确定</Button>
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
