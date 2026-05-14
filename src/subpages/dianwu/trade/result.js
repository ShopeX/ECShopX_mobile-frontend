/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpPage, SpImage } from '@/components'
import { useTranslation, $t, i18n } from '@/i18n'
import { useNavigation } from '@/hooks'
import './result.scss'

const RESULT_TIP_KEYS = {
  '1': { title: '0ac5128b.5af500', desc: null },
  '2': { title: '0ac5128b.5af500', desc: '0ac5128b.083338' },
  '3': { title: '0ac5128b.913abc', desc: '0ac5128b.083338' },
  '4': { title: '0ac5128b.913abc', desc: '0ac5128b.486bd9' },
  '5': { title: '0ac5128b.913abc', desc: '0ac5128b.083338' }
}

function DianwuTradeResult(props) {
  useTranslation()
  const { setNavigationBarTitle } = useNavigation()
  const $instance = getCurrentInstance() || {}
  const { type = '1' } = $instance?.router?.params || {}

  useEffect(() => {
    const syncTitle = () => setNavigationBarTitle($t('a77adc81.a518ff'))
    syncTitle()
    i18n.on('languageChanged', syncTitle)
    return () => i18n.off('languageChanged', syncTitle)
  }, [setNavigationBarTitle])

  const conf = RESULT_TIP_KEYS[type] || RESULT_TIP_KEYS['1']
  const title = $t(conf.title)
  const desc = conf.desc ? $t(conf.desc) : ''

  return (
    <SpPage className='page-dianwu-trade-result'>
      <SpImage src='success.png' width={181} height={180} />
      <View className='title'>{title}</View>
      <View className='desc'>{desc}</View>

      <AtButton
        className='btn-return'
        circle
        onClick={() => {
          Taro.navigateBack()
        }}
      >
        {$t('0ac5128b.d5c47e')}
      </AtButton>
    </SpPage>
  )
}

DianwuTradeResult.options = {
  addGlobalClass: true
}

export default DianwuTradeResult
