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
import { View, Text } from '@tarojs/components'
import { SpImage } from '@/components'
import './index.scss'

const ActiveTotalControl = (props) => {
  const { point, cost_value } = props.userInfo || {}
  console.log(props)
  return (
    <View className='sp-active-control'>
      <View className='sp-active-control__title'>
        <Text>我的积分</Text>
        <Text className='sp-active-control__title-score'>{point || 0}</Text>
      </View>
      <SpImage
        className='sp-active-control__title-btn'
        src={`${process.env.APP_IMAGE_CDN}/fv_activity_get_more_btn.png`}
        mode='cover'
      />
      <View className='sp-active-control__desc'>
        <Text>每次抽奖消耗</Text>
        <Text style={{ marginLeft: '6rpx' }}>{cost_value}</Text>
        <Text>积分</Text>
      </View>
    </View>
  )
}

export default ActiveTotalControl
