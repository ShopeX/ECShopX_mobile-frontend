import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpPrice, SpPoint, SpVipLabel } from '@/components'
import { classNames } from '@/utils'
import './comp-goods-price.scss'

function SpGoodsPrice(props) {
  const { info } = props
  const { priceSetting } = useSelector((state) => state.sys)
  const { cart_page, item_page, order_page } = priceSetting
  const {
    market_price: enMarketPrice,
    member_price: enMemberPrice,
    svip_price: enSvipPrice
  } = item_page
  if (!info) {
    return null
  }
  const { price, memberPrice, marketPrice, activityPrice, vipPrice, svipPrice } = info
  return (
    <View className={classNames('comp-goods-price')}>
      {!isNaN(activityPrice) && (
        <View className='activity'>
          <SpPrice className='sale-price' value={price} />
          {/* <View className='activity-wrap'>
            活动价 <SpPrice className='activity-price' value={activityPrice} />
          </View> */}
        </View>
      )}
      {isNaN(activityPrice) && (
        <View>
          <View className='goods-price'>
            <SpPrice className='sale-price' value={price} />
          </View>
          <View>
            {info.memberPrice < info.price && enMemberPrice && (
              <View className='vip-price'>
                <SpPrice value={info.memberPrice} />
                <SpVipLabel content='会员价' type='member' />
              </View>
            )}

            {info.vipPrice > 0 &&
              info.vipPrice < info.price &&
              info.vipPrice > info.svipPrice &&
              !info.svipPrice &&
              enSvipPrice && (
                <View className='vip-price'>
                  <SpPrice value={info.vipPrice} />
                  <SpVipLabel content='VIP' type='vip' />
                </View>
              )}

            {info.svipPrice > 0 &&
              info.svipPrice < info.vipPrice &&
              info.svipPrice < info.price &&
              enSvipPrice && (
                <View className='svip-price'>
                  <SpPrice value={info.svipPrice} />
                  <SpVipLabel content='SVIP' type='svip' />
                </View>
              )}
          </View>
        </View>
      )}

      {/* {(!isNaN(memberPrice) || !isNaN(activityPrice)) && (
        <View className='discount'>
          <Text className='discount-txt'>{activityPrice ? '活动价' : '会员价'}</Text>
          <SpPrice className='discount-price' value={activityPrice ? activityPrice : memberPrice} />
        </View>
      )}
      {isNaN(memberPrice) && isNaN(activityPrice) && (
        <SpPrice className='market-price' lineThrough value={marketPrice} />
      )} */}
    </View>
  )
}

SpGoodsPrice.options = {
  addGlobalClass: true
}

export default SpGoodsPrice
