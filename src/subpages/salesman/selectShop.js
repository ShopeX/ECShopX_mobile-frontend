import Taro from '@tarojs/taro'
import { useEffect, useState, useCallback } from 'react'
import { Text, View } from '@tarojs/components'
import { classNames, validate, showToast } from '@/utils'
import { SpImage, SpPage, SpTabs, SpSearchInput,SpNavFilter } from '@/components'
import CompFilterBar from './comps/comp-filter-bar'
import { useImmer } from 'use-immer'
import api from '@/api'
import S from '@/spx'
import CompShopList from './comps/comp-shop-list'
import './selectShop.scss'

const initialConfigState = {
  codeStatus: false,
  address:{},
  basis:{},
  searchConditionList: [
    { label: '手机号', value: 'mobile' },
    { label: '店铺名称', value: 'name' }
  ],
}

const SelectShop = () => {
  const [state, setState] = useImmer(initialConfigState)

  const { searchConditionList ,codeStatus ,basis,address} = state

  return (
    <SpPage className={classNames('page-selectShop')}>
      <SpSearchInput
        placeholder='输入内容'
        isShowArea
        isShowSearchCondition
        searchConditionList={searchConditionList}
        onConfirm={(val) => {
          setState((draft) => {
            draft.basis = val
          })
        }}
        onSelectArea={(val) => {
          setState((draft) => {
            draft.address = val.value
          })
        }}
      />
      
      <CompShopList basis={basis} address={address} />
    </SpPage>
  )
}

export default SelectShop
