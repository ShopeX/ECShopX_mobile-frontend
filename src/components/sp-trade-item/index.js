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
          {orderClass == 'pointsmall' && <Text>{`${pointName}: ${itemPoint}`}</Text>}
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
