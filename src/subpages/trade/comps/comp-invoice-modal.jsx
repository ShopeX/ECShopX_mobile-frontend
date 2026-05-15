/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { classNames } from '@/utils'
import { useTranslation, $t } from '@/i18n'
import { SpInput as AtInput } from '@/components'
import './comp-invoice-modal.scss'

const initState = {
  info: {
    id: '',
    email: ''
  }
}

function InvoiceModal(props) {
  useTranslation()
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
          <View className='comp-invoice-modal__header'>{$t('44e64c13.6a91d7')}</View>
          <View className='comp-invoice-modal__content'>
            <View className='email-box'>
              <AtInput
                name='email'
                value={info?.email}
                placeholder={$t('44e64c13.b457cd')}
                onChange={(e) => handleChange('email', e)}
              />
            </View>
            <View className='tips-box'>{$t('44e64c13.66876c')}</View>
          </View>
          <View className='comp-invoice-modal__footer'>
            <View className='close-btn' onClick={onClose}>
              {$t('44e64c13.625fb2')}
            </View>
            <View className='confirm-btn' onClick={() => onConfirm(info)}>
              {$t('44e64c13.38cf16')}
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
