/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { View, Text } from '@tarojs/components'
import { SpImage } from '@/components'
import { useTranslation, $t } from '@/i18n'
import './index.scss'

const ActiveTotalControl = (props) => {
  useTranslation()
  const { point, cost_value } = props.userInfo || {}
  console.log(props)
  return (
    <View className='sp-active-control'>
      <View className='sp-active-control__title'>
        <Text>{$t('a6e0e06e.89438c')}</Text>
        <Text className='sp-active-control__title-score'>{point || 0}</Text>
      </View>
      <SpImage
        className='sp-active-control__title-btn'
        src={`${process.env.APP_IMAGE_CDN}/fv_activity_get_more_btn.png`}
        mode='cover'
      />
      <View className='sp-active-control__desc'>
        <Text>{$t('a6e0e06e.3b39a8')}</Text>
        <Text style={{ marginLeft: '6rpx' }}>{cost_value}</Text>
        <Text>{$t('a6e0e06e.9f68a8')}</Text>
      </View>
    </View>
  )
}

export default ActiveTotalControl
