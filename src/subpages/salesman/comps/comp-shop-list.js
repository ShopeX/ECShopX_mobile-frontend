import React, { useEffect, useRef } from 'react'
import { useImmer } from 'use-immer'
import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import api from '@/api'
import { View, Text, Image } from '@tarojs/components'
import { SpImage, SpScrollView } from '@/components'
import CompInvitationCode from './comp-invitation-code'
import './comp-shop-list.scss'

const initialState = {
  list: [],
  codeStatus: false,
  information: { name: 'cx', distributor_name: 'cx的店铺' }
}

function CompShopList(props) {
  const [state, setState] = useImmer(initialState)
  const { list, codeStatus, information } = state
  const { params } = useRouter()
  const { selectorCheckedIndex, deliverylnformation, refreshData } = props
  const goodsRef = useRef()

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
    <View className='comp-customer'>
      <SpScrollView auto={false} ref={goodsRef} fetch={fetch}>
        <View className='comp-customer-list'>
          <View className='comp-customer-list-scroll'>
            <View
              className='comp-customer-list-scroll-list'
              onClick={() => {
                Taro.navigateTo({
                  url: `/subpages/salesman/purchasing`
                })
              }}
            >
              <SpImage src='https://img1.baidu.com/it/u=2258757342,2341804200&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1715792400&t=2c7ab1fef2e148eb141ea60f8e07baf0'></SpImage>
              <View className='details'>
                <View className='customer'>徐家汇港汇恒隆旗舰店</View>
                <View className='source'>电话：13888888888</View>
                <View className='source'>地址：上海市徐汇区虹桥路1号</View>
                <View className='address'>
                  <Text>2024-09-02</Text>
                  <Text>北京市</Text>
                </View>
              </View>
            </View>
            <View
              className='comp-customer-list-scroll-store-code'
              onClick={() => {
                setState((draft) => {
                  draft.codeStatus = true
                })
              }}
            >
              <Text>查看店铺码</Text>
              <Text className='iconfont icon-qianwang-01'></Text>
            </View>
          </View>
        </View>
      </SpScrollView>
      {codeStatus && (
        <CompInvitationCode
          status
          information={information}
          cancel={() => {
            setState((draft) => {
              draft.codeStatus = false
            })
          }}
        />
      )}
    </View>
  )
}

CompShopList.options = {
  addGlobalClass: true
}

export default CompShopList
