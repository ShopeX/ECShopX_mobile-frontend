import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpImage, SpPrice, SpTradeItem } from '@/components'
import { VERSION_STANDARD } from '@/utils'
import tradeHooks from '../hooks'
import './comp-tradeitem.scss'

function CompTradeItem(props) {
  const { info, updateDelivery = () => {} } = props
  if (!info) {
    return null
  }
  const { tradeActionBtns, getTradeAction } = tradeHooks()
  const {
    distributorInfo,
    orderId,
    createDate,
    orderStatusMsg,
    items,
    orderStatus,
    totalFee,
    orderClass,
    point,
    distributorId,
    receiverMobile,
    receiverName,
    receiverState,
    receiverCity,
    receiverDistrict,
    receiverAddress,
    selfDeliveryFee,
    selfDeliveryStatus
  } = info
  const { pointName } = useSelector((state) => state.sys)

  const btns = getTradeAction(info)

  const handleClickItem = ({ key, action }) => {
    // if (key == 'evaluate' || key == 'logistics') {
    //   action(info)
    // } else {
    //   Taro.navigateTo({
    //     url: `/subpages/trade/detail?order_id=${orderId}`
    //   })
    // }
    if (key == 'update_delivery') {
      updateDelivery(info)
    } else {
      action(info)
    }
  }

  const onViewTradeDetail = () => {
    Taro.navigateTo({
      url: `/subpages/trade/detail?order_id=${orderId}`
    })
  }

  const onViewStorePage = (e) => {
    if (!VERSION_STANDARD) {
      e.stopPropagation()
      Taro.navigateTo({
        url: `/subpages/store/index?id=${distributorId}`
      })
    }
  }

  const totalNum = items.reduce((preVal, item) => preVal + item.num, 0)

  return (
    <View className='comp-tradeitem'>
      <View className='trade-item-hd' onClick={onViewTradeDetail}>
        <View>
          <View className='shop-info' onClick={onViewStorePage}>
            <SpImage src={distributorInfo?.logo} width={100} height={100} />
            <View className='shop-name'>
              {distributorInfo?.name}
              {!VERSION_STANDARD && <Text className='iconfont icon-qianwang-01'></Text>}
            </View>
          </View>
          <View className='trade-no'>{`订单编号: ${orderId}`}</View>
          <View className='trade-time'>{`订单时间: ${createDate}`}</View>
        </View>
        <View className='trade-state'>{orderStatusMsg}</View>
      </View>
      <View className='trade-item-bd' onClick={onViewTradeDetail}>
        {items.map((good, goodIndex) => (
          <SpTradeItem
            key={goodIndex}
            info={{
              ...good,
              orderClass
            }}
          />
        ))}

        <View className='trade-address'>
          <View className='distance'>
            <Text>收货信息：</Text>
            {/* <Text>距离2.5km</Text> */}
          </View>
          <View className='name'>
            <Text>{receiverName}</Text>
            <Text>{receiverMobile}</Text>
          </View>
          <View className='details'>
            {`${receiverState}${receiverCity}${receiverDistrict}${receiverAddress}`}
          </View>
        </View>

        <View className='trade-total'>
          {/* <View className='delivery'></View> */}
          <View className='delivery'>
            <Text>配送费</Text>
            <SpPrice value={selfDeliveryFee} size={38} />
          </View>
          {orderClass == 'pointsmall' && (
            <View>
              <Text className='num'>{`共${totalNum}件`}</Text>
              <Text className='label'>{pointName}</Text>
              <Text className='point-value' style='font-size: 20px;'>
                {point}
              </Text>
            </View>
          )}
          {orderClass == 'normal' && (
            <View>
              <Text className='num'>{`共${totalNum}件`}</Text>
              <Text className='label'>实付金额</Text>
              <SpPrice value={totalFee} size={38} />
            </View>
          )}
        </View>
      </View>

      <View className='trade-item-ft'>
        {btns.map((item, index) => (
          <AtButton
            key={index}
            circle
            className={`btn-${item.btnStatus}`}
            onClick={handleClickItem.bind(this, item)}
          >
            {item.title}
          </AtButton>
        ))}
      </View>
    </View>
  )
}

CompTradeItem.options = {
  addGlobalClass: true
}

export default CompTradeItem
