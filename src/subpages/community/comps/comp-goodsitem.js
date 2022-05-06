import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { SpImage, SpPrice } from '@/components'
import './comp-goodsitem.scss'

function CompGoodsItem(props) {
  const { info } = props
  if (!info) {
    return
  }

  const { pic, itemName, store, price } = info

  const handleClickGoodsDetail = () => {
    const { itemId, distributorId } = info
    Taro.navigateTo({
      url: `/subpages/community/espier-detail?id=${itemId}&dtid=${distributorId}`
    })
  }

  return (
    <View className='comp-goods-item'>
      <View className='item-hd' onClick={handleClickGoodsDetail}>
        <SpImage src={pic} width={160} height={160} />
      </View>
      <View className='item-bd'>
        <View className='goods-name'>{itemName}</View>
        <View className='goods-sku'>{`库存：${store}`}</View>
        <View className='goods-price'>
          <SpPrice primary value={price} />
        </View>
      </View>
    </View>
  )
}

CompGoodsItem.options = {
  addGlobalClass: true
}

export default CompGoodsItem
