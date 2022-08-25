import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View, Text } from '@tarojs/components'
import { AtButton, AtInput } from 'taro-ui'
import { SpPage, SpImage, SpPrice } from '@/components'
import './collection.scss'

function DianwuCollection(props) {
  return (
    <SpPage className='page-dianwu-collection'>
      <View className='block-hd'>
        <SpImage width={300} height={160} mode='aspectFit' />
      </View>

      {/* 微信、支付宝收款 */}
      {/* <View className='qrcode-collection'>
        <View className='title'>您正在向 ShopeX商派 (宜山路店) 支付货款如果名字很长可换行显示</View>
        <View className='txt-h'>请与店员确认金额后支付</View>
        <View className='qr-code-wrapper'>
          <SpImage width={510} height={510} />
        </View>
        <View className='txt-f'>当前收款码将在12分25秒后刷新</View>
        <View className='btn-pending'>挂单</View>
      </View> */}

      {/* 现金收款 */}
      <View className='cash-collection'>
        <View className='title'>应收款</View>
        <View className='cash-amount'>
          <SpPrice size={50} value={1450} />
        </View>
        <View className='coll-form'>
          <View className='label'>实收现金</View>
          <View className='field-input'>
            <Text className='append'>¥</Text>
            <AtInput className='cash-value'></AtInput>
          </View>
          <View className='label'>
            应找零<Text className='sub-txt'>（自动计算找零，非填入项）</Text>
          </View>
          <View className='field-change'>
            <Text className='append'>¥</Text>
            <View className='change-value'>13131313</View>
          </View>
        </View>
        <View className='btn-confirm-wrap'>
          <AtButton className='btn-confirm' circle>完成收款</AtButton>
        </View>
        <View className='pending'>挂单</View>
      </View>
    </SpPage>
  )
}

DianwuCollection.options = {
  addGlobalClass: true
}

export default DianwuCollection
