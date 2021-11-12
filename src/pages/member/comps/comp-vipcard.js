import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { styleNames } from '@/utils'

import './comp-vipcard.scss'

function CompsVipCard (props) {
  return (
    <View
      className='comp-vipcard'
      style={styleNames({
        'background-image': `url(${process.env.APP_IMAGE_CDN}/vip1.png)`
      })}
    >
      <View className='lf-con'>
        <View className='vip-title'>
          开通VIP会员<Text className='iconfont icon-qianwang-01'></Text>
        </View>
        <View className='vip-desc'>即刻享受最高1折会员优惠</View>
      </View>
      <View className='rg-con'>
        <View className='vip-xf'>
          续费<Text className='iconfont icon-qianwang-01'></Text>
        </View>
        <View className='xs-price'>限时特价</View>
      </View>
    </View>
  )
}

export default CompsVipCard
