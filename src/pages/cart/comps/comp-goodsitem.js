import React from 'react'
import { useSelector } from 'react-redux'
import { View, Text, Image } from '@tarojs/components'
import { SpPrice, SpInputNumber, SpImage } from '@/components'

import './comp-goodsitem.scss'

function CompGoodsItem(props) {
  const {
    info,
    children,
    isShowAddInput = true,
    isShowDeleteIcon = true,
    onDelete = () => {},
    onChange = () => {},
    onClickImgAndTitle = () => {}
  } = props
  const { priceSetting } = useSelector((state) => state.sys)
  const { cart_page } = priceSetting
  const {
    market_price: enMarketPrice,
  } = cart_page

  if (!info) {
    return null
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
          <SpImage className='comp-goodsitem-image' src={info.pics} width={180} height={180}/>
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

          {info.promotions && (
            <View className='goods-title__promotion'>
              {info.promotions.map((item) => (
                <View className='goods-title__tag'>{item.promotion_tag}</View>
              ))}
            </View>
          )}

          <View className='item-ft'>
            <View className='goods-price-wrap'>
              <SpPrice value={_price / 100} />
              {info.market_price > 0 && enMarketPrice && <SpPrice className='mkt-price' lineThrough value={info.market_price / 100} />}
            </View>
            {isShowAddInput ? (
              <SpInputNumber
                value={info.num}
                max={info.store}
                min={1}
                onChange={(e) => onChange(e)}
              />
            ) : (
              <Text className='item-num'>x {info.num}</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  )
}

export default CompGoodsItem
