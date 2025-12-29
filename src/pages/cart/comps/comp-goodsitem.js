/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import { useSelector } from 'react-redux'
import { View, Text, Image } from '@tarojs/components'
import { SpPrice, SpInputNumber, SpImage } from '@/components'
import { VERSION_IN_PURCHASE } from '@/utils'

import './comp-goodsitem.scss'

const initialState = {
  localNum: 0
}
function CompGoodsItem(props) {
  const {
    info,
    children,
    isShowAddInput = true,
    isShowDeleteIcon = true,
    isPurchase = false,
    goodType,
    onDelete = () => {},
    onChange = () => {},
    onClickImgAndTitle = () => {}
  } = props
  const { priceSetting } = useSelector((state) => state.sys)
  const { userInfo = {}, vipInfo = {} } = useSelector((state) => state.user)
  const { cart_page } = priceSetting
  const { market_price: enMarketPrice } = cart_page
  const { priceDisplayConfig = {} } = useSelector((state) => state.purchase)
  const { cart_page: pcart_page = {} } = priceDisplayConfig
  const { activity_price: enPurActivityPrice, sale_price: enPurSalePrice } = pcart_page
  const [state, setState] = useImmer(initialState)
  const { localNum } = state

  useEffect(() => {
    setState((draft) => {
      draft.localNum = info.num
    })
  }, [info.num])

  if (!info) {
    return null
  }

  const onChangeInputNumber = (e) => {
    setState((draft) => {
      draft.localNum = e
    })
    onChange(e)
  }

  const { price, activity_price, member_price, package_price } = info
  let _price
  if (!isNaN(activity_price)) {
    _price = activity_price
  } else if (!isNaN(package_price)) {
    _price = package_price
  } else if (!isNaN(member_price)) {
    _price = member_price
  } else {
    _price = price
  }

  let limitTxt = ''
  let limitNum = ''
  if (info?.limitedBuy?.marketing_type == 'limited_buy') {
    limitNum = info?.limitedBuy?.rule.limit
    if (info?.limitedBuy?.rule.day == 0) {
      limitTxt = `限购${limitNum}件`
    } else {
      limitTxt = `每${info?.limitedBuy?.rule.day}天，限购${limitNum}件`
    }
  }

  return (
    <View>
      {children}
      <View className='comp-goodsitem'>
        <View className='comp-goodsitem-hd' onClick={onClickImgAndTitle}>
          <SpImage
            className='comp-goodsitem-image'
            mode='aspectFill'
            src={info.pics}
            width={180}
            height={180}
          />
        </View>
        <View className='comp-goodsitem-bd'>
          <View className='item-hd'>
            <View className='goods-title'>
              {/* {info.activity_type == 'package' && <Text className='goods-title__tag'>组合商品</Text>} */}
              {info.is_plus_buy && <Text className='goods-title__tag'>加价购</Text>}
              {info?.is_medicine == 1 && info?.is_prescription == 1 && (
                <Text className='prescription-drug'>处方药</Text>
              )}
              {info.item_name}
            </View>
            {isShowDeleteIcon && (
              <Text className='iconfont icon-shanchu-01' onClick={() => onDelete(info)}></Text>
            )}
          </View>

          {/* {info.brief && <Text className='spec-brief'>{info.brief}</Text>} */}

          {info.item_spec_desc && (
            <View className='item-bd'>
              <Text className='spec-desc'>{info.item_spec_desc}</Text>
            </View>
          )}

          <View className='item-tags'>
            {info?.promotions?.map((item) => (
              <View className='item-tag'>{item.promotion_tag}</View>
            ))}
            {!isNaN(member_price) && !VERSION_IN_PURCHASE && (
              <View className='item-tag'>
                {vipInfo?.isVip ? vipInfo?.grade_name : userInfo?.gradeInfo?.grade_name}
              </View>
            )}
            {goodType == 'packages' && <View className='item-tag'>组合商品</View>}
            {limitTxt && <View className='item-tag'>{limitTxt}</View>}
          </View>

          <View className='item-ft'>
            <View className='item-fd-hd'></View>
            <View className='item-ft-bd'>
              <View className='goods-price-wrap'>
                {isPurchase && (
                  <>
                    <SpPrice value={info.sale_price / 100} />
                    {enPurActivityPrice && (
                      <View className='act-price'>
                        活动价¥{(info.price / 100).toFixed(2)}
                        {/* <SpPrice value={info.price / 100} /> */}
                      </View>
                    )}
                  </>
                )}
                {!isPurchase && <SpPrice value={_price / 100} />}
                {info.market_price > 0 && enMarketPrice && (
                  <SpPrice className='mkt-price' lineThrough value={info.market_price / 100} />
                )}
              </View>
              {isShowAddInput ? (
                <SpInputNumber
                  value={info.num}
                  max={parseInt(info?.limitedBuy ? info?.limitedBuy?.limit_buy : info.store)}
                  min={Number(info.start_num) > 0 ? Number(info.start_num) : 1}
                  onChange={onChangeInputNumber}
                />
              ) : (
                <Text className='item-num'>x {info.num}</Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default CompGoodsItem
