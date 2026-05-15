/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React from 'react'
import { View } from '@tarojs/components'
import { SpHtml } from '@/components'
import { useTranslation, $t } from '@/i18n'
import './index.scss'

const SpRuleLayout = ({ rules = '' }) => {
  useTranslation()
  return (
    <View className='sp-rule-layout'>
      <View className='sp-rule-layout__title'>{$t('58fc0feb.02a217')}</View>
      <View className='sp-rule-layout__content'>
        <SpHtml content={rules} />
      </View>
    </View>
  )
}

export default SpRuleLayout
