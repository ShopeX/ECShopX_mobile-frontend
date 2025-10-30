// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { SpPrice, SpLogin } from '@/components'
import './comp-couponlist.scss'

function CompCouponList(props) {
  const { info, onClick = () => {} } = props
  console.log(info)
  const onChangeLogin = () => {
    Taro.navigateTo({
      url: `/subpage/pages/vip/vipgrades?grade_name=${info.vipgrade_name}`
    })
  }

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
        领券<Text className='iconfont icon-qianwang-01'></Text>
      </View>
    </View>
  )
}

CompCouponList.options = {
  addGlobalClass: true
}

export default CompCouponList
