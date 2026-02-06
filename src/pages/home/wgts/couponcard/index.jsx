/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useState, useMemo, useEffect } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import {
  pxToUnitRpx,
  classNames,
  pickBy,
  isWeixin,
  showToast,
  getMobAppExtraData,
  styleNames
} from '@/utils'
import { useImmer } from 'use-immer'
import { SpHtml, SpLogin } from '@/components'
import { useSelector } from 'react-redux'
import api from '@/api'
import doc from '@/doc'
import { getGlobalBaseStyle } from '../helper'
import './index.scss'

const $instance = getCurrentInstance()
function WgtCouponCard(props) {
  const [state, setState] = useImmer({
    couponCardList: []
  })
  const { couponCardList } = state
  const { info, id } = props
  const { pagetype } = info
  const { base, data } = info
  const { outerMargin, innerPadding, receiveBtn, amountColor } = base
  console.log('base', base)
  useEffect(() => {
    if (data.length > 0) {
      getCouponCardList()
    }
  }, [data])

  const getCouponCardList = async () => {
    const aioproCard = data.filter((item) => item.card_source !== 'mob')
    const aioCard = data.filter((item) => item.card_source == 'mob')

    const cardIds = aioproCard?.map((item) => item.id).join(',')
    let couponCardList = []
    if (cardIds) {
      const res = await api.wgts.getCoupon({
        page_no: 1,
        page_size: 1000,
        card_id: cardIds,
        distributor_id: ''
      })
      couponCardList = pickBy(res.list, doc.wgt.WGTCOUPON)
    }
    const _list = pickBy(aioCard, doc.coupon.COUPON)
    setState((draft) => {
      draft.couponCardList = couponCardList.concat(_list)
    })
  }

  // 获取外层样式
  const outerStyle = useMemo(() => {
    return getGlobalBaseStyle(outerMargin)
  }, [outerMargin])

  // 获取内层样式
  const innerStyle = useMemo(() => {
    return getGlobalBaseStyle(innerPadding)
  }, [innerPadding])
  const receiveBtnStyle = useMemo(() => {
    const { color, textColor } = receiveBtn
    return {
      backgroundColor: color,
      color: textColor
    }
  }, [receiveBtn])

  const couponBgImg = useMemo(() => {
    if (couponCardList.length === 1) {
      return `url(${process.env.APP_IMAGE_CDN}/fv_couponbg1.png)`
    }
    if (couponCardList.length === 2) {
      return `url(${process.env.APP_IMAGE_CDN}/fv_couponbg2.png)`
    }
    if (couponCardList.length === 3) {
      return `url(${process.env.APP_IMAGE_CDN}/fv_couponbg3.png)`
    }
    if (couponCardList.length >= 4) {
      return `url(${process.env.APP_IMAGE_CDN}/fv_couponbg4.png)`
    }
  }, [couponCardList])

  const handleReceiveCoupon = async (item, index) => {
    if (isWeixin) {
      const templeparams = {
        temp_name: 'yykweishop',
        source_type: 'coupon'
      }
      const { template_id } = await api.user.newWxaMsgTmpl(templeparams)
      if (template_id.length > 0) {
        Taro.requestSubscribeMessage({
          tmplIds: template_id,
          success: () => {
            getCoupon(item, index)
          },
          fail: () => {
            getCoupon(item, index)
          }
        })
      } else {
        getCoupon(item, index)
      }
    } else {
      getCoupon(item, index)
    }
  }

  const getCoupon = async ({ cardId, cardSource }, index) => {
    try {
      const { status } = await api.member.homeCouponGet({
        card_id: cardId
      })
      if (!status) return
      showToast('优惠券领取成功')
      getCouponCardList()
    } catch (error) {
      console.log('error', error)
      showToast('优惠券领取失败')
      getCouponCardList()
    }
  }

  const useCoupon = (item, index) => {
    Taro.navigateTo({
      url: `/subpages/marketing/coupon`
    })
  }

  const renderBtn = (item, index) => {
    const defaultBtn = () => {
      if (item.buttonStatus !== 'get_invalid') {
        return (
          <SpLogin onChange={() => handleReceiveCoupon(item, index)}>
            <View className='wgt-couponcard-item-btn' style={receiveBtnStyle}>
              立即领取
            </View>
          </SpLogin>
        )
      } else {
        return (
          <View className='wgt-couponcard-item-btn-look' onClick={() => useCoupon(item, index)}>
            查看优惠券
          </View>
        )
      }
    }
    if (item.cardSource == 'mob') {
      if (item.dayStockNum > 0 && item.stockNum > 0) {
        return defaultBtn()
      } else {
        return (
          <View className='wgt-couponcard-item-btn-look wgt-couponcard-item-btn-disable'>
            {item.stockNum <= 0 ? '已领完' : '今日已领完'}
          </View>
        )
      }
    } else {
      if (item?.remainingNum > 0) {
        return defaultBtn()
      } else {
        return (
          <View className='wgt-couponcard-item-btn-look wgt-couponcard-item-btn-disable'>
            已领完
          </View>
        )
      }
    }
  }
  console.log('coupon-outerStyle', outerStyle)
  console.log('coupon-innerStyle', innerStyle)
  return (
    <View className='wgt-couponcard' style={outerStyle} id={`wgt-couponcard-${id}`}>
      <View
        className={classNames('wgt-couponcard-inner', {
          'wgt-couponcard-one': couponCardList.length == 1,
          'wgt-couponcard-two': couponCardList.length == 2,
          'wgt-couponcard-three': couponCardList.length == 3,
          'wgt-couponcard-more': couponCardList.length >= 4
        })}
        style={innerStyle}
      >
        <View className='wgt-couponcard-item-list'>
          {couponCardList?.map((item, index) => (
            <View
              key={index}
              className='wgt-couponcard-item'
              style={{
                backgroundImage: couponBgImg
              }}
            >
              <View className='wgt-couponcard-item-body'>
                <View className='wgt-couponcard-item-header'>
                  {item.type !== 'discount' && (
                    <View className='coupon-unit' style={{ color: amountColor }}>
                      ¥
                    </View>
                  )}
                  <View className='coupon-title' style={{ color: amountColor }}>
                    {item.reduceCost}
                  </View>
                  {item.type == 'discount' && (
                    <View className='coupon-unit' style={{ color: amountColor }}>
                      折
                    </View>
                  )}
                </View>
                <View className='wgt-couponcard-item-info'>
                  <View className='use-title'>{item.title}</View>
                  <View className='use-desc'>{item.description}</View>
                  {couponCardList.length == 1 && <View className='use-time'>{item.validDate}</View>}
                </View>
              </View>
              {renderBtn(item, index)}
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

WgtCouponCard.options = {
  addGlobalClass: true
}

export default React.memo(WgtCouponCard)
