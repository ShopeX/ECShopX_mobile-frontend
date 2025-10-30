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
import { useEffect, useRef } from 'react'
import { classNames, formatTime } from '@/utils'
import { SpPage, SpSearchInput, SpScrollView } from '@/components'
import { useImmer } from 'use-immer'
import api from '@/api'
import CompShopList from './comps/comp-shop-list'
import './selectShop.scss'

const initialConfigState = {
  codeStatus: false,
  address: {},
  basis: {},
  searchConditionList: [
    { label: '手机号', value: 'mobile' },
    { label: '店铺名称', value: 'name' }
  ],
  list: []
}

const SelectShop = () => {
  const [state, setState] = useImmer(initialConfigState)

  const { searchConditionList, codeStatus, basis, address, list } = state
  const goodsRef = useRef()

  useEffect(() => {
    setState((draft) => {
      draft.list = []
    })
    goodsRef.current.reset()
  }, [basis, address])

  useDidShow(() => {
    setState((draft) => {
      draft.list = []
    })
    goodsRef.current.reset()
  })

  const fetch = async ({ pageIndex, pageSize }) => {
    let params = {
      page: pageIndex,
      page_size: pageSize,
      mobile: '',
      name: '',
      province: address[0],
      city: address[1],
      area: address[2]
    }
    params[basis.key] = basis.keywords

    const { total_count, list: lists } = await api.salesman.getSalespersonSalemanShopList(params)
    lists.map((item) => {
      item.updated = formatTime(item.updated * 1000, 'YYYY-MM-DD')
    })
    setState((draft) => {
      draft.list = [...list, ...lists]
    })
    return {
      total: total_count
    }
  }
  return (
    <SpPage className={classNames('page-selectShop')}>
      <SpSearchInput
        placeholder='输入内容'
        // isShowArea
        isShowSearchCondition
        searchConditionList={searchConditionList}
        onConfirm={(val) => {
          setState((draft) => {
            draft.basis = val
          })
        }}
        // onSelectArea={(val) => {
        //   setState((draft) => {
        //     draft.address = val.value
        //   })
        // }}
      />
      <SpScrollView auto={false} ref={goodsRef} fetch={fetch}>
        {list.map((item, index) => {
          return <CompShopList key={index} item={item} />
        })}
      </SpScrollView>
    </SpPage>
  )
}

export default SelectShop
