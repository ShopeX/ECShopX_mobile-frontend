import Taro from '@tarojs/taro'
import { useEffect, useState, useCallback } from 'react'
import { Text, View } from '@tarojs/components'
import { classNames, validate, showToast } from '@/utils'
import { SpImage, SpPage, SpTabs, SpSearchInput, SpNavFilter } from '@/components'
import CompFilterBar from './comps/comp-filter-bar'
import { useImmer } from 'use-immer'
import api from '@/api'
import S from '@/spx'
import CompPurchasingList from './comps/comp-purchasing-list'
import CompCar from './comps/comp-car'
import './purchasing.scss'

const initialConfigState = {
  codeStatus: false,
  navFilterList: [
    {
      key: 'tag_id',
      name: '标签',
      label: '标签',
      activeIndex: null,
      option: [
        { label: '最新', value: 1 },
        { label: '促销', value: 0 },
        { label: '最新', value: 1 },
        { label: '热门', value: 2 },
        { label: '秒杀', value: 3 },
        { label: 'VIP', value: 4 },
        { label: '清仓', value: 5 },
        { label: '儿童', value: 6 },
        { label: '中老年人', value: 7 },
        { label: '端午节', value: 8 },
        { label: '专属最强打工人的无敌福利', value: 9 }
      ]
    },
    {
      key: 'category',
      name: '分类',
      label: '分类',
      activeIndex: null,
      option: [
        { category_name: '全部', category_id: 'all' },
        {
          category_name: '男装',
          category_id: '1',
          children: [
            {
              category_name: '上衣',
              category_id: '3',
              children: [{ category_name: '卫衣', category_id: '4' }]
            }
          ]
        },
        { category_name: '女装', category_id: '2' }
      ]
    },
    {
      key: 'status',
      label: '状态',
      name: '状态',
      activeIndex: null,
      option: [
        { label: '有货', value: 1 },
        { label: '无货', value: 0 }
      ]
    }
  ],
  tag_id: '',
  category: '',
  status: ''
}

const Purchasing = () => {
  const [state, setState] = useImmer(initialConfigState)

  const { codeStatus, navFilterList, tag_id, category, status } = state

  const handleFilterChange = useCallback(
    async (key, value) => {
      console.log(789, key, value)
      setState((v) => {
        v[key] = value
      })
    },
    [tag_id, category, status]
  )

  return (
    <SpPage className={classNames('page-selectShop')} renderFooter={<CompCar />}>
      <SpSearchInput
        placeholder='输入内容'
        onConfirm={(val) => {
          console.log(666, val)
        }}
        onSelectArea={(val) => {
          console.log('666area', val)
        }}
      />
      <SpNavFilter info={navFilterList} onChange={handleFilterChange} />

      <CompPurchasingList />
    </SpPage>
  )
}

export default Purchasing
