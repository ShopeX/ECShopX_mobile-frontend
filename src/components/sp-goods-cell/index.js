/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpImage, SpPrice, SpPoint } from '@/components'
import { GOODS_TYPE } from '@/consts'
import { VERSION_IN_PURCHASE } from '@/utils'
import { $t, ti } from '@/i18n'
import './index.scss'

const ORDER_ITEM_TYPE_KEY = {
  normal: 'f3788e40.0f7a66',
  gift: '36c99ee5.d017cc',
  plus_buy: 'f9ef9536.1687b1',
  package: '7d82f6d2.159f49'
}

function SpGoodsCell(props) {
  const { info, isPurchase = false, onSelectSku } = props
  const { userInfo = {}, vipInfo = {} } = useSelector((state) => state.user)
  const { priceDisplayConfig = {} } = useSelector((state) => state.purchase)
  const { checkout_page = {} } = priceDisplayConfig
  const { activity_price: enPurActivityPrice, sale_price: enPurSalePrice } = checkout_page
  if (!info) {
    return null
  }

  const handleClick = () => {
    onSelectSku && onSelectSku(info)
  }

  const { price, activityPrice, memberPrice, packagePrice, curItem, point, isPoint, cusActivity } =
    info
  let _price = 0
  let t_price, t_activityPrice, t_memberPrice, t_packagePrice
  if (curItem) {
    t_price = curItem.price
    t_activityPrice = curItem.activityPrice
    t_memberPrice = curItem.memberPrice
    t_packagePrice = curItem.packagePrice
  } else {
    t_price = price
    t_activityPrice = activityPrice
    t_memberPrice = memberPrice
    t_packagePrice = packagePrice
  }
  if (!isNaN(t_activityPrice)) {
    _price = t_activityPrice
  } else if (!isNaN(t_packagePrice)) {
    _price = t_packagePrice
  } else if (!isNaN(t_memberPrice)) {
    _price = t_memberPrice
  } else {
    _price = t_price
  }

  const renderPurchasePrice = () => {
    if (enPurActivityPrice) {
      return (
        <View className='act-price-wrap'>
          <SpPrice value={info.price} className='act-price' symbol='¥' />
          <SpPrice value={info.salePrice} lineThrough size={24} symbol='¥' />
        </View>
      )
    }
    return <SpPrice value={info.salePrice} />
  }

  // console.log('isNaN(memberPrice):', info.orderItemType)
  return (
    <View className='sp-goods-cell'>
      <View className='goods-item-hd'>
        <SpImage mode='aspectFit' src={info.img} width={180} height={180} radius={10} />
      </View>
      <View className='goods-item-bd'>
        <View className='item-hd'>
          <View className='goods-title'>
            {info?.isMedicine == 1 && info?.isPrescription == 1 && (
              <Text className='prescription-drug'>{$t('7d82f6d2.e8b7e1')}</Text>
            )}
            {info.itemName}
          </View>
        </View>
        <View className='item-bd'>
          <View>
            {/* 多规格商品 */}
            {!info.nospec && (
              <View className='goods-sku' onClick={handleClick}>
                {onSelectSku && (
                  <View className='spec-text'>
                    {info.specText || $t('ac202ef8.a0f99d')}
                    <Text className='iconfont icon-qianwang-01'></Text>
                  </View>
                )}
                {!onSelectSku && info.itemSpecDesc}
              </View>
            )}
          </View>
        </View>
        <View className='labels-block'>
          {!isNaN(memberPrice) && !VERSION_IN_PURCHASE && (
            <View className='goods-type'>
              {vipInfo?.isVip ? vipInfo?.grade_name : userInfo?.gradeInfo?.grade_name}
            </View>
          )}
          {info?.orderItemType && info?.orderItemType != 'normal' && (
            <View className='goods-type'>
              {ORDER_ITEM_TYPE_KEY[info.orderItemType]
                ? $t(ORDER_ITEM_TYPE_KEY[info.orderItemType])
                : GOODS_TYPE()[info.orderItemType]}
            </View>
          )}
          {Array.isArray(info.discount_info) &&
            info.discount_info?.map((sp, idx) => {
              if (sp.type != 'coupon_discount' && sp.type != 'member_price') {
                return (
                  <View className='goods-type' key={`goods-type__${idx}`}>
                    {sp.info}
                  </View>
                )
              }
            })}
          {cusActivity?.map((el) => {
            let limitTxt = ''
            let limitNum = ''
            if (el?.activity_type == 'limited_buy') {
              limitNum = el?.limit
              if (el?.day == 0) {
                limitTxt = ti('7d82f6d2.ffad24', [limitNum])
              } else {
                limitTxt = ti('7d82f6d2.43357c', [el?.day, limitNum])
              }
            }
            {
              /* else if (el?.activity_type == 'seckill' || el?.activity_type == 'limited_time_sale') {
              limitNum = el?.limit
              limitTxt = `（限购${limitNum}件）`
            } else if (el?.activity_type == 'member_tag_targeted_promotion') {
              limitTxt = '专属优惠'
            } */
            }
            return <View className='goods-type'>{limitTxt}</View>
          })}
          {/* {limitTxt && <View className='goods-type'>{limitTxt}</View>} */}
        </View>
        <View className='item-ft'>
          <View className='price-gp'>
            {isPoint && (
              <Text>
                <SpPoint value={point} />
                {_price ? ti('f3788e40.ea9233', [Number(_price).toFixed(2)]) : ''}
              </Text>
            )}
            {!isPoint && (
              <>
                {isPurchase && renderPurchasePrice()}
                {!isPurchase && <SpPrice value={_price}></SpPrice>}
              </>
            )}
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
