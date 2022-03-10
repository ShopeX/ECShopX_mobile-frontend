// 组合促销
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { AtButton } from 'taro-ui'
import { View, Text } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { SpPage, SpLogin, SpScrollView, SpPrice } from '@/components'
import { addCart, updateCount } from '@/store/slices/cart'
import { showToast, log } from '@/utils'
import api from '@/api'
import CompPackageItem from './comps/comp-packageitem'

import './package-list.scss'

const initialState = {
  list: []
}

function PackageList(props) {
  const $instance = getCurrentInstance()
  const { id, distributor_id } = $instance.router.params
  const dispatch = useDispatch()
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
    list.forEach((item) => {
      item.packageTotalPrice = 0
      item.packageData = {
        itemId: null,
        sitemIds: []
      }
    })
    setState((draft) => {
      draft.list = list
    })

    return {
      total
    }
  }

  const onChangePackageItem = (index, { itemId, sitemIds, packageTotalPrice }) => {
    // console.log('onChangePackageItem:', item)
    setState((draft) => {
      draft.list[index].packageTotalPrice = packageTotalPrice
      draft.list[index].packageData = {
        itemId,
        sitemIds
      }
    })
  }

  const handleAddCart = async (index) => {
    if (!list[index].packageData.itemId) {
      showToast('请选择主商品规格')
      return
    }
    if (list[index].packageData.sitemIds.length == 0) {
      showToast('请选择可选商品')
      return
    }
    const fd = list[index].packageData.sitemIds.findIndex((item) => !item)
    if (fd > -1) {
      showToast('可选商品未选择规格')
      return
    }
    log.debug(`packageData: ${JSON.stringify(list[index].packageData)}`)
    const { itemId, sitemIds } = list[index].packageData
    await dispatch(
      addCart({
        isAccumulate: false,
        item_id: itemId,
        items_id: sitemIds,
        num: 1,
        shop_type: 'distributor',
        activity_id: list[index].package_id,
        activity_type: 'package',
        distributor_id: distributor_id
      })
    )
    await dispatch(updateCount({ shop_type: 'distributor' }))
    // showToast('成功加入购物车')
  }

  return (
    <SpPage className='page-marketing-packagelist'>
      <SpScrollView fetch={fetch}>
        {list.map((item, index) => (
          <View className='package-item'>
            <View className='package-item-hd'>
              <Text className='package-item-title'>{item.package_name}</Text>
            </View>
            <View className='package-item-bd'>
              <CompPackageItem info={item} onChange={onChangePackageItem.bind(this, index)} />
            </View>
            <View className='package-item-ft'>
              <View>
                组合价：<SpPrice value={item.packageTotalPrice}></SpPrice>
              </View>
              <View className='btn-wrap'>
                <SpLogin onChange={handleAddCart.bind(this, index)}>
                  <AtButton type='primary' circle>
                    加入购物车
                  </AtButton>
                </SpLogin>
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
