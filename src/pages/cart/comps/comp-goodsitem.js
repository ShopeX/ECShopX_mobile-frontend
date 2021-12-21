import React, { Component } from 'react';
import { View, Text, Image } from '@tarojs/components'
// import { AtInputNumber } from 'taro-ui'
import { SpPrice, SpInputNumber } from '@/components'
import InputNumber from '@/components/input-number'
import { isObject, classNames } from '@/utils'

import './comp-goodsitem.scss'

function CompGoodsItem(props) {
  const {
    info,
    onDelete = () => {},
    onChange = () => {},
    onClickImgAndTitle = () => {},
    isShowAddInput = true,
    children
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

  return (
    <View className='comp-goodsitem'>
      <View className='goods-item-hd' onClick={onClickImgAndTitle}>
        <Image className='goods-image' mode='aspectFill' src={info.pics} />
      </View>
      <View className='goods-item-bd'>
        <View className='item-hd'>
          <View className='goods-title'>{info.item_name}</View>
          <Text className='iconfont icon-shanchu-01' onClick={onDeleteGoodsItem}></Text>
        </View>
        {
          info.item_spec_desc &&
          <View className='item-bd'>
            <Text className='spec-desc'>{info.item_spec_desc}</Text>
          </View>
        }
        <View className='item-ft'>
          <SpPrice value={info.price / 100} />
          {isShowAddInput && <SpInputNumber value={info.num} onChange={onChangeGoodsItem}/>}
        </View>
      </View>
    </View>
  )
}

export default CompGoodsItem
