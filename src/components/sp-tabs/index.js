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
import { View, Text } from '@tarojs/components'
import { connect } from 'react-redux'
import { classNames, navigateTo } from '@/utils'
import './index.scss'

function SpTabs(props) {
  let { tablist = [], current, onChange, children } = props

  console.log('current', current)

  return (
    <View className='sp-tabs'>
      <View className='sp-tabs-hd'>
        {tablist.map((tab, index) => (
          <View
            className={classNames({
              'tab-item': true,
              'tab-item-active': current == index
            })}
            key={`tab-item__${index}`}
            onClick={onChange.bind(this, index)}
          >
            {tab.icon && <Text className={classNames(`iconfont`, tab.icon)}></Text>}
            <Text className='name'>{tab.title}</Text>
          </View>
        ))}
      </View>
      <View className='sp-tabs-bd'>{children}</View>
    </View>
  )
}

export default SpTabs
