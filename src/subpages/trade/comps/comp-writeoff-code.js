/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { useImmer } from 'use-immer'
import { SpFloatLayout } from '@/components'
import api from '@/api'
import { useTranslation, $t } from '@/i18n'
import './comp-writeoff-code.scss'

const initialState = {
  qrcode: '',
  pickup_code: ''
}
function CompWriteOffCode(props) {
  useTranslation()
  const { isOpened, onClose, onConfirm } = props
  const [state, setState] = useImmer(initialState)
  const { qrcode, pickup_code } = state
  const router = useRouter()
  const timer = useRef()

  useEffect(() => {
    return () => {
      clearTimeout(timer.current)
    }
  }, [])

  useEffect(() => {
    if (isOpened) {
      fetchCode()
    }
  }, [isOpened])

  const fetchCode = async () => {
    const { order_id } = router?.params
    const { qrcode_url, pickup_code } = await api.trade.zitiCode({ order_id })
    setState((draft) => {
      draft.qrcode = qrcode_url
      draft.pickup_code = pickup_code
    })

    timer.current = setTimeout(() => {
      fetchCode()
    }, 60000)
  }

  const handleCloseFloatLayout = () => {
    clearTimeout(timer.current)
    onClose()
  }

  return (
    <SpFloatLayout
      title={$t('86c5463e.1d50e1')}
      className='comp-wirteoff-code'
      open={isOpened}
      onClose={handleCloseFloatLayout}
      renderFooter={
        <AtButton circle type='primary' onClick={handleCloseFloatLayout}>
          {$t('86c5463e.b15d91')}
        </AtButton>
      }
    >
      <View className='qrcode-container'>
        <View className='wirte-off-code'>
          <Image className='qrcode-image' src={qrcode} mode='widthFix' />
        </View>
        <View className='pickup-code'>{pickup_code}</View>
        <View className='wirte-off-desc'>{$t('86c5463e.af2026')}</View>
      </View>
    </SpFloatLayout>
  )
}

CompWriteOffCode.options = {
  addGlobalClass: true
}

CompWriteOffCode.defaultProps = {
  isOpened: false,
  onClose: () => {},
  onConfirm: () => {}
}

export default CompWriteOffCode
