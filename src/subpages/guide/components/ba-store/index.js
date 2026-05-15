/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React from 'react'
import { useSelector } from 'react-redux'
import { View } from '@tarojs/components'
import { SpImage } from '@/components'
import { useTranslation, $t } from '@/i18n'
import './index.scss'

function BaStore(props) {
  useTranslation()
  const {
    guideInfo = {
      avatar: null,
      salesperson_name: null
    }
  } = props

  const { storeInfo } = useSelector((state) => state.guide)

  return (
    <View className='ba-store'>
      <SpImage className='ba-avatar' src={guideInfo?.avatar || 'user_icon.png'} />
      <View className='ba-store-bd'>
        <View className='guide-name'>{guideInfo.salesperson_name || $t('794b92c4.1622dc')}</View>
        {storeInfo && <View className='store-name'>{storeInfo.store_name}</View>}
      </View>
    </View>
  )
}

BaStore.options = {
  addGlobalClass: true
}

export default BaStore
