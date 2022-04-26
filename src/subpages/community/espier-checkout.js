import React, { Component, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpPage, SpImage, SpPrice } from '@/components'
import { AtInput } from 'taro-ui'
import qs from 'qs'
import { log } from '@/utils'
import api from '@/api'
import CompGoodsItemBuy from './comps/comp-goodsitembuy'

import './espier-checkout.scss'

const EspierCheckout = () => {
  const $instance = getCurrentInstance()
  const { activity_id, items } = $instance.router.params
  const { chiefInfo, checkIsChief } = useSelector((state) => state.user)
  console.log('chiefInfo:', chiefInfo)
  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    const goodsItems = JSON.parse(decodeURIComponent(items))
    const params = {
      order_type: 'normal_community',
      community_activity_id: activity_id,
      items: goodsItems
    }
    await api.cart.total(params)
  }

  const renderFooter = () => {
    return (
      <View className='espierCheckout-toolbar'>
        <View className='espierCheckout-toolbar__price'>
          实际支付：
          <SpPrice value={990} noDecimal />
        </View>

        <View className='espierCheckout-toolbar__button'>立即支付</View>
      </View>
    )
  }

  return (
    <SpPage className='page-community-index' renderFooter={renderFooter()}>
      <View className='espierCheckout'>
        <View className='espierCheckout-header'>
          <View className='espierCheckout-header__explain'>配送说明</View>
          <View>限制指定配送区域</View>
        </View>

        <View className='espierCheckout-address'>
          <View className='espierCheckout-address__title'>
            团长还希望你完成以下信息
            <Text className='espierCheckout-address__title-text'>（必填）</Text>
          </View>

          <View className='espierCheckout-address__info'>
            <View className='espierCheckout-address__info-name'>
              <Text>孙旭</Text>
              131221080999
            </View>
            <View>上海市徐汇区宜山路700号</View>
          </View>
        </View>

        <View className='espierCheckout-goods'>
          {/* <GoodsItem />
          <GoodsItem /> */}
          {<CompGoodsItemBuy />}
        </View>

        <View className='espierCheckout-total'>
          <View className='espierCheckout-total__price'>
            <View className='espierCheckout-total__title'>商品总价</View>

            <SpPrice value={990} noDecimal />
          </View>

          <View className='espierCheckout-total__payPrice'>
            <Text className='espierCheckout-total__payPrice-num'>共10件</Text>
            实际支付
            <SpPrice value={990} noDecimal />
          </View>
        </View>

        <View className='espierCheckout-remarks'>
          <AtInput
            name='value'
            title='备注'
            type='text'
            placeholder='请输入您需要备注的内容'
            border={false}
          />
        </View>
      </View>
    </SpPage>
  )
}

export default EspierCheckout
