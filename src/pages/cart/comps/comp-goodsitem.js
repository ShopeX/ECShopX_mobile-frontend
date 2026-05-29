/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useImmer } from 'use-immer'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpPrice, SpInputNumber, SpImage } from '@/components'
import { VERSION_IN_PURCHASE } from '@/utils'
import { useTranslation, $t, ti } from '@/i18n'

import './comp-goodsitem.scss'

/** 删除按钮区域宽度（rpx），较原 160rpx 窄 40rpx，约等于常见屏宽下少 20px */
const DELETE_BTN_RPX = 120

function getDeleteBtnWidthPx() {
  try {
    const { windowWidth } = Taro.getWindowInfo()
    return Math.round((DELETE_BTN_RPX / 750) * windowWidth)
  } catch {
    return 65
  }
}

const initialState = {
  localNum: null
}
function CompGoodsItem(props) {
  useTranslation()
  const {
    info,
    children,
    isShowAddInput = true,
    isShowDeleteIcon = true,
    isPurchase = false,
    goodType,
    onDelete = () => {},
    onChange = () => {},
    onClickImgAndTitle = () => {},
    inputMax,
    /** 当前行标识（如 cart_id），与购物车页 openSwipeCartId 联动，实现同时只展开一行删除 */
    swipeRowId,
    openSwipeCartId,
    onSwipeOpenChange
  } = props
  const { priceSetting } = useSelector((state) => state.sys)
  const { userInfo = {}, vipInfo = {} } = useSelector((state) => state.user)
  const { cart_page } = priceSetting
  const { market_price: enMarketPrice } = cart_page
  const { priceDisplayConfig = {} } = useSelector((state) => state.purchase)
  const { cart_page: pcart_page = {} } = priceDisplayConfig
  const { activity_price: enPurActivityPrice = true, sale_price: enPurSalePrice } = pcart_page
  const [state, setState] = useImmer(initialState)
  const { localNum } = state

  const deleteWidthRef = useRef(getDeleteBtnWidthPx())
  const [translateX, setTranslateX] = useState(0)
  const [touchDragging, setTouchDragging] = useState(false)
  const translateRef = useRef(0)
  const gestureRef = useRef({
    startX: 0,
    startY: 0,
    baseTranslate: 0,
    axisLocked: null
  })
  const openSwipeCartIdRef = useRef(openSwipeCartId)

  useEffect(() => {
    translateRef.current = translateX
  }, [translateX])

  useEffect(() => {
    openSwipeCartIdRef.current = openSwipeCartId
  }, [openSwipeCartId])

  useEffect(() => {
    deleteWidthRef.current = getDeleteBtnWidthPx()
  }, [])

  /** 其它行展开时，收起本行 */
  useEffect(() => {
    if (!isShowDeleteIcon || swipeRowId == null || !onSwipeOpenChange) return
    const mine = openSwipeCartId != null && String(openSwipeCartId) === String(swipeRowId)
    if (!mine && translateRef.current < -0.5) {
      setTranslateX(0)
    }
  }, [openSwipeCartId, swipeRowId, isShowDeleteIcon, onSwipeOpenChange])

  const onSwipeTouchStart = useCallback((e) => {
    const t = e.touches[0]
    gestureRef.current.startX = t.clientX
    gestureRef.current.startY = t.clientY
    gestureRef.current.baseTranslate = translateRef.current
    gestureRef.current.axisLocked = null
    setTouchDragging(true)
  }, [])

  const onSwipeTouchMove = useCallback((e) => {
    const t = e.touches[0]
    const dx = t.clientX - gestureRef.current.startX
    const dy = t.clientY - gestureRef.current.startY
    const dw = deleteWidthRef.current

    if (gestureRef.current.axisLocked === null) {
      if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
        gestureRef.current.axisLocked = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v'
      }
    }
    if (gestureRef.current.axisLocked === 'v') {
      return
    }

    let next = gestureRef.current.baseTranslate + dx
    next = Math.min(0, Math.max(-dw, next))
    setTranslateX(next)
  }, [])

  const onSwipeTouchEnd = useCallback(() => {
    setTouchDragging(false)
    const dw = deleteWidthRef.current
    const prev = translateRef.current
    const next = prev < -dw / 2 ? -dw : 0
    setTranslateX(next)
    if (onSwipeOpenChange && swipeRowId != null) {
      if (next <= -dw + 0.5) {
        onSwipeOpenChange(swipeRowId)
      } else if (
        openSwipeCartIdRef.current != null &&
        String(openSwipeCartIdRef.current) === String(swipeRowId)
      ) {
        onSwipeOpenChange(null)
      }
    }
    gestureRef.current.axisLocked = null
  }, [onSwipeOpenChange, swipeRowId])

  const handleSwipeDelete = useCallback(() => {
    if (onSwipeOpenChange && swipeRowId != null) {
      onSwipeOpenChange(null)
    }
    onDelete(info)
    setTranslateX(0)
  }, [info, onDelete, onSwipeOpenChange, swipeRowId])

  useEffect(() => {
    setState((draft) => {
      draft.localNum = info.num
    })
  }, [info.num])

  if (!info) {
    return null
  }

  const onChangeInputNumber = async (e) => {
    const prevNum = info.num
    setState((draft) => {
      draft.localNum = e
    })
    try {
      const result = await onChange(e)
      if (result === false) {
        setState((draft) => {
          draft.localNum = prevNum
        })
      }
    } catch (error) {
      setState((draft) => {
        draft.localNum = prevNum
      })
    }
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
      limitTxt = ti('7d82f6d2.ffad24', [limitNum])
    } else {
      limitTxt = ti('7d82f6d2.43357c', [info?.limitedBuy?.rule.day, limitNum])
    }
  }
  const inputMaxNum =
    inputMax != null && inputMax !== ''
      ? inputMax
      : info?.limitedBuy
      ? info?.limitedBuy?.limit_buy
      : info.store

  const rowBody = (
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
            {info.is_plus_buy && <Text className='goods-title__tag'>{$t('25211a55.54e654')}</Text>}
            {info?.is_medicine == 1 && info?.is_prescription == 1 && (
              <Text className='prescription-drug'>{$t('7d82f6d2.e8b7e1')}</Text>
            )}
            {info.item_name}
          </View>
        </View>

        {info.item_spec_desc && (
          <View className='item-bd'>
            <Text className='spec-desc'>{info.item_spec_desc}</Text>
          </View>
        )}

        <View className='item-tags'>
          {info?.promotions?.map((item, idx) => (
            <View className='item-tag' key={`${item.promotion_tag}_${idx}`}>
              {item.promotion_tag}
            </View>
          ))}
          {!isNaN(member_price) && !VERSION_IN_PURCHASE && (
            <View className='item-tag'>
              {vipInfo?.isVip ? vipInfo?.grade_name : userInfo?.gradeInfo?.grade_name}
            </View>
          )}
          {goodType == 'packages' && <View className='item-tag'>{$t('7d82f6d2.159f49')}</View>}
          {limitTxt && <View className='item-tag'>{limitTxt}</View>}
        </View>

        <View className='item-ft'>
          <View className='item-fd-hd'></View>
          <View className='item-ft-bd'>
            <View className='goods-price-wrap'>
              {isPurchase && (
                <>
                  {enPurActivityPrice ? (
                    <View className='act-price-wrap'>
                      <SpPrice unit='cent' value={info.price} className='act-price' symbol='¥' />
                      <SpPrice
                        unit='cent'
                        value={info.sale_price}
                        size={24}
                        lineThrough
                        symbol='¥'
                      />
                    </View>
                  ) : (
                    <SpPrice unit='cent' value={info.sale_price} />
                  )}
                </>
              )}
              {!isPurchase && <SpPrice value={_price / 100} />}
            </View>
            {isShowAddInput ? (
              <SpInputNumber
                value={localNum ?? info.num}
                max={parseInt(inputMaxNum, 10)}
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
  )

  return (
    <View>
      {children}
      {isShowDeleteIcon ? (
        <View className='comp-goodsitem-swipe'>
          <View
            className='comp-goodsitem-swipe__front'
            style={{
              transform: `translate3d(${translateX}px, 0, 0)`,
              transition: touchDragging ? 'none' : 'transform 0.22s ease-out'
            }}
            onTouchStart={onSwipeTouchStart}
            onTouchMove={onSwipeTouchMove}
            onTouchEnd={onSwipeTouchEnd}
            onTouchCancel={onSwipeTouchEnd}
          >
            {rowBody}
          </View>
          <View className='comp-goodsitem-swipe__delete' onClick={handleSwipeDelete}>
            <Text className='comp-goodsitem-swipe__delete-text'>{$t('fb7ff6e1.2f4aad')}</Text>
          </View>
        </View>
      ) : (
        rowBody
      )}
    </View>
  )
}

export default CompGoodsItem
