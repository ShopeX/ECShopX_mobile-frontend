/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro, { useState, memo } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { classNames } from '@/utils'
import { useTranslation, $t } from '@/i18n'
import './button.scss'

const Button = (props) => {
  useTranslation()
  const { onConfirm = () => {}, onReset = () => {} } = props

  return (
    <View className={classNames('filter-button')}>
      <View className='reset' onClick={onReset}>
        {$t('30dfeace.4b9c32')}
      </View>
      <View className='confirm' onClick={onConfirm}>
        {$t('30dfeace.c7995a')}
      </View>
    </View>
  )
}

export default memo(Button)
