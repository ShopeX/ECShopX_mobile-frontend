import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance, useDidShow } from '@tarojs/taro'
import { AtButton, AtTabs, AtTabsPane, AtSearchBar } from 'taro-ui'
import api from '@/api'
import { View, Text, Picker } from '@tarojs/components'
import {
  SpPage,
  SpTime,
  SpScrollView,
  SpPrice,
  SpImage,
  SpSearchInput,
  SpVipLabel
} from '@/components'
import { classNames, pickBy, showToast } from '@/utils'
import './comp-ranking.scss'

const initialState = {
  indess: 0
}


const onTimeChange = (val,ele) => {
  console.log(val,ele,'val,ele===');
}

function CompRanking() {
  const [state, setState] = useImmer(initialState)
  const { indess } = state

  return (
    <View className='page-dianwu-comp-ranking'>
      <SpTime onTimeChange={onTimeChange} />

      <View className='comp-ranking-list'>
        <View className='comp-ranking-list-item comp-ranking-list-title'>
          <Text>排名</Text>
          <Text>配送员</Text>
          <Text>订单额(元)</Text>
          <Text>配送订单量(单)</Text>
          <Text>配送费用(元)</Text>
        </View>
        <View
          className={classNames(
            'comp-ranking-list-item',
            indess == 0 ? 'one' : indess == 1 ? 'two' : indess == 2 ? 'three' : ''
          )}
        >
          <Text>1</Text>
          <Text>张三三</Text>
          <Text>100000</Text>
          <Text>100000</Text>
          <Text>100000</Text>
        </View>
        <View className='launch'>
          <Text>展开更多</Text>
          <Text className='iconfont icon-arrowDown'></Text>
        </View>
      </View>
    </View>
  )
}

CompRanking.options = {
  addGlobalClass: true
}

export default CompRanking
