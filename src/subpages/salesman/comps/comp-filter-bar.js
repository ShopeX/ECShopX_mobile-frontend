/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { useMemo } from 'react'
import { View, Input } from '@tarojs/components'
import { classNames } from '@/utils'
import { SpAddress } from '@/components'
import { useImmer } from 'use-immer'
import { $t, useTranslation } from '@/i18n'
import './comp-filter-bar.scss'

const initialConfigState = {
  selectArea: [],
  searchCondition: 'phone',
  searchValue: '',
  isSpAddressOpened: false,
  searchConditionVis: false,
  type: 0
}

const Index = (props) => {
  const { i18n } = useTranslation()
  const [state, setState] = useImmer(initialConfigState)

  const searchConditionList = useMemo(
    () => [
      { label: $t('9696edd5.8098e2'), value: 'phone' },
      { label: $t('5663b3fe.83b0d2'), value: 'custonmerName' }
    ],
    [i18n.language]
  )

  const { selectArea, searchValue, searchCondition, isSpAddressOpened, searchConditionVis } = state

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
        <View className='area-val'>{selectArea.join('') || $t('5663b3fe.f26489')}</View>
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
          placeholder={$t('5663b3fe.02cc4f')}
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
