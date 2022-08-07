import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpPage, SpImage } from '@/components'
import './exchange-code.scss'

const initialState = {
  qrcodeUrl: '',
  barcodeUrl: '',
  codeContent: '',
  distributorInfo: null
}
function ExChangeCode() {
  const $instance = getCurrentInstance()
  const [state, setState] = useImmer(initialState)
  const { qrcodeUrl, barcodeUrl, codeContent, distributorInfo } = state
  const { from = 'espier-detail' } = $instance.router.params
  useEffect(() => {
    fetchExChangeCode()
  }, [])

  const fetchExChangeCode = async () => {
    const { user_card_id } = $instance.router.params
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
      renderFooter={<View className='tip-content'>请将此页面交于店员核验</View>}
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
            重新选择兑换商品
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
