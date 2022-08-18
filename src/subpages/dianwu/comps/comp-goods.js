import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { AtButton } from 'taro-ui'
import { View, Text } from '@tarojs/components'
import { SpImage, SpPrice, SpVipLabel } from '@/components'
import { classNames } from '@/utils'
import CompGoodsPrice from './comp-goods-price'
import './comp-goods.scss'

function CompGoods(props) {
  const { children, info } = props
  if (!info) {
    return null
  }

  return (
    <View className='comp-goods'>
      <View className='item-bd'>
        <View className='item-bd-hd'>
          <SpImage src={info.pic} width={110} height={110} />
        </View>
        <View className='item-bd-bd'>
          <View className='title'>{info.name}</View>
          {info.itemSpecDesc && <View className='sku'>{info.itemSpecDesc}</View>}
          {/* <View className='price-list'>
            <SpPrice className='sale-price' value={999.99}></SpPrice>
            <View className='price-wrap'>
              <SpPrice className='vip-price' value={888.99}></SpPrice>
              <SpVipLabel content='VIP' type='vip' />
            </View>
            <View className='price-wrap'>
              <SpPrice className='svip-price' value={666.99}></SpPrice>
              <SpVipLabel content='SVIP' type='svip' />
            </View>
          </View> */}
          <CompGoodsPrice info={info} />
          <View className='goods-info'>
            <View className='kc-bn'>
              <View className='kc'>
                <Text className='label'>库存：</Text>
                {info.store}
              </View>
              {info.barcode && (
                <View className='bn'>
                  <Text className='label'>条码：</Text>
                  {info.barcode}
                </View>
              )}
            </View>
            <View className='btn-actions'>{children}</View>
            {/* <AtButton circle className={classNames({ 'active': true })}>
              <Text className='iconfont icon-plus'></Text>
            </AtButton> */}
            {/* <AtButton circle disabled>
            缺货
          </AtButton> */}
          </View>
        </View>
      </View>
      <View className='item-ft'></View>
    </View>
  )
}

CompGoods.options = {
  addGlobalClass: true
}

export default CompGoods
