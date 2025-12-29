/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { SpFloatMenus, SpFloatMenuItem, SpFloatAd, SpImage } from '@/components'
import api from '@/api'
import S from '@/spx'
import { SG_SHARER_UID } from '@/consts'
import './comp-floatmenu.scss'

const initialState = {
  showStore: false,
  featuredShopId: null,
  salesPersonList: true
}
function CompFloatMenu(props) {
  const [state, setState] = useImmer(initialState)
  const { userInfo } = useSelector((state) => state.user)

  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    try {
      const distributionShopId = Taro.getStorageSync(SG_SHARER_UID)
      if (!S.getAuthToken() && !distributionShopId) {
        return
      }
      const param = {
        user_id: distributionShopId || userInfo?.user_id
      }
      const res = await api.distribution.info(param)

      const { user_id, is_valid = '', selfInfo = {}, parentInfo = {} } = res || {}
      let _userId
      if (is_valid) {
        _userId = user_id
      } else if (selfInfo?.is_valid) {
        _userId = selfInfo.user_id
      } else if (parentInfo?.is_valid) {
        _userId = parentInfo.user_id
      }
      if (_userId) {
        setState((draft) => {
          draft.showStore = true
          draft.featuredShopId = _userId
          draft.salesPersonList = userInfo.salesPersonList?.total_count > 0 ? false : true
        })
      }
    } catch (error) {
      // 静默处理错误，避免影响首页正常显示
      console.error('CompFloatMenu fetch error:', error)
    }
  }

  return (
    <View className='comp-floatmenu'>
      <SpFloatAd />

      {/* 店铺精选 */}
      {state.showStore && state.salesPersonList && (
        <SpImage
          className='my-store'
          src='gift_mini.png'
          onClick={() => {
            Taro.navigateTo({
              url: `/marketing/pages/distribution/shop-home?featuredshop=${state.featuredShopId}`
            })
          }}
        />
      )}

      {/* 店务入口 */}
      {/* <SpImage
        className='my-store'
        src='dianwu_entry.png'
        onClick={() => {
          Taro.navigateTo({
            url: `/marketing/pages/distribution/shop-home?featuredshop=${state.featuredShopId}`
          })
        }}
        width={120}
        height={120}
      /> */}
    </View>
  )
}

CompFloatMenu.options = {
  addGlobalClass: true
}

export default CompFloatMenu
