import React, { useEffect, useRef } from 'react'
import { useImmer } from 'use-immer'
import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import api from '@/api'
import { View, Text, Image } from '@tarojs/components'
import { SpImage, SpScrollView, SpPrice } from '@/components'
import CompInvitationCode from './comp-invitation-code'
import './comp-purchasing-list.scss'

const initialState = {
  list: [],
  codeStatus: false
}

function CompPurchasingList(props) {
  const [state, setState] = useImmer(initialState)
  const { list, codeStatus } = state
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
    <View className='comp-purchasing-list'>
      <SpScrollView auto={false} ref={goodsRef} fetch={fetch}>
        <View className='comp-purchasing-list-item'>
          <SpImage src='https://img2.baidu.com/it/u=3227619927,365499885&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1715965200&t=660d198a9636f02a2f0f591142128c1a' />
          <View className='details'>
            <View>卡游 奥特曼卡片豪华WCR卡GP卡SP金卡卡游 奥特曼卡片豪华WCR卡GP卡SP金卡</View>
            <View className='new'>新品</View>
            <View>
              <SpPrice className='current' value={100} size={30} />
              <SpPrice lineThrough value={100} size={26} />
            </View>
            <View className='selector'>
              <View>
                <View className='selector-delivery'>
                  <Text>库存: </Text>
                  <Text>99</Text>
                </View>
                <View className='selector-delivery'>
                  <Text>货号: </Text>
                  <Text>G1245512FFW88</Text>
                </View>
              </View>
              <View className='increase'>+</View>
            </View>
          </View>
        </View>

        <View className='comp-purchasing-list-item'>
          <SpImage src='https://img2.baidu.com/it/u=3227619927,365499885&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1715965200&t=660d198a9636f02a2f0f591142128c1a' />
          <View className='details'>
            <View>卡游 奥特曼卡片豪华WCR卡GP卡SP金卡卡游 奥特曼卡片豪华WCR卡GP卡SP金卡</View>
            <View className='new'>新品</View>
            <View>
              <SpPrice className='current' value={100} size={30} />
              <SpPrice lineThrough value={100} size={26} />
            </View>
            <View className='selector'>
              <View>
                <View className='selector-delivery'>
                  <Text>库存: </Text>
                  <Text>99</Text>
                </View>
                <View className='selector-delivery'>
                  <Text>货号: </Text>
                  <Text>G1245512FFW88</Text>
                </View>
              </View>
              <View className='increase'>+</View>
            </View>
          </View>
        </View>

        <View className='comp-purchasing-list-item'>
          <SpImage src='https://img2.baidu.com/it/u=3227619927,365499885&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1715965200&t=660d198a9636f02a2f0f591142128c1a' />
          <View className='details'>
            <View>卡游 奥特曼卡片豪华WCR卡GP卡SP金卡卡游 奥特曼卡片豪华WCR卡GP卡SP金卡</View>
            <View className='new'>新品</View>
            <View>
              <SpPrice className='current' value={100} size={30} />
              <SpPrice lineThrough value={100} size={26} />
            </View>
            <View className='selector'>
              <View>
                <View className='selector-delivery'>
                  <Text>库存: </Text>
                  <Text>99</Text>
                </View>
                <View className='selector-delivery'>
                  <Text>货号: </Text>
                  <Text>G1245512FFW88</Text>
                </View>
              </View>
              <View className='increase'>+</View>
            </View>
          </View>
        </View>
      </SpScrollView>
    </View>
  )
}

CompPurchasingList.options = {
  addGlobalClass: true
}

export default CompPurchasingList
