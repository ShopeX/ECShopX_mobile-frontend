/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro, { useDidShow } from '@tarojs/taro'
import React, { useEffect, useMemo, useRef } from 'react'
import { classNames, pickBy } from '@/utils'
import { SpPage, SpTabs, SpSearchInput, SpScrollView } from '@/components'
import { useImmer } from 'use-immer'
import api from '@/api'
import { $t, useTranslation } from '@/i18n'
import CompCustomerList from './comps/comp-customer-list'
import './selectCustomer.scss'

const initialConfigState = {
  curTabIdx: 0,
  keywords: '',
  lists: [],
  parameter: {}
}

const SelectCustomer = () => {
  const { i18n } = useTranslation()
  const [state, setState] = useImmer(initialConfigState)

  const tabList = useMemo(
    () => [
      { title: $t('43d09756.6ad54f'), num: 0, type: 'buy' },
      { title: $t('43d09756.29a2da'), num: 0, type: 'not_buy' }
    ],
    [i18n.language]
  )

  const searchConditionList = useMemo(
    () => [
      { label: $t('90aaacd7.5b0f22'), value: 'userName' },
      { label: $t('90aaacd7.0d4934'), value: 'shopName' },
      { label: $t('90aaacd7.8098e2'), value: 'mobile' }
    ],
    [i18n.language]
  )

  const { curTabIdx, keywords, lists, parameter } = state

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('eab159ba.d736b9') })
  }, [i18n.language])
  const goodsRef = useRef()

  useEffect(() => {
    setState((draft) => {
      draft.lists = []
    })
    goodsRef.current.reset()
  }, [curTabIdx, parameter])

  useDidShow(() => {
    setState((draft) => {
      draft.lists = []
    })
    goodsRef.current.reset()
  })

  const handleClickTab = (idx) => {
    setState((draft) => {
      draft.curTabIdx = idx
      draft.lists = []
    })
  }

  const fetch = async ({ pageIndex, pageSize }) => {
    const query = {
      page: pageIndex,
      pageSize,
      buy_type: tabList[curTabIdx].type
    }
    query[parameter.key] = parameter.keywords

    const res = await api.distribution.subordinate(query)
    const { list, total_count } = res[query.buy_type]

    const nList = pickBy(list, {
      relationship_depth: 'relationship_depth',
      headimgurl: 'headimgurl',
      username: ({ username, nickname }) => nickname || username,
      is_open_promoter_grade: 'is_open_promoter_grade',
      promoter_grade_name: 'promoter_grade_name',
      mobile: 'mobile',
      bind_date: 'bind_date',
      name: 'name',
      user_id: 'user_id'
    })

    setState((draft) => {
      draft.lists = [...lists, ...nList]
    })

    return {
      total: total_count
    }
  }

  const handleConfirm = (val) => {
    setState((draft) => {
      draft.parameter = val
      draft.lists = []
    })
  }

  return (
    <SpPage className={classNames('page-SelectCustomer')}>
      <SpSearchInput
        placeholder={$t('9696edd5.ec47d2')}
        // isShowArea
        isShowSearchCondition
        searchConditionList={searchConditionList}
        onConfirm={(val) => {
          handleConfirm(val)
        }}
        // onSelectArea={(val) => {
        //   console.log('666area', val)
        // }}
      />
      <SpTabs
        current={curTabIdx}
        tablist={tabList}
        onChange={(e) => {
          setState((draft) => {
            draft.curTabIdx = e
          })
          handleClickTab(e)
        }}
      />
      <SpScrollView auto={false} ref={goodsRef} fetch={fetch}>
        {lists.map((item, index) => {
          return <CompCustomerList key={index} items={item} />
        })}
        {/* <CompCustomerList /> */}
      </SpScrollView>
    </SpPage>
  )
}

export default SelectCustomer
