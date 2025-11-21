/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
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
