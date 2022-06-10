import React, { useEffect } from 'react'
import Taro, { getCurrentInstance, useDidShow } from '@tarojs/taro'
import { ScrollView, View, RichText } from '@tarojs/components'
import { SpPage, SpLoading } from '@/components'
import { classNames, isWeixin } from '@/utils'
import CompHeader from './comps/comp-header'
import { useImmer } from 'use-immer'
import api from '@/api'
import './brand-info.scss'

const initialState = {
  storeInfo: {},
  fav: ''
}

const PageBrandInfo = () => {
  const [state, setState] = useImmer(initialState)

  const $instance = getCurrentInstance()

  const { storeInfo, fav } = state

  const {
    params: { distributor_id }
  } = $instance.router

  const getDetail = async () => {
    const {
      name,
      logo,
      scoreList,
      distributor_id: id,
      introduce,
      sales_count
    } = await api.shop.getShop({
      distributor_id,
      show_score: 1,
      show_marketing_activity: 1,
      show_sales_count: 1
    })
    setState((_state) => {
      _state.storeInfo = {
        name,
        brand: logo,
        scoreList,
        distributor_id: id,
        introduce,
        sales_count
      }
    })
  }

  const storeFav = async (id) => {
    const { is_fav } = await api.member.storeIsFav(id)

    setState((state) => {
      state.fav = is_fav
    })
  }

  useEffect(() => {
    getDetail()
    storeFav(distributor_id)
  }, [])

  const changeInt = storeInfo.introduce?.replaceAll('\n', '<br/>')

  let nodes = [
    {
      name: 'div',
      attrs: {
        class: 'content'
      },
      children: [
        {
          type: 'text',
          //text: storeInfo.introduce?.split('\n').reduce((total,cur)=>total+`<div>${cur}</div>`)
          text: storeInfo.introduce
        }
      ]
    }
  ]

  return (
    <SpPage className={classNames('page-store-brand')}>
      <ScrollView className='page-store-brand-scrollview' scrollY>
        <View className='margin'>
          <CompHeader info={storeInfo} brand={false} fav={fav} showSale />
        </View>
        <View className='margin padding brand'>
          <View className='title'>品牌简介</View>
          <View className='content'>
            {isWeixin ? (
              <RichText nodes={changeInt} type='node' />
            ) : (
              <View dangerouslySetInnerHTML={{ __html: changeInt }}></View>
            )}
          </View>
        </View>
        <View className='margin good'>
          <View className='title' onClick={() => Taro.navigateBack()}>
            {'去看看全部商品 >'}
          </View>
        </View>
      </ScrollView>
    </SpPage>
  )
}

export default PageBrandInfo
