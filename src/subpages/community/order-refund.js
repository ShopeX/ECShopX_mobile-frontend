/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpPage, SpCheckboxNew, SpFloatLayout, SpPrice, SpInput as AtInput } from '@/components'
import { showToast } from '@/utils'
import { useImmer } from 'use-immer'
import { useTranslation, $t, ti } from '@/i18n'
import './order-refund.scss'

const REFUND_TYPE_DEFAULT = '0f40df51.9c78cd'

const REFUND_REASON_KEYS = [
  '0f40df51.8803f2',
  '0f40df51.892e70',
  '0f40df51.c52533',
  '0f40df51.f031c6',
  '0f40df51.edae56',
  '0f40df51.c440cd',
  '0f40df51.0d98c7'
]

const initialState = {
  isReasonOpened: false,
  isTypeOpen: false,
  refundReason: '',
  refundType: REFUND_TYPE_DEFAULT,
  reasonTitle: '',
  typeTitle: ''
}

const checkList = [
  { goodId: 1, labelKey: '0f40df51.f24b6a', price: 220, num: 1, is_checked: true },
  { goodId: 2, labelKey: '0f40df51.813075', price: 110, num: 2, is_checked: false },
  { goodId: 3, labelKey: '0f40df51.e6803e', price: 330, num: 33, is_checked: true },
  { goodId: 4, labelKey: '0f40df51.e6803e', price: 330, num: 33, is_checked: true },
  { goodId: 5, labelKey: '0f40df51.e6803e', price: 330, num: 33, is_checked: true },
  { goodId: 6, labelKey: '0f40df51.e6803e', price: 330, num: 33, is_checked: true }
]

function OrderRefund(props) {
  const { i18n } = useTranslation()
  const [state, setState] = useImmer(initialState)
  const pageRef = useRef()

  const { isReasonOpened, isTypeOpen, refundReason, refundType, reasonTitle, typeTitle } = state

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('6d738d62.dac519') })
  }, [i18n.language])

  useEffect(() => {
    fetch()
  }, [])

  useEffect(() => {
    if (isReasonOpened || isTypeOpen) {
      pageRef.current.pageLock()
    } else {
      pageRef.current.pageUnLock()
    }
  }, [isReasonOpened, isTypeOpen])

  const fetch = () => {}

  const onHandleCancel = () => {
    setState((draft) => {
      draft.isReasonOpened = false
      draft.isTypeOpen = false
    })
  }

  const onReasonOpenChange = () => {
    setState((draft) => {
      draft.isReasonOpened = true
      draft.reasonTitle = $t('0f40df51.a4f920')
    })
  }

  const onTypeOpenChange = () => {
    setState((draft) => {
      draft.isTypeOpen = true
      draft.typeTitle = $t('0f40df51.c9e269')
    })
  }

  const onChangeClick = async (item, type) => {
    if (type == 'reason') {
      await setState((draft) => {
        draft.refundReason = item
        draft.isReasonOpened = false
      })
    } else {
      await setState((draft) => {
        draft.refundType = item
        draft.isTypeOpen = false
      })
    }
  }

  const onChangeCheck = async (item, type, checked) => {
    Taro.showLoading({ title: '' })
    let parmas = { is_checked: checked }
    if (type === 'all') {
      const goodIds = item.list.map((item) => item.goodId)
      parmas['goodId'] = goodIds
    } else {
      parmas['goodId'] = item.goodId
    }
    try {
      // await api.cart.select(parmas)
    } catch (e) {
      console.log(e)
    }
    fetch()
    Taro.hideLoading()
  }
  const onBlurChange = async (res, idx, value) => {
    let isMax = Number(value) > Number(res.price)
    if (isMax) showToast($t('0f40df51.1bbafe'))
    checkList[idx] = {
      ...checkList[idx],
      newprice: isMax ? res.price : value,
      is_checked: value ? true : false
    }
  }

  const onRefundChange = async (res, idx, value) => {
    if (Number(value) > Number(res.price)) return
    checkList[idx] = { ...checkList[idx], newprice: value }
  }

  const handleCheckout = (list) => {
    console.log(list)
    if (!refundReason) {
      showToast($t('0f40df51.9318de'))
      return
    }
    console.log(refundType, refundReason, checkList)
    Taro.navigateTo({
      url: '/subpages/community/order'
    })
  }

  const renderFooter = () => {
    return (
      <View className='page-order-refund-ft'>
        <View className='left'>
          <SpCheckboxNew
            checked
            label={$t('0f40df51.66eeac')}
            onChange={(e) => onChangeCheck(checkList, 'all', e)}
          />
        </View>
        <View className='right'>
          <View className='total-price'>
            {$t('0f40df51.d9e22d')}
            <SpPrice primary size={36} unit='cent' value={100} />
          </View>
          <AtButton circle type='primary' onClick={() => handleCheckout(checkList)}>
            {$t('0f40df51.0830b4')}
          </AtButton>
        </View>
      </View>
    )
  }

  console.log(checkList, '---')

  return (
    <SpPage ref={pageRef} className='page-order-refund' renderFooter={renderFooter()}>
      <View className='refund-apply-type'>
        <Text className='label'>{$t('0f40df51.719e1b')}</Text>
        <View className='desc' onClick={onTypeOpenChange}>
          <Text>{$t(refundType)}</Text>
          <Text className='iconfont icon-qianwang-01'></Text>
        </View>
      </View>
      <View className='refund-apply-reason'>
        <Text className='label'>{$t('0f40df51.6a4658')}</Text>
        <View className='desc' onClick={onReasonOpenChange}>
          <Text>{refundReason ? $t(refundReason) : $t('0f40df51.708c9d')}</Text>
          <Text className='iconfont icon-qianwang-01'></Text>
        </View>
      </View>
      <View className='refund-apply-goods'>
        <View className='title'>{$t('0f40df51.67148e')}</View>
        {checkList.map((item, idx) => (
          <View key={item.goodId}>
            <View className='goods-info'>
              <SpCheckboxNew
                checked={item.is_checked}
                onChange={(e) => onChangeCheck(item, 'single', e)}
              >
                {$t(item.labelKey)}
                <Text className='nums'>{ti('0f40df51.bcf451', [item.num])}</Text>
              </SpCheckboxNew>
            </View>
            <View className='refund-money'>
              <View>{$t('0f40df51.a0cd4c')}</View>
              <View className='refund-box'>
                <Text className='symol'>¥</Text>
                <AtInput
                  className='refund-input'
                  onChange={(e) => onRefundChange(item, idx, e)}
                  type='digit'
                  name={item.goodId}
                  value={item.newprice}
                  onBlur={(e) => onBlurChange(item, idx, e)}
                  border={false}
                />
                <View className='more'>{ti('0f40df51.bf995c', [item.price])}</View>
              </View>
            </View>
          </View>
        ))}
      </View>
      <SpFloatLayout open={isReasonOpened} title={reasonTitle} onClose={onHandleCancel}>
        {REFUND_REASON_KEYS.map((key) => (
          <View
            onClick={() => onChangeClick(key, 'reason')}
            className='refund-reason-list'
            key={key}
          >
            {$t(key)}
          </View>
        ))}
      </SpFloatLayout>
      <SpFloatLayout open={isTypeOpen} title={typeTitle} onClose={onHandleCancel}>
        <View
          onClick={() => onChangeClick(REFUND_TYPE_DEFAULT, 'type')}
          className='refund-type-list'
        >
          {$t(REFUND_TYPE_DEFAULT)}
        </View>
      </SpFloatLayout>
    </SpPage>
  )
}

export default OrderRefund
