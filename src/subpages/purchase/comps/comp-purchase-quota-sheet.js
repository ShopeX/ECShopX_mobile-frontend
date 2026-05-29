/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 *
 * 企业购「我的额度」底部抽屉（purchase 分包）
 */
import React, { useEffect, useRef, useState } from 'react'
import { View, Text } from '@tarojs/components'
import { classNames } from '@/utils'
import { $t, useTranslation } from '@/i18n'
import './comp-purchase-quota-sheet.scss'

const SHEET_ANIMATION_DURATION = 240

function formatQuotaYuan(cents) {
  if (cents == null || cents === '') {
    return '¥0.00'
  }
  const n = Number(cents) / 100
  if (Number.isNaN(n)) {
    return '¥0.00'
  }
  return `¥${n.toFixed(2)}`
}

function CompPurchaseQuotaSheet(props) {
  useTranslation()
  const {
    className,
    open = false,
    onClose = () => {},
    /** 单位：分，与 getEmployeeActivitydata / member 额度字段一致 */
    totalFeeCents,
    usedFeeCents,
    remainingFeeCents
  } = props

  const [shouldRender, setShouldRender] = useState(open)
  const [isActive, setIsActive] = useState(open)
  const openTimerRef = useRef(null)
  const closeTimerRef = useRef(null)

  useEffect(() => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current)
      openTimerRef.current = null
    }
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }

    if (open) {
      setShouldRender(true)
      // 延迟一个 tick，确保初始样式生效后再触发过渡
      openTimerRef.current = setTimeout(() => {
        setIsActive(true)
      }, 16)
      return undefined
    }

    setIsActive(false)
    closeTimerRef.current = setTimeout(() => {
      setShouldRender(false)
    }, SHEET_ANIMATION_DURATION)
    return undefined
  }, [open])

  useEffect(
    () => () => {
      if (openTimerRef.current) {
        clearTimeout(openTimerRef.current)
      }
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current)
      }
    },
    []
  )

  if (!shouldRender) {
    return null
  }

  const totalText = formatQuotaYuan(totalFeeCents)
  const usedText = formatQuotaYuan(usedFeeCents)
  const remainingText = formatQuotaYuan(remainingFeeCents)

  return (
    <View
      className={classNames('comp-purchase-quota-sheet', { 'is-active': isActive }, className)}
      catchMove
    >
      <View className='comp-purchase-quota-sheet__mask' onClick={onClose} />
      <View className='comp-purchase-quota-sheet__panel' catchMove>
        <View className='comp-purchase-quota-sheet__grabber' />
        <View className='comp-purchase-quota-sheet__head'>
          <Text className='comp-purchase-quota-sheet__title'>{$t('d64ed906.167e4d')}</Text>
          <Text className='comp-purchase-quota-sheet__close-icon' onClick={onClose}>
            ×
          </Text>
        </View>
        <View className='comp-purchase-quota-sheet__cols'>
          <View className='comp-purchase-quota-sheet__col'>
            <Text className='comp-purchase-quota-sheet__value'>{totalText}</Text>
            <Text className='comp-purchase-quota-sheet__hint'>{$t('2d09f91d.4d1507')}</Text>
          </View>
          <View className='comp-purchase-quota-sheet__col'>
            <Text className='comp-purchase-quota-sheet__value'>{usedText}</Text>
            <Text className='comp-purchase-quota-sheet__hint'>{$t('2ffc1635.b59b00')}</Text>
          </View>
          <View className='comp-purchase-quota-sheet__col'>
            <Text className='comp-purchase-quota-sheet__value'>{remainingText}</Text>
            <Text className='comp-purchase-quota-sheet__hint'>{$t('10c783c7.9aa89b')}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

CompPurchaseQuotaSheet.options = {
  addGlobalClass: true
}

export default CompPurchaseQuotaSheet
