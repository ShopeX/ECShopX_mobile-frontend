/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { View, Text } from '@tarojs/components'
import React from 'react'
import { classNames } from '@/utils'
import { useTranslation, $t, ti } from '@/i18n'
import './index.scss'

function SpShopCoupon(props) {
  useTranslation()
  const { className, info, fromStoreIndex = false, onClick = () => {} } = props
  const { card_type, discount, least_cost, title } = info
  let couponText = ''
  // 折扣券
  if (card_type == 'discount') {
    couponText = ti('bfc5ccea.2fb189', [(100 - info.discount) / 10])
  } else if (card_type == 'cash') {
    // 满减券
    couponText = `${info.reduce_cost / 100}${$t('c63b7c0f.c16655')}`
  }

  return (
    <View
      className={classNames(
        'sp-shop-coupon',
        {
          active: false
        },
        className
      )}
      onClick={onClick}
    >
      <View className='coupon-wrap'>
        <Text className='coupon-text'>{fromStoreIndex ? title : couponText}</Text>
        {!fromStoreIndex && (
          <Text className='coupon-status'>
            {info.receive == 1 ? $t('16739fc3.289794') : $t('16739fc3.9c1b27')}
          </Text>
        )}
      </View>
    </View>
  )
}

SpShopCoupon.options = {
  addGlobalClass: true
}

export default SpShopCoupon
