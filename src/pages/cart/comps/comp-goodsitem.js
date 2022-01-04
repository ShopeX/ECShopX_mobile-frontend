import React, { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
// import { AtInputNumber } from 'taro-ui'
import { SpPrice, SpInputNumber } from '@/components'
import InputNumber from '@/components/input-number'
import { isObject, classNames } from '@/utils'

import './comp-goodsitem.scss'

function CompGoodsItem (props) {
  const {
    info,
    onDelete = () => {},
    onChange = () => {},
    onClickImgAndTitle = () => {},
    isShowAddInput = true,
    children,
    isShowDeleteIcon = true,
    activity = []
  } = props
  const onDeleteGoodsItem = () => {
    onDelete(info)
  }

  const onChangeGoodsItem = (e) => {
    onChange(e)
  }

  if (!info) {
    return null
  }

  // const curPromotion = info.promotions && info.activity_id && info.promotions.find((p) => p.marketing_id === info.activity_id)
  // console.log(info, 'info.promotions')

  return (
    <View>
      {children}
      <View className='comp-goodsitem'>
        <View className='goods-item-hd' onClick={onClickImgAndTitle}>
          <Image className='goods-image' mode='aspectFill' src={info.pics} />
        </View>
        <View className='goods-item-bd'>
          <View className='item-hd'>
            <View className='goods-title'>
              {/* {info.activity_type == 'package' && <Text className='goods-title__tag'>组合商品</Text>} */}
              {info.is_plus_buy && <Text className='goods-title__tag'>换购</Text>}
              {info.item_name}
            </View>
            {isShowDeleteIcon && (
              <Text className='iconfont icon-shanchu-01' onClick={onDeleteGoodsItem}></Text>
            )}
          </View>
          {info.brief && <Text className='spec-brief'>{info.brief}</Text>}
          {info.item_spec_desc && (
            <View className='item-bd'>
              <Text className='spec-desc'>{info.item_spec_desc}</Text>
            </View>
          )}

          {/* {curPromotion && (
          )} */}
          <View className='goods-title__promotion'>
            {info.promotions &&
              info.promotions.map((item) => (
                <View className='goods-title__tag'>{item.promotion_tag}</View>
              ))}
            {/* <View className='titles'>{item.marketing_name}</View> */}
          </View>

          <View className='item-ft'>
            <SpPrice value={info.price / 100} />
            {isShowAddInput ? (
              <SpInputNumber value={info.num} onChange={onChangeGoodsItem} />
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
