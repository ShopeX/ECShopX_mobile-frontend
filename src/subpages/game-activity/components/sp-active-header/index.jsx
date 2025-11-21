/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
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
