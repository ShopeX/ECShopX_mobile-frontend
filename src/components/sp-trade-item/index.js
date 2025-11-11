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
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpImage, SpPrice } from '@/components'
import './index.scss'

function SpTradeItem(props) {
  const { info, onClick = () => {} } = props
  if (!info) return null
  const {
    pic,
    itemName,
    itemPoint,
    price,
    itemSpecDesc,
    num,
    orderClass = 'normal',
    isPrescription
  } = info
  const { pointName } = useSelector((state) => state.sys)

  const onClickItem = () => {
    onClick(info)
  }

  return (
    <View className='sp-trade-item' onClick={onClickItem}>
      <View className='tradeitem-hd'>
        <SpImage src={pic} width={130} />
      </View>
      <View className='tradeitem-bd'>
        <View className='goods-info-hd'>
          <View className='name'>
            {isPrescription == 1 && <Text className='prescription-drug'>处方药</Text>}
            {itemName}
          </View>
          {orderClass == 'pointsmall' && (
            <Text style={{ display: 'flex', justifyContent: 'flex-end', width: '150rpx' }}>
              {`${pointName}: ${itemPoint}`}{' '}
              {price > 0 ? (
                <Text>
                  +<SpPrice value={price} />
                </Text>
              ) : null}
            </Text>
          )}
          {orderClass == 'normal' && <SpPrice value={price} />}
        </View>
        <View className='goods-info-bd'>
          <Text className='spec-desc'>{itemSpecDesc}</Text>
          <Text className='num'>{`x ${num}`}</Text>
        </View>
      </View>
    </View>
  )
}

SpTradeItem.options = {
  addGlobalClass: true
}

export default SpTradeItem
