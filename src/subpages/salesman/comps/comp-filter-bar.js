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
import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { Text, View, Input } from '@tarojs/components'
import { classNames, validate, showToast } from '@/utils'
import { SpAddress } from '@/components'
import { useImmer } from 'use-immer'
import api from '@/api'
import S from '@/spx'
import './comp-filter-bar.scss'

const initialConfigState = {
  searchConditionList: [
    { label: '手机号', value: 'phone' },
    { label: '客户名称', value: 'custonmerName' }
  ],
  selectArea: [],
  searchCondition: 'phone',
  searchValue: '',
  isSpAddressOpened: false,
  searchConditionVis: false,
  type: 0
}

const Index = (props) => {
  const [state, setState] = useImmer(initialConfigState)

  const {
    selectArea,
    searchValue,
    searchCondition,
    isSpAddressOpened,
    searchConditionVis,
    searchConditionList
  } = state

  const { searchChange } = props

  const onInputChange = () => {}

  const onConfirmSearch = () => {
    searchChange && searchChange({ type: 'search', value: searchValue })
    // console.log('==============',{type:'search',value:searchValue});
  }

  // 省市区切换
  const onPickerChange = ([{ label: province }, { label: city }, { label: area }]) => {
    setState((draft) => {
      draft.selectArea = [province, city, area]
    })
    searchChange && searchChange({ type: 'area', value: [province, city, area] })
    // console.log('==============',{type:'area',value:[province, city, area]});
  }

  const getSearchConditionLabel = () => {
    return searchConditionList.find((item) => item.value == searchCondition).label
  }

  const handleConditionChange = (value) => {
    setState((draft) => {
      ;(draft.searchCondition = value), (draft.searchConditionVis = false), (draft.searchValue = '')
    })
  }

  return (
    <View className='comp-filter-bar'>
      <View
        className='area'
        onClick={() => {
          setState((draft) => {
            draft.isSpAddressOpened = true
          })
        }}
      >
        <View className='area-val'>{selectArea.join('') || '请选择区域'}</View>
        <View className='iconfont icon-arrowDown area-icon'></View>
      </View>
      <View className='search'>
        <View
          className='search-condition'
          onClick={() => {
            setState((draft) => {
              draft.searchConditionVis = true
            })
          }}
        >
          {getSearchConditionLabel()}
          <View className='iconfont icon-arrowDown search-condition-icon'></View>
        </View>
        <Input
          className='search-input'
          placeholder='请输入'
          confirmType='search'
          value={searchValue}
          onInput={onInputChange}
          onConfirm={onConfirmSearch}
        />
      </View>
      {searchConditionVis && (
        <View className='condition-box'>
          <View className='condition-content'>
            {searchConditionList.map((item, index) => (
              <View
                className={classNames({
                  'condition-content-item': true,
                  'condition-active': item.value == searchCondition
                })}
                onClick={() => handleConditionChange(item.value)}
                key={index}
              >
                {item.label}
              </View>
            ))}
          </View>
        </View>
      )}

      <SpAddress
        isOpened={isSpAddressOpened}
        onClose={() => {
          setState((draft) => {
            draft.isSpAddressOpened = false
          })
        }}
        onChange={onPickerChange}
      />
    </View>
  )
}

export default Index
