/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 *
 * 内购底部操作栏：购物车 · 分享亲友 · 活动剩余额度（purchase 分包）
 *
 * 剩余额度：默认根据 Redux 中 purchase_share_info / persist_purchase_share_info 拉取活动数据展示；
 * 若传入 remainingAmount 则由页面接管展示（避免与页面内已有接口重复请求）。
 *
 * variant="activityList"：主包活动列表页内置跳转与提示，可不传 onCart / onShare / onQuota
 * fixed：固定在视口底部（配合页面内容区预留 padding-bottom）
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDidShow } from '@tarojs/taro'
import { useSelector } from 'react-redux'
import { View, Text } from '@tarojs/components'
import { SpImage } from '@/components'
import api from '@/api'
import { classNames, navigateTo, showToast } from '@/utils'
import { $t, useTranslation } from '@/i18n'
import './comp-purchase-actionbar.scss'

function formatRemainingYuan(activityData) {
  if (!activityData) return '¥0.00'
  const cents =
    activityData.surplus_limitfee ??
    activityData.left_fee ??
    activityData?.fee?.left_fee
  if (cents == null || cents === '') return '¥0.00'
  const n = Number(cents) / 100
  if (Number.isNaN(n)) return '¥0.00'
  return `¥${n.toFixed(2)}`
}

function CompPurchaseActionbar(props) {
  const { i18n } = useTranslation()
  const {
    className,
    variant,
    fixed = false,
    hideCart = false,
    remainingLabel,
    remainingAmount: remainingAmountFromParent,
    cartCount: cartCountProp,
    onCart,
    onShare,
    onQuota
  } = props

  const isActivityList = variant === 'activityList'
  const {
    purchase_share_info = {},
    persist_purchase_share_info = {},
    curEnterpriseId
  } = useSelector((state) => state.purchase)

  const activityId = purchase_share_info.activity_id || persist_purchase_share_info.activity_id
  const enterpriseId =
    purchase_share_info.enterprise_id ||
    persist_purchase_share_info.enterprise_id ||
    curEnterpriseId

  /** 未传 remainingAmount 时由组件内接口数据展示额度；活动数据始终在有活动/企业上下文时拉取，用于剩余额度与是否展示「分享亲友」 */
  const useRemoteQuota = remainingAmountFromParent === undefined || remainingAmountFromParent === null

  const [fetchedActivity, setFetchedActivity] = useState(null)

  const loadActivity = useCallback(async () => {
    if (!activityId || !enterpriseId) {
      setFetchedActivity(null)
      return
    }
    try {
      const data = await api.purchase.getEmployeeActivitydata({
        activity_id: activityId,
        enterprise_id: enterpriseId
      })
      setFetchedActivity(data || null)
    } catch (e) {
      setFetchedActivity(null)
    }
  }, [activityId, enterpriseId])

  useEffect(() => {
    loadActivity()
  }, [loadActivity])

  useDidShow(() => {
    loadActivity()
  })

  /** 与活动页一致：员工内购且开启亲友分享时才展示「分享亲友」 */
  const canShowShareFriend = useMemo(() => {
    if (!fetchedActivity) return false
    return !!(fetchedActivity.is_employee && fetchedActivity.if_relative_join)
  }, [fetchedActivity])

  const cartFromStore = useSelector((state) => state.purchase?.cartCount ?? 0)
  const cartCount = useMemo(() => {
    if (cartCountProp != null) return cartCountProp
    if (isActivityList) return cartFromStore
    return 0
  }, [cartCountProp, cartFromStore, isActivityList])

  const displayRemainingLabel = useMemo(() => {
    if (isActivityList) {
      return $t('307aead5.b2bffd')
    }
    if (remainingLabel !== undefined && remainingLabel !== null && remainingLabel !== '') {
      return remainingLabel
    }
    return $t('307aead5.b2bffd')
  }, [isActivityList, remainingLabel, i18n.language])

  const displayRemainingAmount = useMemo(() => {
    if (!useRemoteQuota) {
      return remainingAmountFromParent
    }
    return formatRemainingYuan(fetchedActivity)
  }, [useRemoteQuota, remainingAmountFromParent, fetchedActivity])

  const handleCart = useCallback(() => {
    if (isActivityList) {
      navigateTo('/subpages/purchase/espier-index?tabbar=0')
      return
    }
    ;(onCart || (() => {}))()
  }, [isActivityList, onCart])

  const handleShare = useCallback(() => {
    if (isActivityList) {
      showToast($t('307aead5.343490'))
      return
    }
    ;(onShare || (() => {}))()
  }, [isActivityList, onShare])

  const handleQuota = useCallback(() => {
    if (isActivityList) {
      showToast($t('307aead5.343490'))
      return
    }
    ;(onQuota || (() => {}))()
  }, [isActivityList, onQuota])

  return (
    <View
      className={classNames('comp-purchase-actionbar', className, {
        'comp-purchase-actionbar--fixed': fixed,
        'comp-purchase-actionbar--no-cart': hideCart,
        'comp-purchase-actionbar--no-share': !canShowShareFriend
      })}
    >
      <View className='comp-purchase-actionbar__row'>
        {!hideCart && (
          <View className='comp-purchase-actionbar__square' onClick={handleCart}>
            <View className='comp-purchase-actionbar__icon-wrap'>
              <SpImage src='purchasecar.png' className='comp-purchase-actionbar__icon' mode='aspectFill' />
              {cartCount > 0 && (
                <Text className='comp-purchase-actionbar__badge'>
                  {cartCount > 99 ? '99+' : cartCount}
                </Text>
              )}
            </View>
            <Text className='comp-purchase-actionbar__label'>{$t('21544271.c017be')}</Text>
          </View>
        )}

        {canShowShareFriend && (
          <View className='comp-purchase-actionbar__square' onClick={handleShare}>
            <View className='comp-purchase-actionbar__share-icon'>
              <SpImage src='purcharefriend.png' className='comp-purchase-actionbar__icon' mode='aspectFill' />
            </View>
            <Text className='comp-purchase-actionbar__label'>{$t('f367f1ff.83d472')}</Text>
          </View>
        )}

        <View className='comp-purchase-actionbar__quota' onClick={handleQuota}>
          <View className='comp-purchase-actionbar__quota-text'>
            <Text className='comp-purchase-actionbar__quota-hint'>{displayRemainingLabel}</Text>
            <Text className='comp-purchase-actionbar__quota-amount'>{displayRemainingAmount}</Text>
          </View>
          <SpImage src='purchase_right.png' className='comp-purchase-actionbar__chevron' mode='aspectFill' />
        </View>
      </View>
    </View>
  )
}

CompPurchaseActionbar.options = {
  addGlobalClass: true
}

export default CompPurchaseActionbar
