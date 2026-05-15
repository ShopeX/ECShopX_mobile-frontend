/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { SpPage } from '@/components'
import * as dianwuApi from '@/api/dianwu'
import { showToast } from '@/utils'
import { useTranslation, $t, i18n } from '@/i18n'
import './activity-code.scss'

function ActivityCode(props) {
  useTranslation()

  useEffect(() => {
    const syncNavTitle = () => {
      Taro.setNavigationBarTitle({ title: $t('4846e603.af87cc') })
    }
    syncNavTitle()
    i18n.on('languageChanged', syncNavTitle)
    return () => i18n.off('languageChanged', syncNavTitle)
  }, [])

  const handleScanGoodsBN = async () => {
    const { errMsg, result } = await Taro.scanCode()
    console.log('handleScanCode:', result)
    if (errMsg == 'scanCode:ok') {
      Taro.showLoading({ title: '' })
      await dianwuApi.registrationVerify(JSON.parse(result))
      Taro.hideLoading()
      showToast($t('250b375e.065407'))
    } else {
      showToast(errMsg)
    }
  }

  return (
    <SpPage className='page-activity-code'>
      <View className='activity-code' onClick={handleScanGoodsBN}>
        <View className='iconfont icon-saoma activity-code__icon'></View>
        <View className='activity-code__text'>{$t('4846e603.af87cc')}</View>
      </View>
    </SpPage>
  )
}

ActivityCode.options = {
  addGlobalClass: true
}

export default ActivityCode
