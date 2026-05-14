/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { View, Image } from '@tarojs/components'
import { memo } from '@tarojs/taro'

import { useTranslation, $t } from '@/i18n'
import './index.scss'

const SpNoShop = (props) => {
  useTranslation()
  const tips = props.tips || $t('09c0813c.d17ff7')

  return (
    <View className='noshop'>
      <View className='noShopContent'>
        <Image
          mode='widthFix'
          className='noShop'
          src={`${process.env.APP_IMAGE_CDN}/empty_data.png`}
        ></Image>
        <View className='tips'>{tips}</View>
      </View>
    </View>
  )
}

export default memo(SpNoShop)
