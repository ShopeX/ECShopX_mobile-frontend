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
          <SpImage src={info.pic} width={140} height={140} />
        </View>
        <View className='item-bd-bd'>
          <View className='title'>
            {info.isPrescription == 1 && info.isMedicine && (
              <Text className='prescription-drug'>处方药</Text>
            )}
            {info.name}
          </View>
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
              {info.store && (
                <View className='kc'>
                  <Text className='label'>库存：</Text>
                  {info.store}
                </View>
              )}
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
