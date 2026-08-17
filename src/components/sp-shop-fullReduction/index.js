/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { View, Text } from '@tarojs/components'
import { classNames } from '@/utils'
import { SpImage } from '@/components'
import { useTranslation, ti } from '@/i18n'
import './index.scss'

function SpShopFullReduction(props) {
  useTranslation()
  const { info, status, count = 0, handeChange, showMoreIcon } = props
  const { promotion_tag, marketing_name } = info
  return (
    <View className={classNames('sp-shop-fullReduction')}>
      <View className='label-style'>{promotion_tag}</View>
      <Text className='text-style'>{marketing_name}</Text>
      {showMoreIcon && (
        <View className='pick-down' onClick={() => handeChange(!status)}>
          {ti('d00fb172.2ed17b', [count])}
          <SpImage
            src='down_icon.png'
            className={status ? 'down_icon translate' : 'down_icon'}
          />
        </View>
      )}
    </View>
  )
}

export default SpShopFullReduction
