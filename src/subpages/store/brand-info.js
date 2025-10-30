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
import React, { useEffect } from 'react'
import Taro, { getCurrentInstance, useDidShow } from '@tarojs/taro'
import { ScrollView, View, RichText } from '@tarojs/components'
import { SpPage, SpLoading } from '@/components'
import { classNames, isWeixin } from '@/utils'
import { useImmer } from 'use-immer'
import api from '@/api'
import CompHeader from './comps/comp-header'
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
            去看看全部商品
          </View>
        </View>
      </ScrollView>
    </SpPage>
  )
}

export default PageBrandInfo
