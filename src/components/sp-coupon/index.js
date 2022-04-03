import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { SpImage } from '@/components'
import { classNames, styleNames } from '@/utils'
import { COUPON_TYPE } from '@/consts'
import './index.scss'

const initialState = {
  isExpanded: false
}
function SpCoupon(props) {
  const { info } = props
  const [state, setState] = useImmer(initialState)
  const { isExpanded } = state
  if (!info) {
    return null
  }

  const {
    title,
    cardId,
    cardType,
    beginDate,
    endDate,
    tagClass,
    reduceCost,
    leastCost,
    discount,
    useBound,
    description,
    quantity,
    getNum
  } = info

  const { tag, invalidBg, bg } = COUPON_TYPE[cardType]
  const couponTagBg = info.tagClass === 'used' || info.tagClass === 'overdue' ? invalidBg : bg

  const getCouponValue = () => {
    if (cardType === 'cash') {
      return (
        <View className='coupon-cash'>
          <View className='coupon-value'>
            <Text className='symbol'>¥</Text>
            <Text className='value'>{reduceCost}</Text>
          </View>
          <View className='coupon-rule'>{`满${leastCost}可用`}</View>
        </View>
      )
    } else if (cardType === 'discount') {
      return (
        <View className='coupon-discount'>
          <View className='coupon-value'>
            <Text className='value'>{discount}</Text>
            <Text className='symbol'>折</Text>
          </View>
          <View className='coupon-rule'>{`满${leastCost}可用`}</View>
        </View>
      )
    }
  }

  const content = description.split('\n') || []

  return (
    <View className='ba-coupon'>
      <View className='ba-coupon-content'>
        <View
          className='ba-coupon-hd'
          // style={styleNames({
          //   backgroundImage: `url(${process.env.APP_IMAGE_CDN}${'/coupon_FFF.png'})`
          // })}
        >
          <View className='couponn-info'>
            <View
              className='coupon-tag'
              style={styleNames({
                background: couponTagBg
              })}
            >
              {COUPON_TYPE[cardType].tag}
            </View>
            <Text className='title'>{title}</Text>
          </View>
          <View className='coupon-datetime'>{`有效期: ${beginDate} - ${endDate}`}</View>
          <View className='coupon-desc'>
            <Text className='coupon-desc-txt'>详细信息</Text>
            <SpImage
              src={`${isExpanded ? 'coupon_arrow_up.png' : 'coupon_arrow_down.png'}`}
              width={24}
              height={24}
              onClick={() => {
                setState((draft) => {
                  draft.isExpanded = !isExpanded
                })
              }}
            />
          </View>
        </View>
        <View
          className='ba-coupon-ft'
          style={styleNames({
            background: couponTagBg
          })}
        >
          {getCouponValue()}
          <View className='coupon-btn'>
            {quantity > 0 && (
              <View>
                <Button
                  plain
                  openType='share'
                  data-info={cardId}
                  className={classNames('share-btn', {
                    disabled: quantity - getNum <= 0
                  })}
                  disabled={quantity - getNum <= 0}
                >
                  分享给顾客
                </Button>
              </View>
            )}
          </View>
        </View>
      </View>
      {isExpanded && (
        <View className='ba-coupon-desc'>
          {content.map((item, index) => (
            <View className='desc-txt' key={index}>
              {item}
            </View>
          ))}
          {useBound == '0' && <View className='desc-txt'>此优惠券适合全部商品使用。</View>}
          {useBound == '1' && <View className='desc-txt'>此优惠券仅适合指定商品使用。</View>}
          {(useBound == '2' || useBound == '3') && (
            <View className='desc-txt'>此优惠券仅适合指定分类商品使用。</View>
          )}
          {useBound == '4' && <View className='desc-txt'>此优惠券仅适合指定品牌商品使用。</View>}
        </View>
      )}
    </View>
  )
}

SpCoupon.options = {
  addGlobalClass: true
}

export default SpCoupon
