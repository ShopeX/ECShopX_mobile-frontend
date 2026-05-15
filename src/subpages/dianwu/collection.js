/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { useTranslation, $t, i18n } from '@/i18n'
import { AtButton } from 'taro-ui'
import { SpPage, SpImage, SpPrice, SpInput as AtInput } from '@/components'
import './collection.scss'

function DianwuCollection(props) {
  useTranslation()

  useEffect(() => {
    const syncNavTitle = () => {
      Taro.setNavigationBarTitle({ title: $t('da843e7a.2eee29') })
    }
    syncNavTitle()
    i18n.on('languageChanged', syncNavTitle)
    return () => i18n.off('languageChanged', syncNavTitle)
  }, [])

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
        <View className='title'>{$t('da843e7a.ba5d3e')}</View>
        <View className='cash-amount'>
          <SpPrice size={50} value={1450} />
        </View>
        <View className='coll-form'>
          <View className='label'>{$t('da843e7a.ae617d')}</View>
          <View className='field-input'>
            <Text className='append'>¥</Text>
            <AtInput className='cash-value'></AtInput>
          </View>
          <View className='label'>
            {$t('da843e7a.7125e7')}
            <Text className='sub-txt'>{$t('da843e7a.d7bba4')}</Text>
          </View>
          <View className='field-change'>
            <Text className='append'>¥</Text>
            <View className='change-value'>13131313</View>
          </View>
        </View>
        <View className='btn-confirm-wrap'>
          <AtButton className='btn-confirm' circle>
            {$t('da843e7a.9c59c7')}
          </AtButton>
        </View>
        <View className='pending'>{$t('da843e7a.ee5b0a')}</View>
      </View>
    </SpPage>
  )
}

DianwuCollection.options = {
  addGlobalClass: true
}

export default DianwuCollection
