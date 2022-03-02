import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpImage, SpPrice } from '@/components'
import './index.scss'

function SpGoodsCell (props) {
  const { info, onSelectSku } = props

  if (!info) {
    return null
  }

  const handleClick = () => {
    onSelectSku && onSelectSku(info)
  }

  return (
    <View className='sp-goods-cell'>
      <View className='goods-item-hd'>
        <SpImage src={info.img} width={170} height={170} />
      </View>
      <View className='goods-item-bd'>
        <View className='item-hd'>
          <View className='goods-title'>{info.itemName}</View>
        </View>
        <View className='item-bd'>
          {/* 多规格商品 */}
          {!info.nospec && (
            <View className='goods-sku' onClick={handleClick}>
              {onSelectSku && (
                <View className='spec-text'>
                  {info.specText || '选择规格'}
                  <Text className='iconfont icon-qianwang-01'></Text>
                </View>
              )}
              {!onSelectSku && info.itemSpecDesc}
            </View>
          )}
          {info.num && <Text className='item-num'>x {info.num}</Text>}
        </View>
        <View className='item-ft'>
          <SpPrice value={info.price}></SpPrice>
          <SpPrice className='market-price' lineThrough value={info.marketPrice}></SpPrice>
        </View>
      </View>
    </View>
  )
}

SpGoodsCell.options = {
  addGlobalClass: true
}

export default SpGoodsCell
