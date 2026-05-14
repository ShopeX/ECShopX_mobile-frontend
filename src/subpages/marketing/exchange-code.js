/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpPage, SpImage } from '@/components'
import { useTranslation, $t } from '@/i18n'
import './exchange-code.scss'

const initialState = {
  qrcodeUrl: '',
  barcodeUrl: '',
  codeContent: '',
  distributorInfo: null
}
function ExChangeCode() {
  const { i18n } = useTranslation()
  const $instance = getCurrentInstance() || {}
  const [state, setState] = useImmer(initialState)
  const { qrcodeUrl, barcodeUrl, codeContent, distributorInfo } = state
  const { from = 'espier-detail' } = $instance?.router?.params
  useEffect(() => {
    fetchExChangeCode()
  }, [])

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('493fad9b.9bff7a') })
  }, [i18n.language])

  const fetchExChangeCode = async () => {
    const { user_card_id } = $instance?.router?.params
    const { qrcode_url, barcode_url, code, distributor_info } = await api.member.getQRcode({
      user_card_id
    })
    setState((draft) => {
      draft.qrcodeUrl = qrcode_url
      draft.barcodeUrl = barcode_url
      draft.codeContent = code
      draft.distributorInfo = distributor_info
    })
  }

  return (
    <SpPage
      className='page-marketing-exchange-code'
      renderFooter={<View className='tip-content'>{$t('5ef83aea.88ebc3')}</View>}
    >
      <View className='store-info'>
        {/* <SpImage src={qrcodeUrl} width={80} height={80} /> */}
        <View className='store-name'>{distributorInfo?.name}</View>
      </View>
      <View className='exchange-qrcode'>
        <SpImage src={qrcodeUrl} />
      </View>
      <View className='exchange-barcode'>
        <SpImage src={barcodeUrl} />
        <View className='code-content'>{codeContent}</View>
      </View>
      {from == 'espier-detail' && (
        <View className='btn-wrap'>
          <AtButton
            type='primary'
            circle
            onClick={() => {
              Taro.navigateBack({ delta: 2 })
            }}
          >
            {$t('5ef83aea.4eb6c0')}
          </AtButton>
        </View>
      )}
    </SpPage>
  )
}

ExChangeCode.options = {
  addGlobalClass: true
}

export default ExChangeCode
