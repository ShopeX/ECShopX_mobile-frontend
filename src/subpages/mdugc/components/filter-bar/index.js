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
