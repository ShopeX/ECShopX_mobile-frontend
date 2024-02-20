import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpImage, SpPrice, SpTradeItem } from '@/components'
import tradeHooks from '../hooks'
import './comp-tradeitem.scss'

function CompTradeItem(props) {
  const { info } = props
  if (!info) {
    return null
  }
  const { tradeActionBtns, getTradeAction } = tradeHooks()
  const { distributorInfo, orderId, createDate, orderStatusMsg, items, orderStatus, totalFee } = info
  const btns = getTradeAction(info)
  btns.splice(btns.findIndex(btn => btn.key == 'pay'), 1)
  // 默认添加详情
  btns.push(tradeActionBtns.DETAIL)
  console.log('btns:', btns)

  const handleClickItem = ({ action }) => {
    action(info)
  }

  const totalNum = items.reduce((preVal, item) => preVal + item.num, 0)

  return (
    <View className='comp-tradeitem'>
      <View className='trade-item-hd'>
        <View>
          <View className='shop-info'>
            <SpImage src={distributorInfo?.logo} width={100} height={100} />
            <View className='shop-name'>{distributorInfo?.name}</View>
          </View>
          <View className='trade-no'>{`订单编号: ${orderId}`}</View>
          <View className='trade-time'>{`订单时间: ${createDate}`}</View>
        </View>
        <View className='trade-state'>{orderStatusMsg}</View>
      </View>
      <View className='trade-item-bd'>
        {items.map((good) => (
          <SpTradeItem info={good} />
        ))}

        <View className='trade-total'>
          <View className='delivery'></View>
          <View>
            <Text className='num'>{`共${totalNum}件`}</Text>
            <Text className='label'>实付金额</Text>
            <SpPrice value={totalFee} size={38} />
          </View>
        </View>
      </View>

      <View className='trade-item-ft'>
        {btns.map((item) => (
          <AtButton circle className={`btn-${item.btnStatus}`} onClick={handleClickItem.bind(this, item)}>{item.title}</AtButton>
        ))}
      </View>
    </View>
  )
}

CompTradeItem.options = {
  addGlobalClass: true
}

export default CompTradeItem
