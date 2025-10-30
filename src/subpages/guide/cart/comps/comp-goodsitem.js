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
import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import { SpPrice, SpInputNumber, SpImage } from '@/components'

import './comp-goodsitem.scss'

function CompGoodsItem(props) {
  const {
    info,
    children,
    isShowAddInput = true,
    isShowDeleteIcon = true,
    onDelete = () => {},
    onChange = () => {},
    onClickImgAndTitle = () => {}
  } = props

  if (!info) {
    return null
  }

  return (
    <View>
      {children}
      <View className='comp-goodsitem'>
        <View className='comp-goodsitem-hd' onClick={onClickImgAndTitle}>
          <SpImage className='comp-goodsitem-image' mode='aspectFill' src={info.pics} />
        </View>
        <View className='comp-goodsitem-bd'>
          <View className='item-hd'>
            <View className='goods-title'>
              {/* {info.activity_type == 'package' && <Text className='goods-title__tag'>组合商品</Text>} */}
              {info.is_plus_buy && <Text className='goods-title__tag'>加价购</Text>}
              {info.item_name}
            </View>
            {isShowDeleteIcon && (
              <Text className='iconfont icon-shanchu-01' onClick={() => onDelete(info)}></Text>
            )}
          </View>

          {info.brief && <Text className='spec-brief'>{info.brief}</Text>}

          {info.item_spec_desc && (
            <View className='item-bd'>
              <Text className='spec-desc'>{info.item_spec_desc}</Text>
            </View>
          )}

          {info.promotions && (
            <View className='goods-title__promotion'>
              {info.promotions.map((item) => (
                <View className='goods-title__tag'>{item.promotion_tag}</View>
              ))}
            </View>
          )}

          <View className='item-ft'>
            <SpPrice value={info.price / 100} />
            {isShowAddInput ? (
              <SpInputNumber
                value={info.num}
                max={info.store}
                min={1}
                onChange={(e) => onChange(e)}
              />
            ) : (
              <Text className='item-num'>x {info.num}</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  )
}

export default CompGoodsItem
