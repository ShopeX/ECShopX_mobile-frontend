import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
// import { AtInputNumber } from 'taro-ui'
import { SpPrice, SpInputNumber } from '@/components'
import InputNumber from '@/components/input-number'
import { isObject, classNames } from '@/utils'

import './cart-goodsitem.scss'

function CartGoodsItem(props) {
  const { info, onDelete = () => {} } = this.props
  const onDeleteGoodsItem = () => {
    onDelete(info)
  }

  if (!info) {
    return null
  }

  return (
    <View className='cart-goods-item'>
      <View className='goods-item-hd'>
        <Image className='goods-image' mode='widthFix' src={info.pics} />
      </View>
      <View className='goods-item-bd'>
        <View className='item-hd'>
          <View className='goods-title'>{info.item_name}</View>
          <Text className='iconfont icon-shanchu-01' onClick={onDeleteGoodsItem}></Text>
        </View>
        <View className='item-bd'>
          <Text className='spec-desc'>{info.item_spec_desc}</Text>
        </View>
        <View className='item-ft'>
          <SpPrice value={info.price / 1000} />
          <SpInputNumber value={info.num} />
        </View>
      </View>
    </View>
  )
}

export default CartGoodsItem
