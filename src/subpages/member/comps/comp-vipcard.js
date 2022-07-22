import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { styleNames, classNames } from '@/utils'

import './comp-vipcard.scss'

function CompVipCard(props) {
  const { info, onLink, userInfo, memberConfig } = props
  console.log('vip-info==', info, userInfo, memberConfig)
  const { isVip, vipType, endTime } = info
  const { vipImg } = memberConfig
  const { user_card_code } = userInfo
  const notVip = (
    <View className='block normal-account'>
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
  const vip = (
    <View className='block-vip'>
      <View className='top-block'>
        <Text className='card-no'>NO.{user_card_code}</Text>
        <View className='vip-card'>
          VIP会员卡<Text className='iconfont icon-qianwang-01 icon'></Text>
        </View>
      </View>
      <View className='expire-time'>{endTime}到期</View>
    </View>
  )
  const renderBackgroundImage = () => {
    //背景图
    let background = vipImg ? `url(${vipImg})` : `url(${process.env.APP_IMAGE_CDN}/vip1.png)`
    if (isVip) {
      background = vipImg ? `url(${vipImg})` : `url(${process.env.APP_IMAGE_CDN}/vip2.png)`
    }
    return {
      background
    }
  }
  // const { background } = renderBackgroundImage()
  return (
    <View
      className={classNames('comp-vipcard', {
        // 'is-not-default': vipImg
      })}
      style={styleNames({
        'background-image': `url(${`${process.env.APP_IMAGE_CDN}/vip1.png`})`
      })}
      onClick={onLink}
    >
      {isVip ? vip : notVip}
    </View>
  )
}

export default CompVipCard
