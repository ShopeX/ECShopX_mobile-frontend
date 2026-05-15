/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useMemo } from 'react'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { SpPage, SpTabs, SpSearchInput } from '@/components'
import { $t, useTranslation } from '@/i18n'
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
  const { i18n } = useTranslation()
  const [state, setState] = useImmer(initialState)
  const { types, deliverylnformation, selectorCheckedIndex, refreshData } = state

  const tabList = useMemo(
    () => [{ title: $t('cbea12f3.65aba9') }, { title: $t('cbea12f3.a70540') }],
    [i18n.language]
  )

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('2ce57f0e.54d16d') })
  }, [i18n.language])

  const onDeliveryActionClick = (val) => {
    setState((draft) => {
      draft.selectorCheckedIndex = val.key == 'phone' ? 1 : 0
      draft.deliverylnformation = val.keywords
      draft.refreshData = !refreshData
    })
  }

  return (
    <SpPage className='page-dianwu-delivery-personnel' scrollToTopBtn>
      <View>
        <SpSearchInput
          placeholder={$t('9696edd5.ec47d2')}
          isShowSearchCondition
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
