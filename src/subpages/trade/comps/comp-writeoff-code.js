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
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { useImmer } from 'use-immer'
import { SpFloatLayout, SpImage } from '@/components'
import api from '@/api'
import doc from '@/doc'
import './comp-writeoff-code.scss'

const initialState = {
  qrcode: '',
  pickup_code: ''
}
function CompWriteOffCode(props) {
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
    const { order_id } = router.params
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
      title='核销码'
      className='comp-wirteoff-code'
      open={isOpened}
      onClose={handleCloseFloatLayout}
      renderFooter={
        <AtButton circle type='primary' onClick={handleCloseFloatLayout}>
          关闭
        </AtButton>
      }
    >
      <View className='qrcode-container'>
        <View className='wirte-off-code'>
          <Image className='qrcode-image' src={qrcode} mode='widthFix' />
        </View>
        <View className='pickup-code'>{pickup_code}</View>
        <View className='wirte-off-desc'>提货时请出告知店员提货验证码</View>
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
