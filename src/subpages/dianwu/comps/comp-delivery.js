import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View, Text } from '@tarojs/components'
import { SpImage, SpPage, SpScrollView } from '@/components'
import './comp-delivery.scss'

const initialState = {}

function CompDelivery(props) {
  const [state, setState] = useImmer(initialState)
  const {} = state

  const fetch = () => {}
  return (
    <View className='comp-delivery'>
      <SpScrollView className='comp-delivery-scroll' auto={false} fetch={fetch}>
        <View className='comp-delivery-scroll-list'>
          <View className='name'>
            <View>张三</View>
            <View className='edit'>
              <Text className='iconfont icon-bianji1'></Text>
              编辑
            </View>
          </View>
          <View>
            <View className='information'>
              <Text className='information-tltle'>手机号</Text>
              <Text>13487666533</Text>
            </View>
            <View className='information'>
              <Text className='information-tltle'>编码</Text>
              <Text>46564564</Text>
            </View>
            <View className='information'>
              <Text className='information-tltle'>每单配送费</Text>
              <Text>2%</Text>
            </View>
            <View className='information'>
              <Text className='information-tltle'>配送员属性</Text>
              <Text>全职</Text>
            </View>
            <View className='information'>
              <Text className='information-tltle'>创建时间</Text>
              <Text>2024-01-20 14:00</Text>
            </View>
          </View>
        </View>
      </SpScrollView>
      <View
        className='comp-delivery-scroll-establish'
        onClick={() => {
          Taro.navigateTo({
            url: '/subpages/dianwu/edit-deliveryman'
          })
        }}
      >
        <View>创建配送员</View>
      </View>
    </View>
  )
}

CompDelivery.options = {
  addGlobalClass: true
}

export default CompDelivery
