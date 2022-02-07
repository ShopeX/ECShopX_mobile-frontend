// 组合促销
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { AtButton } from 'taro-ui'
import { View, Text } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { SpPage, SpGoodsCell, SpScrollView, SpPrice } from '@/components'
import api from '@/api'
import CompPackageItem from './comps/comp-packageitem'

import './package-list.scss'

const initialState = {
  list: []
}

function PackageList (props) {
  const $instance = getCurrentInstance()
  const { id, distributor_id } = $instance.router.params

  const [state, setState] = useImmer(initialState)
  const { list } = state
  // useEffect(() => {
  //   fetch()
  // }, [])

  const fetch = async (params) => {
    const { pageIndex: page, pageSize } = params
    const { list, total_count: total } = await api.item.packageList({
      item_id: id,
      page,
      pageSize
    })

    setState((draft) => {
      draft.list = list
    })

    return {
      total
    }
  }

  const handleAddCart = () => {}

  return (
    <SpPage className='page-marketing-packagelist'>
      <SpScrollView fetch={fetch}>
        {list.map((item) => (
          <View className='package-item'>
            <View className='package-item-hd'>
              <Text className='package-item-title'>{item.package_name}</Text>
            </View>
            <View className='package-item-bd'>
              <CompPackageItem info={item} />
            </View>
            <View className='package-item-ft'>
              <View>
                组合价：<SpPrice value={100}></SpPrice>
              </View>
              <View className='btn-wrap'>
                <AtButton type='primary' circle onClick={handleAddCart}>
                  加入购物车
                </AtButton>
              </View>
            </View>
          </View>
        ))}
      </SpScrollView>
    </SpPage>
  )
}

PackageList.options = {
  addGlobalClass: true
}

export default PackageList
