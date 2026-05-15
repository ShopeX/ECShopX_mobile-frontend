/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import Taro from '@tarojs/taro'
import { AtButton } from 'taro-ui'
import { View, Text } from '@tarojs/components'
import { SpPage } from '@/components'
import { useTranslation, $t, i18n } from '@/i18n'
import { useNavigation } from '@/hooks'
import './evaluate-success.scss'

function EvaluateSuccess(props) {
  useTranslation()
  const { setNavigationBarTitle } = useNavigation()

  useEffect(() => {
    const syncTitle = () => setNavigationBarTitle($t('5093d6d0.606120'))
    syncTitle()
    i18n.on('languageChanged', syncTitle)
    return () => i18n.off('languageChanged', syncTitle)
  }, [setNavigationBarTitle])

  return (
    <SpPage className='page-evaluate-success'>
      <View className='evaluate-result'>
        <Text className='iconfont icon-roundcheckfill'></Text>
        <Text className='evaluate-txt'>{$t('7bacdf29.b67e3a')}</Text>
      </View>

      <View className='btn-block'>
        <View className='btn-wrap'>
          <AtButton
            circle
            onClick={() => {
              Taro.redirectTo({ url: '/pages/index' })
            }}
          >
            {$t('7bacdf29.5a1367')}
          </AtButton>
        </View>
      </View>
    </SpPage>
  )
}

EvaluateSuccess.options = {
  addGlobalClass: true
}

export default EvaluateSuccess
