/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { styleNames, classNames } from '@/utils'
import { useTranslation, $t, ti } from '@/i18n'
import './comp-vipcard.scss'

function CompVipCard(props) {
  useTranslation()
  const { info, onLink, userInfo, memberConfig } = props
  console.log('vip-info==', info, userInfo, memberConfig)
  const { isVip, vipType, endTime } = info
  const { vipImg } = memberConfig
  const { user_card_code } = userInfo
  const notVip = (
    <View className='block normal-account'>
      <View className='lf-con'>
        <View className='vip-title'>
          {$t('9fc03a5c.615f4f')}
          <Text className='iconfont icon-qianwang-01'></Text>
        </View>
        <View className='vip-desc'>{$t('9fc03a5c.1e9f41')}</View>
      </View>
      <View className='rg-con'>
        <View className='vip-xf'>
          {$t('9fc03a5c.5f92b4')}
          <Text className='iconfont icon-qianwang-01'></Text>
        </View>
        <View className='xs-price'>{$t('9fc03a5c.3b4502')}</View>
      </View>
    </View>
  )
  const vip = (
    <View className='block-vip'>
      <View className='top-block'>
        <Text className='card-no'>NO.{user_card_code}</Text>
        <View className='vip-card'>
          {$t('9fc03a5c.64f674')}
          <Text className='iconfont icon-qianwang-01 icon'></Text>
        </View>
      </View>
      <View className='expire-time'>{ti('9fc03a5c.b83126', [endTime])}</View>
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
