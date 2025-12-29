/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { classNames } from '@/utils'
import { SpInput as AtInput } from '@/components'
import './comp-invoice-modal.scss'

const initState = {
  info: {
    id: '',
    email: ''
  }
}

function InvoiceModal(props) {
  const { open = false, confirmInfo = {}, onClose = () => {}, onConfirm = () => {} } = props
  const [state, setState] = useImmer(initState)
  const { info } = state

  useEffect(() => {
    if (open) {
      setState((draft) => {
        draft.info = confirmInfo
      })
    }
  }, [open])

  const handleChange = (name, val) => {
    const nInfo = JSON.parse(JSON.stringify(state.info || {}))
    nInfo[name] = val
    setState((draft) => {
      draft.info = nInfo
    })
  }
  return (
    <View
      className={classNames('comp-invoice-modal', {
        'open': open
      })}
    >
      <View className='comp-invoice-modal__overlay'></View>
      <View className='comp-invoice-modal__container'>
        <View className='comp-invoice-modal-box'>
          <View className='comp-invoice-modal__header'>请确认重发邮箱</View>
          <View className='comp-invoice-modal__content'>
            <View className='email-box'>
              <AtInput
                name='email'
                value={info?.email}
                placeholder='请输入电子邮箱'
                onChange={(e) => handleChange('email', e)}
              />
            </View>
            <View className='tips-box'>电子发票需要一定的时间才能发送到您的邮箱，请耐心等待</View>
          </View>
          <View className='comp-invoice-modal__footer'>
            <View className='close-btn' onClick={onClose}>
              取消
            </View>
            <View className='confirm-btn' onClick={() => onConfirm(info)}>
              确定
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

InvoiceModal.options = {
  addGlobalClass: true
}

export default InvoiceModal
