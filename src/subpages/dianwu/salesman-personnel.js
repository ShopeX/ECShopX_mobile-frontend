/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useMemo } from 'react'
import { useImmer } from 'use-immer'
import { View } from '@tarojs/components'
import { SpPage, SpTabs, SpSearchInput } from '@/components'
import { useNavigation } from '@/hooks'
import { useTranslation, $t, i18n } from '@/i18n'
import CompDeliverySalesman from './comps/comp-delivery-salesman'
import CompRankingSalesman from './comps/comp-ranking-salesman'
import './salesman-personnel.scss'

const initialState = {
  types: false,
  selectorCheckedIndex: 0,
  deliverylnformation: '',
  refreshData: false
}

function SalesmanPersonnel() {
  useTranslation()
  const [state, setState] = useImmer(initialState)
  const { types, deliverylnformation, selectorCheckedIndex, refreshData } = state

  const { setNavigationBarTitle } = useNavigation()

  const tabList = useMemo(
    () => [{ title: $t('e478adad.65aba9') }, { title: $t('e478adad.16f254') }],
    [i18n.language]
  )

  const searchConditionList = useMemo(
    () => [
      { label: $t('e478adad.8098e2'), value: 'mobile' },
      { label: $t('e478adad.60d045'), value: 'username' }
    ],
    [i18n.language]
  )

  useEffect(() => {
    const syncTitle = () => setNavigationBarTitle($t('28be819f.54d16d'))
    syncTitle()
    i18n.on('languageChanged', syncTitle)
    return () => i18n.off('languageChanged', syncTitle)
  }, [setNavigationBarTitle])

  const onDeliveryActionClick = (val) => {
    setState((draft) => {
      draft.selectorCheckedIndex = val.key == 'mobile' ? 1 : 0
      draft.deliverylnformation = val.keywords
      draft.refreshData = !draft.refreshData
    })
  }

  return (
    <SpPage className='page-dianwu-salesman-personnel' scrollToTopBtn>
      <View>
        <SpSearchInput
          placeholder={$t('e478adad.ec47d2')}
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
          <CompDeliverySalesman
            selectorCheckedIndex={selectorCheckedIndex}
            deliverylnformation={deliverylnformation}
            refreshData={refreshData}
          />
        ) : (
          <CompRankingSalesman
            selectorCheckedIndex={selectorCheckedIndex}
            deliverylnformation={deliverylnformation}
            refreshData={refreshData}
          />
        )}
      </View>
    </SpPage>
  )
}

SalesmanPersonnel.options = {
  addGlobalClass: true
}

export default SalesmanPersonnel
