/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { SpPage, SpPrice, SpImage, SpPoint } from '@/components'
import { useTranslation, $t, ti } from '@/i18n'
import './index.scss'

function SpOrderItem(props) {
  useTranslation()
  const {
    showExtra = true,
    info = null,
    isPointitemGood = false,
    isPurchase = false,
    onClick = () => {},
    customFooter,
    showDesc,
    renderDesc,
    renderFooter
  } = props
  const { pointName } = useSelector((state) => state.sys)
  const { priceSetting } = useSelector((state) => state.sys)
  const { order_page } = priceSetting
  const { market_price: enMarketPrice } = order_page
  const { priceDisplayConfig = {} } = useSelector((state) => state.purchase)
  const { order_detail_page = {} } = priceDisplayConfig
  const { activity_price: enPurActivityPrice = true, sale_price: enPurSalePrice } = order_detail_page

  if (!info) return null

  const showExtraComp = () => {
    if (showExtra) {
      return (
        <View className='sp-order-item__extra'>
          <Text className='sp-order-item__desc'>{info.goods_props}</Text>
          {info.num && (
            <Text className='sp-order-item__num'>{ti('08059c3f.43ebc8', [info.num])}</Text>
          )}
          {info.item_spec_desc && (
            <Text className='sp-order-item__desc'>{info.item_spec_desc}</Text>
          )}
        </View>
      )
    }
  }

  const img = info.pic_path ? info.pic_path : Array.isArray(info.pics) ? info.pics[0] : info.pics

  console.log(123, isPurchase)

  return (
    <View className='sp-order-item' onClick={onClick}>
      <View className='sp-order-item__hd'>
        <SpImage src={img} mode='aspectFill' width={170} height={170} />
      </View>
      <View className='sp-order-item__bd'>
        <View className='sp-order-item__title'>
          {info.order_item_type === 'plus_buy' && (
            <Text className='sp-order-item__title-tag'>{$t('08059c3f.1687b1')}</Text>
          )}
          {info.order_item_type === 'gift' && (
            <Text className='sp-order-item__title-tag'>{$t('08059c3f.d017cc')}</Text>
          )}
          {info.isPrescription == 1 && (
            <Text className='prescription-drug'>{$t('08059c3f.e8b7e1')}</Text>
          )}
          {info.title}
        </View>
        {showDesc && info.item_spec_desc && (
          <Text className='sp-order-item__spec'>{info.item_spec_desc}</Text>
        )}
        {renderDesc}
        {showExtraComp()}
      </View>
      {customFooter ? (
        renderFooter
      ) : (
        <View className='sp-order-item__ft'>
          {isPointitemGood ? (
            <SpPrice
              className='sp-order-item__price'
              appendText={pointName}
              noSymbol
              noDecimal
              value={info.item_point || info.point}
            />
          ) : (
            <View>
              {isPurchase && (
                <View className='sp-order-item__pruchase'>
                  <View className='sp-order-item__pruchase-price'>
                    <Text className='sp-order-item__pruchase-price-label'>
                      {$t('08059c3f.3da735')}
                    </Text>
                    <SpPrice value={info.price}></SpPrice>
                  </View>
                  <View className='sp-order-item__pruchase-sprice'>¥{info.salePrice}</View>
                </View>
              )}
              {!isPurchase && (
                <SpPrice className='sp-order-item__price' value={info.price}></SpPrice>
              )}
              {/* {info.market_price > 0 && enMarketPrice && (
                <SpPrice lineThrough value={info.market_price}></SpPrice>
              )} */}
            </View>
          )}
        </View>
      )}
    </View>
  )
}

SpOrderItem.option = {
  addGlobalClass: true
}

export default SpOrderItem
