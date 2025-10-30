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
import { Text, View } from '@tarojs/components'
import { classNames, validate, showToast } from '@/utils'
import { SpImage, SpPage } from '@/components'
import { useImmer } from 'use-immer'
import './card.scss'

const initialConfigState = {
  funcList: [
    { name: '订单管理', icon: 'present' },
    { name: '代客下单', icon: 'present' },
    { name: '业务员推广', icon: 'present' },
    { name: '商家列表', icon: 'present' }
  ]
}

const Card = () => {
  const [data, setData] = useImmer(initialConfigState)

  return (
    <SpPage className={classNames('page-card-index')} navbar={false}>
      <View className='card-box'>
        <View className='card-content'>
          <View className='name'>杨建梅</View>
          <View className='store'>上海太古汇店</View>
          <View className='qtr-box'>
            <image
              className='qtr-img'
              src='https://img0.baidu.com/it/u=3584759695,3470619884&fm=253&fmt=auto&app=138&f=GIF?w=198&h=198'
            />
          </View>
        </View>
      </View>
    </SpPage>
  )
}

export default Card
