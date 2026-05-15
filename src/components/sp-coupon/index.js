/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { useImmer } from 'use-immer'
import { SpImage } from '@/components'
import { classNames, styleNames, VERSION_PLATFORM } from '@/utils'
import { COUPON_TYPE } from '@/consts'
import { $t, ti } from '@/i18n'
import './index.scss'

const COUPON_CARD_TAG_KEY = {
  new_gift: '97c6bb81.8bc752',
  cash: '97c6bb81.f23195',
  discount: '97c6bb81.9268f9'
}

const initialState = {
  isExpanded: false
}
function SpCoupon(props) {
  const { info, children, onClick = () => {} } = props
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
    getNum,
    distributorName
  } = info

  const { tag, invalidBg, bg } = COUPON_TYPE()[cardType]
  const couponTagBg =
    info.tagClass === 'used' || info.tagClass === 'overdue' || !info.valid ? invalidBg : bg

  const getCouponValue = () => {
    if (cardType === 'cash') {
      return (
        <View className='coupon-cash'>
          <View className='coupon-value'>
            <Text className='symbol'>¥</Text>
            <Text className='value'>{reduceCost}</Text>
          </View>
          <View className='coupon-rule'>
            {leastCost > 0 ? ti('97c6bb81.47e317', [leastCost]) : ''}
          </View>
        </View>
      )
    } else if (cardType === 'discount') {
      return (
        <View className='coupon-discount'>
          <View className='coupon-value'>
            <Text className='value'>{discount}</Text>
            <Text className='symbol'>{$t('97c6bb81.96c015')}</Text>
          </View>
          <View className='coupon-rule'>
            {leastCost > 0 ? ti('97c6bb81.47e317', [leastCost]) : ''}
          </View>
        </View>
      )
    } else if (cardType === 'new_gift') {
      return (
        <View className='coupon-gift'>
          <View className='coupon-value'>
            <Text className='value'>{$t('97c6bb81.8bc752')}</Text>
          </View>
          <View className='coupon-rule'></View>
        </View>
      )
    }
  }

  const content = description.split('\n') || []
  return (
    <View className='sp-coupon'>
      <View className='sp-coupon-content'>
        <View
          className='sp-coupon-hd'
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
            <View className='title'>{`${
              VERSION_PLATFORM && distributorName ? `${distributorName}: ${title}` : title
            }`}</View>
          </View>
          <View className='coupon-datetime'>{ti('97c6bb81.661906', [beginDate, endDate])}</View>
          <View className='coupon-desc'>
            {info.valid && (
              <View
                style={{ display: 'flex', alignItems: 'center' }}
                onClick={() => {
                  setState((draft) => {
                    draft.isExpanded = !isExpanded
                  })
                }}
              >
                <Text className='coupon-desc-txt'>{$t('97c6bb81.4bcc9a')}</Text>
                <SpImage
                  src={`${isExpanded ? 'coupon_arrow_up.png' : 'coupon_arrow_down.png'}`}
                  width={24}
                  height={24}
                />
              </View>
            )}
            {!info.valid && <View className='invaild-desc'>{info.invalidDesc}</View>}
          </View>
        </View>
        <View
          className='sp-coupon-ft'
          style={styleNames({
            background: couponTagBg
          })}
        >
          {getCouponValue()}
          <View className={classNames('coupon-btn', cardType, info.tagClass)} onClick={onClick}>
            {children}
          </View>
        </View>
      </View>
      {isExpanded && (
        <View className='sp-coupon-desc'>
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

SpCoupon.options = {
  addGlobalClass: true
}

export default SpCoupon
