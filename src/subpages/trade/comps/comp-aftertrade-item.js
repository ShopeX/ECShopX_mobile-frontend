import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpImage, SpPrice, SpTradeItem } from '@/components'
import { VERSION_STANDARD } from '@/utils'
import { AFTER_SALE_STATUS } from '@/consts'
import './comp-aftertrade-item.scss'

function CompTradeItem(props) {
  const { info } = props
  if (!info) {
    return null
  }
  const { aftersalesBn, distributorInfo, orderId, createdTime, aftersalesStatus, items, orderStatus, refundFee, orderClass = 'normal', point, distributorId ,freight} = info
  // const { pointName } = useSelector((state) => state.sys)


  const onViewTradeDetail = () => {
    Taro.navigateTo({
      url: `/subpages/trade/after-sale-detail?aftersales_bn=${aftersalesBn}`
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

  const totalPrice = Number(refundFee) + Number(freight)

  return (
    <View className='comp-tradeitem'>
      <View className='trade-item-hd' onClick={onViewTradeDetail}>
        <View>
          {/* <View className='shop-info' onClick={onViewStorePage}>
            <SpImage src={distributorInfo?.logo} width={100} height={100} />
            <View className='shop-name'>{distributorInfo?.name}{!VERSION_STANDARD && <Text className='iconfont icon-qianwang-01'></Text>}</View>
          </View> */}
          <View className='trade-no'>{`退款单号: ${aftersalesBn}`}</View>
          <View className='trade-time'>{`申请时间: ${createdTime}`}</View>
        </View>
        <View className='trade-state'>{AFTER_SALE_STATUS[aftersalesStatus]}</View>
      </View>
      <View className='trade-item-bd' onClick={onViewTradeDetail}>
        {items.map((good) => (
          <SpTradeItem info={{
            ...good,
          }} />
        ))}

        <View className='trade-total'>
          <View className='delivery'></View>
          {/* {
            orderClass == 'pointsmall' && <View>
              <Text className='num'>{`共${totalNum}件`}</Text>
              <Text className='label'>{pointName}</Text>
              <Text className='point-value' style="font-size: 20px;">{point}</Text>
            </View>
          } */}
          {
            orderClass == 'normal' && <View>
              <Text className='num'>{`共${totalNum}件`}</Text>
              <Text className='label'>退款金额</Text>
              <SpPrice value={totalPrice} size={38} />
            </View>
          }
        </View>
      </View>

      <View className='trade-item-ft'>

      </View>
    </View>
  )
}

CompTradeItem.options = {
  addGlobalClass: true
}

export default CompTradeItem
