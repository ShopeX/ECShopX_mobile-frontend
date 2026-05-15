/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React from 'react'
import { View, Text, Button } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { SpImage } from '@/components'
import { useTranslation, $t, ti } from '@/i18n'
import { classNames, styleNames } from '@/utils'
import { COUPON_TYPE } from '@/consts'
import './index.scss'

const COUPON_CARD_TAG_KEY = {
  new_gift: '97c6bb81.8bc752',
  cash: '97c6bb81.f23195',
  discount: '97c6bb81.9268f9'
}

const initialState = {
  isExpanded: false
}
function BaCoupon(props) {
  useTranslation()
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

  const { invalidBg, bg } = COUPON_TYPE()[cardType]
  const couponTagBg = info.tagClass === 'used' || info.tagClass === 'overdue' ? invalidBg : bg

  const getCouponValue = () => {
    if (cardType === 'cash') {
      return (
        <View className='coupon-cash'>
          <View className='coupon-value'>
            <Text className='symbol'>¥</Text>
            <Text className='value'>{reduceCost}</Text>
          </View>
          <View className='coupon-rule'>{ti('97c6bb81.47e317', [leastCost])}</View>
        </View>
      )
    } else if (cardType === 'discount') {
      return (
        <View className='coupon-discount'>
          <View className='coupon-value'>
            <Text className='value'>{discount}</Text>
            <Text className='symbol'>{$t('97c6bb81.96c015')}</Text>
          </View>
          <View className='coupon-rule'>{ti('97c6bb81.47e317', [leastCost])}</View>
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
              {COUPON_CARD_TAG_KEY[cardType]
                ? $t(COUPON_CARD_TAG_KEY[cardType])
                : COUPON_TYPE()[cardType]?.tag}
            </View>
            <Text className='title'>{title}</Text>
          </View>
          <View className='coupon-datetime'>{ti('97c6bb81.661906', [beginDate, endDate])}</View>
          <View className='coupon-desc'>
            <Text className='coupon-desc-txt'>{$t('97c6bb81.4bcc9a')}</Text>
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
                  {$t('97c6bb81.e6bd60')}
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
          {useBound == '0' && <View className='desc-txt'>{$t('97c6bb81.e7ac2b')}</View>}
          {useBound == '1' && <View className='desc-txt'>{$t('97c6bb81.6c6b37')}</View>}
          {(useBound == '2' || useBound == '3') && (
            <View className='desc-txt'>{$t('97c6bb81.d57101')}</View>
          )}
          {useBound == '4' && <View className='desc-txt'>{$t('97c6bb81.23c0e1')}</View>}
        </View>
      )}
    </View>
  )
}

BaCoupon.options = {
  addGlobalClass: true
}

export default BaCoupon
