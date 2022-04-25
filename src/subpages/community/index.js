import React, { Component, useEffect } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { useImmer } from 'use-immer'
import { useSelector } from 'react-redux'
import { View, Text } from '@tarojs/components'
import { SpPage, SpImage } from '@/components'
import { AtInput, AtTabs, AtTabsPane, AtSearchBar } from 'taro-ui'
import qs from 'qs'
import { log } from '@/utils'
import './index.scss'

import CompTabbar from './comps/comp-tabbar'
import CompGroupItem from './comps/comp-groupitem'

const MENUS = [
  {
    key: 'dianwu',
    name: '订单管理',
    icon: 'm_menu_dianwu.png',
    link: '/subpages/community/order-manage'
  },
  {
    key: 'dianwu',
    name: '我的活动',
    icon: 'm_menu_dianwu.png',
    link: '/subpages/community/activity'
  },
  {
    key: 'dianwu',
    name: '一键开团',
    icon: 'm_menu_dianwu.png',
    link: '/subpages/community/group'
  }
]

const tabList = [
  { title: '全部', type: '0' },
  { title: '跟团中', type: '1' },
  { title: '预览中', type: '2' },
  { title: '未开始', type: '3' },
  { title: '已结束', type: '4' }
]

const initialState = {
  curTabIdx: 0,
  searchValue: ''
}

const Index = () => {
  const [state, setState] = useImmer(initialState)
  const { chiefInfo, checkIsChief } = useSelector((state) => state.user)
  const { curTabIdx, searchValue } = state

  console.log(checkIsChief, chiefInfo, '---state.user----')

  // useEffect(() => {
  //   if (checkIsChief) {
  //     MENUS.unshift({
  //       key: 'dianwu',
  //       name: '订单管理',
  //       icon: 'm_menu_dianwu.png',
  //       link: '/subpages/community/order-manage'
  //     })
  //   }
  // }, [checkIsChief])

  const handleClickTab = (curTabIdx) => {
    setState((draft) => {
      draft.curTabIdx = curTabIdx
    })
  }

  const onSearchChange = (value) => {
    setState((draft) => {
      draft.searchValue = value
    })
  }

  return (
    <SpPage className='page-community-index'>
      <View className='page-header'>
        <View className='user-info'>
          <SpImage width={120} height={120} />
          <Text className='user-name'>xxx</Text>
        </View>
      </View>

      <View className='card-block'>
        <View className='card-block-hd'>团长功能</View>
        <View className='card-block-bd menu-list'>
          {MENUS.map((item, index) => (
            <View
              className='menu-item'
              onClick={() => Taro.navigateTo({ url: item.link })}
              key={`menu-item__${index}`}
            >
              <SpImage className='menu-image' src={item.icon} width={100} height={100} />
              <Text className='menu-name'>{item.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className='card-block'>
        <View className='search-wrap'>
          <AtSearchBar value={searchValue} onChange={onSearchChange} />
        </View>
        <View className='group-state-list'>
          <AtTabs current={curTabIdx} tabList={tabList} onClick={handleClickTab}>
            {tabList.map((panes, pIdx) => (
              <AtTabsPane current={curTabIdx} key={panes.status} index={pIdx}></AtTabsPane>
            ))}
          </AtTabs>
        </View>
      </View>

      <View className='group-list'>
        {[1, 2, 3].map((item) => (
          <View className='card-block'>
            <CompGroupItem />
          </View>
        ))}
      </View>
    </SpPage>
  )
}

export default Index
