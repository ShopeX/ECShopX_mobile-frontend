/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useMemo } from 'react'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { SpPage, SpTabs, SpSearchInput } from '@/components'
import { useTranslation, $t, i18n } from '@/i18n'
import CompDelivery from './comps/comp-delivery'
import CompRanking from './comps/comp-ranking'
import './delivery-personnel.scss'

const initialState = {
  types: false,
  selectorCheckedIndex: 0,
  deliverylnformation: '',
  refreshData: false
}

function DeliveryPersonnel() {
  useTranslation()

  useEffect(() => {
    const syncNavTitle = () => {
      Taro.setNavigationBarTitle({ title: $t('468bf441.1a05d5') })
    }
    syncNavTitle()
    i18n.on('languageChanged', syncNavTitle)
    return () => i18n.off('languageChanged', syncNavTitle)
  }, [])

  const tabList = useMemo(
    () => [{ title: $t('468bf441.d15348') }, { title: $t('468bf441.945b01') }],
    [i18n.language]
  )

  const searchConditionList = useMemo(
    () => [
      { label: $t('468bf441.8098e2'), value: 'mobile' },
      { label: $t('468bf441.83b0d2'), value: 'username' }
    ],
    [i18n.language]
  )

  const [state, setState] = useImmer(initialState)
  const { types, deliverylnformation, selectorCheckedIndex, refreshData } = state

  const onDeliveryActionClick = (val) => {
    setState((draft) => {
      draft.selectorCheckedIndex = val.key == 'mobile' ? 1 : 0
      draft.deliverylnformation = val.keywords
      draft.refreshData = !refreshData
    })
  }

  return (
    <SpPage className='page-dianwu-delivery-personnel' scrollToTopBtn>
      <View>
        <SpSearchInput
          placeholder={$t('468bf441.ec47d2')}
          isShowSearchCondition
          searchConditionList={searchConditionList}
          onConfirm={(val) => {
            onDeliveryActionClick(val)
          }}
        />

        <SpTabs
          current={types}
          tablist={tabList}
          onChange={(e) => {
            setState((draft) => {
              draft.types = e
            })
          }}
        />

        {!types ? (
          <CompDelivery
            selectorCheckedIndex={selectorCheckedIndex}
            deliverylnformation={deliverylnformation}
            refreshData={refreshData}
          />
        ) : (
          <CompRanking
            selectorCheckedIndex={selectorCheckedIndex}
            deliverylnformation={deliverylnformation}
            refreshData={refreshData}
          />
        )}
      </View>
    </SpPage>
  )
}

DeliveryPersonnel.options = {
  addGlobalClass: true
}

export default DeliveryPersonnel
