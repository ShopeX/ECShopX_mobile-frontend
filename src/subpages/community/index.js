import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpPage, SpImage } from '@/components'
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
    link: '/subpages/dianwu/index'
  },
  {
    key: 'dianwu',
    name: '我的活动',
    icon: 'm_menu_dianwu.png',
    link: '/subpages/dianwu/index'
  }
]

const Index = () => {
  return (
    <SpPage className='page-community-index' renderFooter={<CompTabbar />}>
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
            <View className='menu-item' key={`menu-item__${index}`}>
              <SpImage className='menu-image' src={item.icon} width={100} height={100} />
              <Text className='menu-name'>{item.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className='card-block'></View>

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
