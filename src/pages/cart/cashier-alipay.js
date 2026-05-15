/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpPrice, SpCell } from '@/components'
import { useTranslation, $t } from '@/i18n'
import './cashier-alipay.scss'

function CashierAlipay(props) {
  useTranslation()
  const handlePay = () => {
    window.location.href = 'https://wxaurl.cn/M0qyMy2ArXo'
  }
  return (
    <View className='cashier-alipay'>
      <View className='cashier-hd'>
        <Text className='iconfont icon-zhifubao'></Text>
        <Text className='title'>{$t('ba44cd64.f24b4a')}</Text>
      </View>
      <View className='pay-price'>
        <SpPrice value={100} size={60} />
      </View>
      <View className='trade-info'>
        <SpCell title={$t('ba44cd64.2240cc')} value='2022-06-01 12:00:00' />
        <SpCell title={$t('ba44cd64.1e8dc2')} value='876545678909876' />
      </View>
      <View className='btn-wrap'>
        <AtButton onClick={handlePay}>{$t('ba44cd64.747349')}</AtButton>
      </View>
    </View>
  )
}

CashierAlipay.options = {
  addGlobalClass: true
}

export default CashierAlipay
