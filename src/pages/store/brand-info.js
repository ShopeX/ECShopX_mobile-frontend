import React, { useEffect } from 'react'
import Taro, { getCurrentInstance, useDidShow } from '@tarojs/taro'
import { ScrollView, View, Text } from '@tarojs/components'
import { SpPage, SpLoading } from '@/components'
import { classNames, JumpPageIndex } from '@/utils'
import CompHeader from './comps/comp-header'
import { useImmer } from 'use-immer'
import api from '@/api'
import './brand-info.scss'

const initialState = {
  storeInfo: {}
}

const PageBrandInfo = () => {
  const [state, setState] = useImmer(initialState)

  const $instance = getCurrentInstance()

  const {
    params: { distributor_id }
  } = $instance.router

  const getDetail = async () => {
    const {
      name,
      logo,
      scoreList,
      distributor_id: id,
      introduce
    } = await api.shop.getShop({
      distributor_id,
      show_score: 1,
      show_marketing_activity: 1
    })
    setState((_state) => {
      _state.storeInfo = {
        name,
        brand: logo,
        scoreList,
        distributor_id: id,
        introduce
      }
    })
  }

  useEffect(() => {
    getDetail()
  }, [])

  const { storeInfo } = state

  return (
    <SpPage className={classNames('page-store-brand')}>
      <ScrollView className='page-store-brand-scrollview' scrollY>
        <View className='margin'>
          <CompHeader info={storeInfo} brand={false} />
        </View>
        <View className='margin padding brand'>
          <View className='title'>品牌简介</View>
          <View className='content'>{storeInfo.introduce || '无'}</View>
        </View>
        <View className='margin good'>
          <View className='title' onClick={JumpPageIndex}>
            {'去看看全部商品 >'}
          </View>
        </View>
      </ScrollView>
    </SpPage>
  )
}

export default PageBrandInfo
