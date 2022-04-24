import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { SpPage, SpImage, SpPrice } from '@/components'
import qs from 'qs'
import { log } from '@/utils'
import WpGoodsItem from './comps/wp-goods-item'

import './wait-pay.scss'

const WaitPay = () => {
  const renderFooter = () => {
    return (
      <View className='waitPay-toolbar'>
        <SpPrice value={0.01} />

        <View className='espierCheckout-toolbar__button'>立即支付</View>
      </View>
    )
  }

  return (
    <SpPage className='page-community-index' renderFooter={renderFooter()}>
      <View className='waitPay'>
        <View className='waitPay-header'>
          <View className='waitPay-header__info'>
            <View className='waitPay-header__info-title'>待支付</View>
            <View className='waitPay-header__info-time'>
              请在<Text>00:01:10</Text>内完成支付
            </View>
          </View>

          <View className='waitPay-header__img'>
            <SpImage />
          </View>
        </View>

        <View className='waitPay-title'>顾客自提</View>
        <View className='waitPay-address'>
          <View className='waitPay-address__info'>
            <View className='waitPay-address__info-strong'>
              <Text className='iconfont icon iconfont icon-member'></Text>
              自提点：新开家园
            </View>
            <View className='waitPay-address__info-position'>古楼公路1858</View>
          </View>

          <View className='waitPay-address__user'>
            <View>
              <Text className='iconfont icon iconfont icon-member'></Text>
              <Text className='waitPay-address__user-name'>孙旭</Text>
              13122102222
            </View>
            <View className='waitPay-address__user-li'>上海市松江区泗泾镇古楼公路1858</View>
            <View className='waitPay-address__user-li'>楼号（如10）：10</View>
            <View className='waitPay-address__user-li'>房号（如606）：606</View>
            <View className='waitPay-address__user-li'>多少弄：11</View>
          </View>

          <View className='waitPay-address__remarks'>
            <Text className='iconfont icon iconfont icon-member'></Text>
            团员备注：无备注
          </View>
        </View>

        <View className='waitPay-title'>
          <View className='waitPay-title__l'>
            <View className='waitPay-title__img'>
              <SpImage />
            </View>
            <View>Kris</View>
          </View>

          <View className='waitPay-title__r'>
            测试团购，请不要嘻嘻嘻嘻嘻嘻嘻嘻
            <View className='at-icon at-icon-chevron-right'></View>
          </View>
        </View>
        <View className='waitPay-goods'>
          <WpGoodsItem />
          <WpGoodsItem />

          <View className='waitPay-goods__price'>
            <View>商品金额</View>
            <SpPrice value={0.02} />
          </View>
        </View>

        <View className='waitPay-total'>
          <Text className='waitPay-total__num'>共10件</Text>
          实际支付：
          <SpPrice value={0.02} />
        </View>

        <View className='waitPay-title'>订单信息</View>
        <View className='waitPay-order'>
          <View className='waitPay-order__item'>
            <View className='waitPay-order__item-label'>下单人：</View>
            <View className='waitPay-order__item-avatar'>
              <SpImage />
            </View>
            <View className='waitPay-order__item-name'>vip</View>
            <View className='waitPay-order__item-avatar'>
              <SpImage />
            </View>
            <View className='waitPay-order__item-btn'>
              <Text className='iconfont icon iconfont icon-member'></Text>
              刷新昵称头像
            </View>
          </View>
          <View className='waitPay-order__item'>
            <View className='waitPay-order__item-label'>订单编号：</View>
            1321321312321321
            <View className='waitPay-order__item-btn'>复制</View>
          </View>
          <View className='waitPay-order__item'>
            <View className='waitPay-order__item-label'>支付时间：</View>
            2022/4/22 13:12
          </View>
        </View>

        <View className='waitPay-close'>关闭订单</View>
      </View>
    </SpPage>
  )
}

export default WaitPay
