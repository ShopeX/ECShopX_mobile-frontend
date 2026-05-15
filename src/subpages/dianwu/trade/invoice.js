/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { SpPage } from '@/components'
import { View } from '@tarojs/components'
import { useImmer } from 'use-immer'
import * as dianwuApi from '@/api/dianwu'
import { useTranslation, $t, ti, i18n } from '@/i18n'
import { useNavigation } from '@/hooks'
import './invoice.scss'

const initialState = {
  billInfo: null,
  realFee: '0.00',
  isInvoiced: false
}
function DianWuInvoice() {
  useTranslation()
  const { setNavigationBarTitle } = useNavigation()
  const $instance = getCurrentInstance() || {}
  const [state, setState] = useImmer(initialState)
  const { billInfo, realFee, isInvoiced } = state
  const { trade_id } = $instance?.router?.params

  useEffect(() => {
    const syncTitle = () => setNavigationBarTitle($t('f19fda67.2b2a4c'))
    syncTitle()
    i18n.on('languageChanged', syncTitle)
    return () => i18n.off('languageChanged', syncTitle)
  }, [setNavigationBarTitle])

  useEffect(() => {
    getBillInfo()
  }, [])
  async function getBillInfo() {
    const res = await dianwuApi.getTradeDetail(trade_id)
    const { orderInfo } = res
    setState((draft) => {
      draft.isInvoiced = orderInfo.is_invoiced
      draft.billInfo = orderInfo.invoice || null
      draft.realFee = (orderInfo.item_total_fee / 100).toFixed(2)
    })
  }
  const drawBill = async () => {
    if (isInvoiced) return
    const { confirm } = await Taro.showModal({
      content: $t('f7fffd22.3795e4'),
      cancelText: $t('61e2d21a.625fb2'),
      confirmText: $t('f7fffd22.ca4355')
    })
    if (confirm) {
      const { success } = await dianwuApi.openBill({
        order_id: trade_id,
        status: true
      })
      if (success) {
        wx.showToast({ title: $t('f7fffd22.186ded') })
        setState((draft) => {
          draft.isInvoiced = true
        })
      }
    }
  }
  const copyBill = () => {
    const bi = billInfo && typeof billInfo === 'object' ? billInfo : {}
    wx.setClipboardData({
      data: ti('f7fffd22.1d5601', [
        trade_id,
        realFee,
        bi.content ?? '',
        bi.registration_number ?? '',
        bi.company_address ?? '',
        bi.company_phone ?? '',
        bi.bankname ?? '',
        bi.bankaccount ?? ''
      ]),
      success: function () {
        return wx.showToast({ title: $t('f7fffd22.20a495') })
      }
    })
  }
  return (
    <SpPage className='page-dianwu-invoice'>
      <View className='dianwu-invoice-order-info'>
        <View className='line'>
          <View className='title'>{$t('f7fffd22.148237')}</View>
          <View className='content'>{trade_id}</View>
        </View>
        <View className='line'>
          <View className='title'>{$t('f7fffd22.c52f34')}</View>
          <View className='content'>{realFee}</View>
        </View>
      </View>
      <View className='dianwu-invoice-order-info'>
        <View className='line'>
          <View className='title'>{$t('f7fffd22.5b4786')}</View>
          <View className='content'>{billInfo?.content}</View>
        </View>
        <View className='line'>
          <View className='title'>{$t('f7fffd22.77a6ca')}</View>
          <View className='content'>{billInfo?.registration_number}</View>
        </View>
        <View className='line'>
          <View className='title'>{$t('f7fffd22.476cbb')}</View>
          <View className='content'>{billInfo?.company_address}</View>
        </View>
        <View className='line'>
          <View className='title'>{$t('f7fffd22.2e4fa4')}</View>
          <View className='content'>{billInfo?.company_phone}</View>
        </View>
        <View className='line'>
          <View className='title'>{$t('f7fffd22.a5791b')}</View>
          <View className='content'>{billInfo?.bankname}</View>
        </View>
        <View className='line'>
          <View className='title'>{$t('f7fffd22.e45af7')}</View>
          <View className='content'>{billInfo?.bankaccount}</View>
        </View>
      </View>
      <View className='dianwu-invoice-footer'>
        <View className='button copy' onClick={copyBill}>
          {$t('f7fffd22.948f13')}
        </View>
        <View className={`${isInvoiced ? 'button disable-btn' : 'button'}`} onClick={drawBill}>
          {$t('f7fffd22.ca4355')}
        </View>
      </View>
    </SpPage>
  )
}
DianWuInvoice.options = {
  addGlobalClass: true
}
export default DianWuInvoice
