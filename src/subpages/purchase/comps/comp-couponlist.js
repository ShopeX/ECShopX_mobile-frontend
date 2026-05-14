/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { useTranslation, $t } from '@/i18n'
import './comp-couponlist.scss'

function CompCouponList(props) {
  useTranslation()
  const { info = [], onClick = () => {} } = props
  console.log(info)

  if (info.length == 0) {
    return null
  }

  return (
    <View className='comp-couponlist'>
      <View className='couponlist-hd'>
        <ScrollView className='coupons-block' scrollX>
          {info.map((item, index) => (
            <View className='coupon-item' key={`coupon-item__${index}`}>
              {item.title}
            </View>
          ))}
        </ScrollView>
      </View>
      <View className='couponlist-ft' onClick={onClick}>
        {$t('a9c98bdd.563933')}
        <Text className='iconfont icon-qianwang-01'></Text>
      </View>
    </View>
  )
}

CompCouponList.options = {
  addGlobalClass: true
}

export default CompCouponList
