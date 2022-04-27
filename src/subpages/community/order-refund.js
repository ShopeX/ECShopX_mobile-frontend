import React, { useEffect, useCallback, useRef, useState } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtInput, AtButton } from 'taro-ui'
import { SpPage, SpCheckboxNew, SpFloatLayout, SpPrice } from '@/components'
import { pickBy, classNames, showToast } from '@/utils'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import doc from '@/doc'
import api from '@/api'

import './order-refund.scss'

const initialState = {
  isReasonOpened: false,
  isTypeOpen: false,
  refundReason: '请选择',
  refundType: '我要退款（无需退货）',
  reasonTitle: '',
  typeTitle: '',
  selectValue: false
}

const refundReasonList = [
  '多拍、错拍、不想要',
  '没时间去拿',
  '大小尺寸与商品描述不符',
  '团长未发货',
  '团长缺货',
  '质量问题',
  '其他'
]

const refundTypeList = ['我要退款（无需退货）']

const checkList = [
  { goodId: 1, label: '橙子', price: 220, num: 1, is_checked: true },
  { goodId: 2, label: '橘子', price: 110, num: 2, is_checked: false },
  { goodId: 3, label: '苹果', price: 330, num: 33, is_checked: true },
  { goodId: 4, label: '苹果', price: 330, num: 33, is_checked: true },
  { goodId: 5, label: '苹果', price: 330, num: 33, is_checked: true },
  { goodId: 6, label: '苹果', price: 330, num: 33, is_checked: true }
]

function OrderRefund(props) {
  const [state, setState] = useImmer(initialState)
  const { colorPrimary } = useSelector((state) => state.sys)
  const pageRef = useRef()

  const {
    isReasonOpened,
    isTypeOpen,
    refundReason,
    refundType,
    reasonTitle,
    typeTitle,
    selectValue
  } = state

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
      draft.reasonTitle = '请选择申请原因'
    })
  }

  const onTypeOpenChange = () => {
    setState((draft) => {
      draft.isTypeOpen = true
      draft.typeTitle = '请选择申请类型'
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
    Taro.showLoading()
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
    if (isMax) showToast('输入退款金额超出范围')
    checkList[idx] = {
      ...checkList[idx],
      newprice: isMax ? res.price : value,
      is_checked: value ? true : false
    }
    await setState((draft) => {
      draft.checkList = [...checkList]
    })
  }

  const onRefundChange = async (res, idx, value) => {
    if (Number(value) > Number(res.price)) return
    checkList[idx] = { ...checkList[idx], newprice: value }
    await setState((draft) => {
      draft.checkList = [...checkList]
    })
  }

  const handleCheckout = (list) => {
    console.log(list)
    if (refundReason == '请选择') {
      showToast('请选择退款原因')
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
            label='全选'
            onChange={(e) => onChangeCheck(checkList, 'all', e)}
          />
        </View>
        <View className='right'>
          <View className='total-price'>
            共退款：
            <SpPrice primary size={36} unit='cent' value={100} />
          </View>
          <AtButton circle type='primary' onClick={() => handleCheckout(checkList)}>
            提交申请
          </AtButton>
        </View>
      </View>
    )
  }

  console.log(checkList, '---')

  return (
    <SpPage ref={pageRef} className='page-order-refund' renderFooter={renderFooter()}>
      <View className='refund-apply-type'>
        <Text className='label'>申请类型</Text>
        <View className='desc' onClick={onTypeOpenChange}>
          <Text>{refundType}</Text>
          <Text className='iconfont icon-qianwang-01'></Text>
        </View>
      </View>
      <View className='refund-apply-reason'>
        <Text className='label'>申请原因</Text>
        <View className='desc' onClick={onReasonOpenChange}>
          <Text>{refundReason}</Text>
          <Text className='iconfont icon-qianwang-01'></Text>
        </View>
      </View>
      <View className='refund-apply-goods'>
        <View className='title'>退款商品</View>
        {checkList.map((item, idx) => (
          <>
            <View className='goods-info' key={idx}>
              <SpCheckboxNew
                checked={item.is_checked}
                onChange={(e) => onChangeCheck(item, 'single', e)}
              >
                {item.label}
                <Text className='nums'>(共{item.num}件)</Text>
              </SpCheckboxNew>
            </View>
            <View className='refund-money'>
              <View>退款金额</View>
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
                <View className='more'>最多可退¥{item.price}</View>
              </View>
            </View>
          </>
        ))}
      </View>
      <SpFloatLayout open={isReasonOpened} title={reasonTitle} onClose={onHandleCancel}>
        {refundReasonList.map((item, idx) => (
          <View
            onClick={() => onChangeClick(item, 'reason')}
            className='refund-reason-list'
            key={idx}
          >
            {item}
          </View>
        ))}
      </SpFloatLayout>
      <SpFloatLayout open={isTypeOpen} title={typeTitle} onClose={onHandleCancel}>
        {refundTypeList.map((item, idx) => (
          <View onClick={() => onChangeClick(item, 'type')} className='refund-type-list' key={idx}>
            {item}
          </View>
        ))}
      </SpFloatLayout>
    </SpPage>
  )
}

export default OrderRefund
