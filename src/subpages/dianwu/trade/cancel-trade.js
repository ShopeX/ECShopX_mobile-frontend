/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useMemo } from 'react'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { SpPage, SpButton, SpCell } from '@/components'
import { View, Text, Picker } from '@tarojs/components'
import { useTranslation, $t } from '@/i18n'
import { useNavigation } from '@/hooks'
import { REFUND_REASON_KEYS } from '../const/refund-reason-options'
import CompTradeInfo from './../comps/comp-trade-info'
import './cancel-trade.scss'

const initialState = {
  info: null,
  reason: ''
}

function DianwuTradeCancel(props) {
  const { i18n } = useTranslation()
  const { setNavigationBarTitle } = useNavigation()
  const $instance = getCurrentInstance() || {}
  const [state, setState] = useImmer(initialState)
  const { info, reason } = state

  useEffect(() => {
    const syncTitle = () => setNavigationBarTitle($t('97e9afa9.b21b5e'))
    syncTitle()
    i18n.on('languageChanged', syncTitle)
    return () => i18n.off('languageChanged', syncTitle)
  }, [setNavigationBarTitle, i18n])

  const reasonPickerRange = useMemo(() => REFUND_REASON_KEYS.map((k) => $t(k)), [i18n.language])

  const onCancel = () => {
    Taro.navigateBack()
  }

  const onConfirm = async () => {
    const { order_status } = info
    let type = 1
    if (order_status == 'NOTPAY') {
      type = 1
    } else if (order_status == 'PAYED') {
      type = 2
    }
    Taro.redirectTo({ url: `/subpages/dianwu/trade/result?type=${type}` })
  }

  const reasonDisplayText =
    reason !== '' && reason !== undefined && reason !== null
      ? $t(REFUND_REASON_KEYS[Number(reason)])
      : $t('c3455657.cf234c')

  return (
    <SpPage
      className='page-dianwu-cancel-trade'
      renderFooter={
        <View className='btn-wrap'>
          <SpButton confirmText={$t('c3455657.939d53')} onReset={onCancel} onConfirm={onConfirm} />
        </View>
      }
    >
      <View className='trade-tip'>{$t('e273d524.b11ce9')}</View>

      <CompTradeInfo
        onFetch={(data) => {
          setState((draft) => {
            draft.info = data
          })
        }}
      />

      <View className='picker-reason'>
        <View className='title'>{$t('e273d524.4a3df6')}</View>
        <Picker
          mode='selector'
          range={reasonPickerRange}
          onChange={(e) => {
            setState((draft) => {
              draft.reason = e.detail.value
            })
          }}
        >
          <SpCell className='reason-container' isLink>
            <Text>{reasonDisplayText}</Text>
          </SpCell>
        </Picker>
      </View>
    </SpPage>
  )
}

DianwuTradeCancel.options = {
  addGlobalClass: true
}

export default DianwuTradeCancel
