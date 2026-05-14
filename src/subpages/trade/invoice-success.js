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
import { useTranslation, $t } from '@/i18n'
import { useNavigation } from '@/hooks'
import './invoice-success.scss'

const initialState = {
  invoice_id: ''
}

const InvoiceSuccess = () => {
  const { i18n } = useTranslation()
  const { setNavigationBarTitle } = useNavigation()
  const $router = useRouter()
  const [state, setState] = useImmer(initialState)
  const { invoice_id } = state

  useEffect(() => {
    const syncTitle = () => setNavigationBarTitle($t('46d2ac27.a5f23f'))
    syncTitle()
    i18n.on('languageChanged', syncTitle)
    return () => i18n.off('languageChanged', syncTitle)
  }, [setNavigationBarTitle, i18n])

  useEffect(() => {
    entryLaunch.getRouteParams($router?.params).then((params) => {
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

        <View className='page-invoice-success__title'>{$t('34cf9809.5fd123')}</View>

        <View className='page-invoice-success__desc'>{$t('34cf9809.370612')}</View>

        <View className='page-invoice-success__button' onClick={handleViewDetail}>
          {invoice_id ? $t('34cf9809.f4c950') : $t('34cf9809.4decfd')}
        </View>
      </View>
    </SpPage>
  )
}

InvoiceSuccess.options = {
  addGlobalClass: true
}

export default InvoiceSuccess
