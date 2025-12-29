/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import Taro, { useRouter } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { SpPage, SpImage } from '@/components'
import { entryLaunch } from '@/utils'
import './invoice-success.scss'

const initialState = {
  invoice_id: ''
}

const InvoiceSuccess = () => {
  const $router = useRouter()
  const [state, setState] = useImmer(initialState)
  const { invoice_id } = state

  useEffect(() => {
    entryLaunch.getRouteParams($router.params).then((params) => {
      if (params?.invoice_id) {
        setState((draft) => {
          draft.invoice_id = params.invoice_id
        })
      }
    })
  }, [])

  const handleViewDetail = () => {
    if (invoice_id) {
      // 跳转到开票详情页面
      Taro.redirectTo({
        url: `/subpages/trade/invoice-detail?invoice_id=${invoice_id}`
      })
    } else {
      Taro.navigateBack()
    }
  }

  return (
    <SpPage className='page-invoice-success'>
      <View className='page-invoice-success__content'>
        <View className='page-invoice-success__icon'>
          <SpImage src='fv_invoice_success.png' width={80} height={80} />
        </View>

        <View className='page-invoice-success__title'>开票申请提交成功</View>

        <View className='page-invoice-success__desc'>
          您的开票申请已成功提交，我们将在72小时内发送至您的邮箱，请注意查收。
        </View>

        <View className='page-invoice-success__button' onClick={handleViewDetail}>
          {invoice_id ? '查看开票详情' : '返回发票中心'}
        </View>
      </View>
    </SpPage>
  )
}

InvoiceSuccess.options = {
  addGlobalClass: true
}

export default InvoiceSuccess
