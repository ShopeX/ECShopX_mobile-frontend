import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { usePullDownRefresh, useRouter, useDidShow } from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View, Text, Image } from '@tarojs/components'
import { SpImage, SpPage, SpScrollView } from '@/components'
import './comp-customer-list.scss'

const initialState = {
  list: []
}

function CompCustomerList(props) {
  const [state, setState] = useImmer(initialState)
  const { params } = useRouter()
  const { selectorCheckedIndex, deliverylnformation, refreshData } = props
  const goodsRef = useRef()
  const { list } = state

  useEffect(() => {
    setState((draft) => {
      draft.list = []
    })
    goodsRef.current.reset()
  }, [refreshData])

  useDidShow(() => {
    setState((draft) => {
      draft.list = []
    })
    goodsRef.current.reset()
  })

  const fetch = async ({ pageIndex, pageSize }) => {
    // return {
    //   total: total_count
    // }
  }
  return (
    <View className='comp-customer-list'>
      <SpScrollView auto={false} ref={goodsRef} fetch={fetch}>
        <View className='comp-customer-list-scroll'>
          {/* {list.map((item, index) => {
            return (
              <View className='comp-customer-list-scroll-list' key={index}>
                
              </View>
            )
          })} */}
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
      </SpScrollView>
    </View>
  )
}

CompCustomerList.options = {
  addGlobalClass: true
}

export default CompCustomerList
