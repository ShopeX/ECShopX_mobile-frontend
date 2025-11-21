/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
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
