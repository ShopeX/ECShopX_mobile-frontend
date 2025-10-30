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
import { SpPrice, SpPoint, SpVipLabel } from '@/components'
import { classNames } from '@/utils'
import { useLogin } from '@/hooks'
import './index.scss'

function SpGoodsPrice(props) {
  const { info, isPurchase = false } = props
  const { priceSetting } = useSelector((state) => state.sys)
  const { cart_page, item_page, order_page } = priceSetting
  const {
    market_price: enMarketPrice,
    member_price: enMemberPrice,
    svip_price: enSvipPrice
  } = item_page
  const { priceDisplayConfig = {} } = useSelector((state) => state.purchase)
  const { isLogin } = useLogin()
  const { items_page = {} } = priceDisplayConfig
  const { activity_price: enPurActivityPrice, sale_price: enPurSalePrice } = items_page

  if (!info) {
    return null
  }
  const { price, memberPrice, marketPrice, activityPrice, vipPrice, svipPrice, isPoint, point } =
    info

  return (
    <View className={classNames('sp-goods-price')}>
      {!isNaN(activityPrice) && (
        <View className='activity'>
          <SpPrice size={30} className='sale-price' value={price} />
          {/* 内购 && !enPurActivityPrice 不展示,其他情况都展示 */}
          {!(isPurchase && !enPurActivityPrice) && (
            <View className='activity-wrap'>
              <Text className='activity-label'>活动价¥{activityPrice.toFixed(2)}</Text>
              {/* <SpPrice size={36} className='activity-price' value={activityPrice} /> */}
            </View>
          )}
        </View>
      )}
      {isNaN(activityPrice) && (
        <View>
          <View className='goods-price'>
            {isPoint && price == 0 && <SpPoint className='sale-point' value={point} />}
            {isPoint && price > 0 && (
              <View>
                <SpPoint className='sale-point' value={point} />
                <Text className='point-plus-price'>+</Text>
                <SpPrice size={42} className='sale-price' value={price} />
              </View>
            )}
            {!isPoint && <SpPrice size={42} className='sale-price' value={price} />}
            {marketPrice > 0 && enMarketPrice && (
              <SpPrice className='mkt-price' lineThrough value={marketPrice} />
            )}
          </View>
          <View>
            {info.memberPrice < info.price && enMemberPrice && isLogin && (
              <View className='vip-price'>
                <SpPrice value={info.memberPrice} />
                <SpVipLabel content='会员价' type='member' />
              </View>
            )}

            {info.vipPrice > 0 &&
              isLogin &&
              info.vipPrice < info.memberPrice &&
              (!info.svipPrice || info.vipPrice > info.svipPrice) &&
              enSvipPrice && (
                <View className='vip-price'>
                  <SpPrice value={info.vipPrice} />
                  <SpVipLabel content='VIP' type='vip' />
                </View>
              )}

            {info.svipPrice > 0 &&
              isLogin &&
              info.svipPrice < info.vipPrice &&
              info.svipPrice < info.memberPrice &&
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
