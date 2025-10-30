// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
import Taro, { useDidShow } from '@tarojs/taro'
import React, { useEffect, useRef } from 'react'
import { classNames, pickBy } from '@/utils'
import { SpPage, SpTabs, SpSearchInput, SpScrollView } from '@/components'
import { useImmer } from 'use-immer'
import api from '@/api'
import CompCustomerList from './comps/comp-customer-list'
import './selectCustomer.scss'

const initialConfigState = {
  tabList: [
    { title: '已购买', num: 0, type: 'buy' },
    { title: '未购买', num: 0, type: 'not_buy' }
  ],
  searchConditionList: [
    { label: '会员名称', value: 'userName' },
    { label: '店铺名称', value: 'shopName' },
    { label: '手机号', value: 'mobile' }
  ],
  curTabIdx: 0,
  keywords: '',
  lists: [],
  parameter: {}
}

const SelectCustomer = () => {
  const [state, setState] = useImmer(initialConfigState)

  const { curTabIdx, tabList, keywords, lists, searchConditionList, parameter } = state
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
        placeholder='输入内容'
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
