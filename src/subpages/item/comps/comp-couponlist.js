/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { useTranslation, $t } from '@/i18n'
import './comp-couponlist.scss'

function CompCouponList(props) {
  useTranslation()
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
        {$t('50b5c4f8.563933')}
        <Text className='iconfont icon-qianwang-01'></Text>
      </View>
    </View>
  )
}

CompCouponList.options = {
  addGlobalClass: true
}

export default CompCouponList
