import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpImage, SpPrice } from '@/components'
import { GOODS_TYPE } from '@/consts'
import './index.scss'

function SpGoodsCell(props) {
  const { info, onSelectSku } = props
  const { vipInfo = {} } = useSelector((state) => state.user)
  if (!info) {
    return null
  }

  const handleClick = () => {
    onSelectSku && onSelectSku(info)
  }

  const { price, activityPrice, memberPrice, packagePrice } = info
  let _price
  if (!isNaN(activityPrice)) {
    _price = activityPrice
  } else if (!isNaN(packagePrice)) {
    _price = packagePrice
  } else if (!isNaN(memberPrice)) {
    _price = memberPrice
  } else {
    _price = price
  }
  return (
    <View className='sp-goods-cell'>
      <View className='goods-item-hd'>
        <SpImage mode='aspectFit' src={info.img} width={180} height={180} />
      </View>
      <View className='goods-item-bd'>
        <View className='item-hd'>
          <View className='goods-title'>{info.itemName}</View>
        </View>
        <View className='item-bd'>
          <View>
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
          </View>
        </View>
        <View className='labels-block'>
          {/* {info.discount_info?.map((sp, idx) => (
            <View className='goods-type' key={`goods-type__${idx}`}>
              {userInfo?.gradeInfo?.grade_name}
            </View>
          ))} */}
          {!isNaN(memberPrice) && (
            <View className='goods-type'>{vipInfo?.grade_name}</View>
          )}
          {info.orderItemType != 'normal' && (
            <View className='goods-type'>{GOODS_TYPE[info.orderItemType]}</View>
          )}
        </View>
        <View className='item-ft'>
          <View className='price-gp'>
            <SpPrice value={_price}></SpPrice>
            {info.marketPrice > 0 && (
              <SpPrice
                className='market-price'
                size={28}
                lineThrough
                value={info.marketPrice}
              ></SpPrice>
            )}
          </View>

          {info.num && <Text className='item-num'>x {info.num}</Text>}
        </View>
      </View>
    </View>
  )
}

SpGoodsCell.options = {
  addGlobalClass: true
}

export default SpGoodsCell
