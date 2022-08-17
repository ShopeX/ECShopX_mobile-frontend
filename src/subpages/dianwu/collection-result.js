import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { AtButton } from 'taro-ui'
import { View, Text } from '@tarojs/components'
import { SpPage, SpImage, SpCell, SpPrice, SpButton } from '@/components'
import './collection-result.scss'

function DianwuCollectionResult(props) {
  return (
    <SpPage
      className='page-dianwu-collection-result'
      renderFooter={
        <View className='btn-wrap'>
          <AtButton circle>返回工作台</AtButton>
        </View>
      }
    >
      <View className='result-hd'>
        <SpImage width={300} height={169} mode='aspectFit' />
        <View className='checkout-result'>
          <Text className='iconfont icon-correct'></Text>收款成功
        </View>
        <View className='user-info'>
          <Text className='name'>未知</Text>
          <Text className='mobile'>138****8888</Text>
        </View>
        <View className='vip'>
          等级：<Text className='vip-level'>白金会员</Text>
        </View>
      </View>
      <View className='block-goods'>
        <View className='label-title'>商品清单</View>
        <View className='goods-list'>
          {[1, 2, 3].map((item, index) => (
            <View className='goods-item-wrapper' key={`goods-item-wrapper__${index}`}>
              <View className='item-hd'>
                <View className='goods-name'>
                  显示完整商品名显示完整商品名显示完整商品名显示完整商品名显示完整商品名
                </View>
                <View className='num'>x 999</View>
              </View>
              <View className='sku'>规格：白色、XL、印花</View>
            </View>
          ))}
        </View>
        <View className='label-title'>赠品</View>
        <View className='gift-list'>
          {[1, 2].map((item, index) => (
            <View className='gift-item-wrapper' key={`gift-item-wrapper__${index}`}>
              <View className='item-hd'>
                <View className='goods-name'>
                  显示完整商品名显示完整商品名显示完整商品名显示完整商品名显示完整商品名
                </View>
                <View className='num'>x 999</View>
              </View>
              <View className='sku'>规格：白色、XL、印花</View>
            </View>
          ))}
        </View>
      </View>

      <View className='checkout-info'>
        <SpCell title='43件商品合计' border>
          <SpPrice value={2450}></SpPrice>
        </SpCell>
        <SpCell title='促销优惠' border>
          <SpPrice value={-500}></SpPrice>
        </SpCell>
        <SpCell title='会员折扣' border>
          <SpPrice value={-50}></SpPrice>
        </SpCell>
        <SpCell title='券优惠' border>
          <SpPrice value={-50}></SpPrice>
        </SpCell>
        <SpCell title='积分抵扣' border>
          <SpPrice value={-50}></SpPrice>
        </SpCell>
        <SpCell title='实收'>
          <SpPrice value={1450}></SpPrice>
        </SpCell>
      </View>

      <View className='extr-info'>
        <SpCell border title='收款门店' value='显示完整门店名称显示完整门店名称 (宜山路店)'></SpCell>
        <SpCell border title='操作人' value='张三'></SpCell>
        <SpCell border title='支付方式' value='微信支付'></SpCell>
        <SpCell border title='操作时间' value='2022.08.08 12:00:00'></SpCell>
        <SpCell
          title='备注'
          value='显示完整备注内容显示完整备注内容显示完整备注内容显示完整备注内容'
        ></SpCell>
      </View>
    </SpPage>
  )
}

DianwuCollectionResult.options = {
  addGlobalClass: true
}

export default DianwuCollectionResult
