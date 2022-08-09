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
    goodType,
    onDelete = () => {},
    onChange = () => {},
    onClickImgAndTitle = () => {}
  } = props
  const { priceSetting } = useSelector((state) => state.sys)
  const { userInfo = {}, vipInfo = {} } = useSelector((state) => state.user)
  const { cart_page } = priceSetting
  const { market_price: enMarketPrice } = cart_page
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
              {info.is_plus_buy && <Text className='goods-title__tag'>换购</Text>}
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
          </View>

          <View className='item-ft'>
            <View className='item-fd-hd'></View>
            <View className='item-ft-bd'>
              <View className='goods-price-wrap'>
                <SpPrice value={_price / 100} />
                {info.market_price > 0 && enMarketPrice && (
                  <SpPrice className='mkt-price' lineThrough value={info.market_price / 100} />
                )}
              </View>
              {isShowAddInput ? (
                <SpInputNumber
                  value={localNum}
                  max={info.store}
                  min={1}
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
