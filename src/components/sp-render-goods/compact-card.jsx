import React, { useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { SpImage, SpPrice } from '@/components'
import SpTag from '@/components/sp-tag/index'
import Taro from '@tarojs/taro'
import qs from 'qs'
import { classNames, styleNames } from '@/utils'

import './compact-card.scss'

function SpGoodsCompactCard(props) {
  const {
    info = null,
    onClick,
    mode = 'aspectFill',
    top,
    showTop,
    onClickGio = () => {},
    onChangeRegionauth = () => {}
  } = props

  const handleClick = () => {
    if (!info) return
    onClickGio && onClickGio()
    if (onClick) {
      onClick(info)
      return
    }
    const { itemId, distributorId } = info
    let query = { id: itemId }
    if (typeof distributorId !== 'undefined') {
      query = {
        ...query,
        dtid: distributorId
      }
    }
    const url = `/pages/item/espier-detail?${qs.stringify(query)}`
    onChangeRegionauth(info)
    Taro.navigateTo({
      url
    })
  }

  if (!info) {
    return null
  }
  const finalPrice = info.activityPrice || info.price

  return (
    <View
      id={`sp-goods-compact-card-${info.itemId}`}
      key={props.key}
      className={classNames('sp-goods-compact-card', props.className)}
      onClick={handleClick}
    >
      <View
        className='sp-goods-compact-card__image'
        style={styleNames({
          width: Taro.pxTransform(props.width),
          height: Taro.pxTransform(props.width)
        })}
      >
        <SpImage
          lazyLoad
          src={info.pic}
          mode={mode}
          width={props.width}
          height={props.width}
          placeholderColor='#f2f3f5'
        />
        {info.store <= 0 && (
          <View className='soldout-mask'>
            <View className='soldout-mask-text'>
              <Text>已售罄</Text>
            </View>
          </View>
        )}
        {showTop ? <View className={classNames('top-tag', `top-${top}`)}>TOP.{top}</View> : null}
      </View>
      <View className='sp-goods-compact-card__content'>
        <View>
          <View className='sp-goods-compact-card__title'>
            {info.promotionSkill && (
              <View className='sp-goods-compact-card__title-img'>
                <SpImage src='fv_activity_seckill.png' mode='heightFix' width={62} height={31} />
              </View>
            )}
            {info.memberPreference?.marketing_name && (
              <View className='sp-goods-compact-card__title-img'>
                <SpImage src='fv_member_preference.png' mode='heightFix' height={32} />
              </View>
            )}
            {info.itemName}
          </View>
          <View id={`${props.id}-tag-wrapper`} className='tag-wrapper flex align-center'>
            {info?.promotion?.map((tag, index) => (
              <SpTag
                className='tag-wrapper__tag'
                key={index}
                label={tag.tag_name}
                type={tag.type}
              />
            ))}
            {info?.couponList?.map((coupon, index) => (
              <SpTag
                className='tag-wrapper__tag'
                key={index}
                label={coupon.discount_rule}
                type='warning'
              />
            ))}
          </View>
        </View>

        <View className='sp-goods-compact-card__price'>
          <View className='price-wrapper'>
            <SpPrice
              className='current-price'
              size={34}
              value={finalPrice}
              style={{ marginRight: '6px' }}
              weight={600}
            />

            {Number(info.marketPrice || 0) > 0 &&
              Number(finalPrice || 0) < Number(info.marketPrice || 0) && (
                <SpPrice
                  size={24}
                  noSymbol
                  // noDecimal
                  className='market-price'
                  lineThrough
                  value={info.marketPrice}
                />
              )}
          </View>

          {info.discountRate && (
            <View className='discount-tag'>
              <Text className='discount-tag__value'>{info.discountRate}</Text>
              <Text className='discount-tag__unit'>折</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

SpGoodsCompactCard.options = {
  addGlobalClass: true
}

SpGoodsCompactCard.defaultProps = {
  className: '',
  id: '',
  info: null,
  key: '',
  onClick: null,
  mode: 'aspectFill',
  width: 218,
  top: 0,
  showTop: false,
  onLoad: () => {}
}

export default SpGoodsCompactCard
