import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { usePullDownRefresh, useRouter, useDidShow } from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View, Text, Image } from '@tarojs/components'
import { SpImage, SpPage, SpScrollView } from '@/components'
import './comp-customer-list.scss'

const initialState = {}

function CompCustomerList(props) {
  const [state, setState] = useImmer(initialState)
  const { items } = props
  const {} = state

  return (
    <View className='comp-customer-list'>
      <View className='comp-customer-list-scroll'>
        <View
          className='comp-customer-list-scroll-list'
          onClick={() => {
            Taro.navigateTo({
              url: `/subpages/salesman/selectShop`
            })
          }}
        >
          <SpImage src='https://img1.baidu.com/it/u=2258757342,2341804200&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1715792400&t=2c7ab1fef2e148eb141ea60f8e07baf0'></SpImage>
          <View className='details'>
            <View className='customer'>
              <View>
                <Text>**星</Text>
                <Text>（客户）</Text>
              </View>
              <Text>134****6542</Text>
            </View>
            <View className='source'>来源店铺：永辉超市闵行店</View>
            <View className='source'>绑定时间：2024-03-09</View>
          </View>
        </View>
      </View>
    </View>
  )
}

CompCustomerList.options = {
  addGlobalClass: true
}

export default CompCustomerList
