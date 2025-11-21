/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import { View, ScrollView, Text } from '@tarojs/components'
import { SpPage, SpScrollView, SpTagBar, SpImage, SpSelectModal } from '@/components'
import api from '@/api'
import QRCode from 'qrcode'
import doc from '@/doc'
import { pickBy, showToast } from '@/utils'
import './activity-code.scss'

const initialState = {}
function ActivityCode(props) {
  const colors = useSelector((state) => state.sys)
  const [state, setState] = useImmer(initialState)
  const {} = state
  const router = useRouter()

  useEffect(() => {}, [])

  const handleScanGoodsBN = async () => {
    // 注意：真机scancode扫码完成后回调，taro getCurrentInstance().router = null，无法获取到路由参数
    const { errMsg, result } = await Taro.scanCode()
    console.log('handleScanCode:', result)
    if (errMsg == 'scanCode:ok') {
      Taro.showLoading({ title: '' })
      await api.dianwu.registrationVerify(JSON.parse(result))
      Taro.hideLoading()
      showToast('核销成功')
    } else {
      showToast(errMsg)
    }
  }

  return (
    <SpPage className='page-activity-code'>
      <View className='activity-code' onClick={handleScanGoodsBN}>
        <View className='iconfont icon-saoma activity-code__icon'></View>
        <View className='activity-code__text'>报名核销</View>
      </View>
    </SpPage>
  )
}

ActivityCode.options = {
  addGlobalClass: true
}

export default ActivityCode
