/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro, { getCurrentInstance, useRouter, useEffect } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import './index.scss'

function FilterBar(props) {
  const { current, tab, onTabClick } = props

  const handleTabClick = (i) => {
    onTabClick(i)
  }

  return (
    <View className='filter-bar'>
      <AtTabs current={current} scroll tabList={tab} onClick={handleTabClick}>
        {tab?.map((item, index) => {
          return <AtTabsPane current={current} index={index}></AtTabsPane>
        })}
      </AtTabs>
    </View>
  )
}

export default FilterBar
