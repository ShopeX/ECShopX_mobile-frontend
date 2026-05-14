/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import api from '@/api'
import * as shopDoc from '@/doc/shop'
import { View } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpPage, SpSearchInput, SpNote } from '@/components'
import { pickBy, onEventChannel, isWeixin, classNames } from '@/utils'
import { useTranslation, $t, ti } from '@/i18n'
import { useNavigation } from '@/hooks'
import './store-picker.scss'

const initialState = {
  keywords: '',
  list: null,
  refundStore: ''
}
function TradeStorePicker(props) {
  const { i18n } = useTranslation()
  const { setNavigationBarTitle } = useNavigation()
  const $instance = getCurrentInstance() || {}
  const [state, setState] = useImmer(initialState)
  const { keywords, list, refundStore } = state

  useEffect(() => {
    const syncTitle = () => setNavigationBarTitle($t('665105d6.26cad6'))
    syncTitle()
    i18n.on('languageChanged', syncTitle)
    return () => i18n.off('languageChanged', syncTitle)
  }, [setNavigationBarTitle, i18n])

  useEffect(() => {
    fetch()
  }, [keywords])

  const fetch = async () => {
    const { distributor_id, refund_store } = $instance?.router?.params
    let params = {
      distributor_id,
      distributor_name: keywords
    }
    if (isWeixin) {
      const { errMsg, longitude, latitude } = await Taro.getLocation({
        type: 'gcj02'
      })
      if (errMsg == 'getLocation:ok') {
        params = {
          ...params,
          lng: longitude,
          lat: latitude
        }
      }
    }

    const { list: _list } = await api.aftersales.getAfterSaleStoreList(params)
    setState((draft) => {
      draft.list = pickBy(_list, shopDoc.STORE_ITEM)
      draft.refundStore = refund_store
    })
  }

  const onSelectShopItem = (item) => {
    // onEventChannel('onEventPickerStore', item)
    Taro.eventCenter.trigger('onEventPickerStore', item)
    Taro.navigateBack()
  }
  console.log('refundStore:', refundStore)
  return (
    <SpPage
      className='page-trade-store-picker'
      renderFooter={
        <View className='btn-wrap'>
          <AtButton circle type='primary'>
            {$t('dbee0e5f.38cf16')}
          </AtButton>
        </View>
      }
    >
      <SpSearchInput
        placeholder={$t('dbee0e5f.2e6e19')}
        onConfirm={(val) => {
          setState((draft) => {
            draft.keywords = val
          })
        }}
      />
      <View>
        {list?.map((item, index) => (
          <View
            className={classNames('store-item', {
              'active': refundStore == item.address_id
            })}
            key={`store-item__${index}`}
            onClick={onSelectShopItem.bind(this, item)}
          >
            <View className='store-name'>{item.name}</View>
            <View className='store-address'>{`${item.province}${item.city}${item.area}${item.address}`}</View>
            <View className='store-connect'>{item.mobile}</View>
            <View className='ft-container'>
              <View className='store-time'>{ti('dbee0e5f.6b4b35', [item.hours])}</View>
              <View className='store-distance'>{item.distance}</View>
            </View>
          </View>
        ))}
        {list?.length == 0 && <SpNote icon title={$t('dbee0e5f.f1f45e')} />}
      </View>
    </SpPage>
  )
}

TradeStorePicker.options = {
  addGlobalClass: true
}

export default TradeStorePicker
