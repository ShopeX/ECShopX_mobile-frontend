/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro, { useRouter } from '@tarojs/taro'
import React, { useRef, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import api from '@/api'
import { classNames, pickBy, getDistributorId, VERSION_IN_PURCHASE } from '@/utils'
import { useAsyncCallback, useLogin } from '@/hooks'
import { updateUserInfo } from '@/store/slices/user'
import {
  updatePurchaseShareInfo,
  updatePurchaseTabbar,
  updateActivityInfo,
  updateCount,
  updateValidIdentity
} from '@/store/slices/purchase'

import doc from '@/doc'
import S from '@/spx'
import {
  SpPage,
  SpNote,
  SpScrollView,
  SpSearchInput,
  SpFloatMenuItem,
  SpImage,
  SpTabs
} from '@/components'
import CompTabbar from './comps/comp-tabbar'
import './index.scss'

const initialState = {
  activityList: [],
  activity_name: '',
  currentIndex: 0,
  tabList: [
    { title: '全部', value: 0 },
    { title: '活动进行中', value: 1 },
    { title: '未开始', value: 2 },
    { title: '已结束', value: 3 }
  ],
  loading: true
}

function PurchaseActivityList() {
  const [state, setState] = useImmer(initialState)
  const { activityList, activity_name, tabList, currentIndex, loading } = state
  const { curEnterpriseId } = useSelector((_state) => _state.purchase)

  const scrollRef = useRef()
  const dispatch = useDispatch()

  const { params } = useRouter()
  let { activity_id, is_redirt } = params

  useEffect(() => {
    if (!S.getAuthToken()) {
      Taro.redirectTo({
        url: '/pages/purchase/auth'
      })
      return
    } else {
      verfiyActivityNums()
    }
  }, [])

  const verfiyActivityNums = async () => {
    if (VERSION_IN_PURCHASE) {
      // 纯内购没有企业进入认证首页
      const data = await api.purchase.getUserEnterprises({
        disabled: 0,
        distributor_id: getDistributorId()
      })
      const validIdentityLen = data.filter((item) => item.disabled == 0).length
      if (!validIdentityLen) {
        Taro.redirectTo({
          url: '/pages/purchase/auth'
        })
        return
      }
    }

    const { list, total_count } = await api.purchase.getEmployeeActivityList({
      page: 1,
      pageSize: 1,
      enterprise_id: curEnterpriseId,
      activity_id
    })

    // 如果只有一条数据，直接进入活动首页
    if (total_count == 1 && is_redirt) {
      const _list = pickBy(list, doc.purchase.ACTIVITY_ITEM)
      onClickChange(_list[0], 'redirectTo')
    } else {
      setState((draft) => {
        draft.loading = false
      })
      scrollRef.current.reset()
      //更新底部tabbar是否有身份切换
      // updateIdentity()
      updataMemberInfo()
    }
  }

  const updateIdentity = async () => {
    const data = await api.purchase.getUserEnterprises({
      disabled: 0,
      distributor_id: getDistributorId()
    })
    const hasValidIdentity = data.filter((item) => item.disabled == 0).length > 1
    //多个企业展示身份切换tab
    dispatch(updateValidIdentity(hasValidIdentity))
  }

  const updataMemberInfo = async () => {
    const _userInfo = await api.member.memberInfo()
    dispatch(updateUserInfo(_userInfo))
  }

  const fetch = async ({ pageIndex, pageSize }) => {
    // const type = tabList[currentIndex]?.value
    const { list, total_count } = await api.purchase.getEmployeeActivityList({
      page: pageIndex,
      pageSize,
      activity_name,
      // type,
      enterprise_id: curEnterpriseId,
      activity_id
    })

    const _list = pickBy(list, doc.purchase.ACTIVITY_ITEM)
    setState((draft) => {
      draft.activityList = [...activityList, ..._list]
    })

    return { total: total_count }
  }

  const handleToggleRole = () => {
    Taro.navigateTo({
      url: '/subpages/purchase/select-identity'
    })
  }

  const onConfirm = (value) => {
    setState((draft) => {
      draft.activity_name = value
      draft.activityList = []
    })
    scrollRef.current.reset()
  }

  const renderFooter = () => {
    return (
      <View className='select-company-footer' onClick={handleToggleRole}>
        身份管理
      </View>
    )
  }

  const onClickChange = async (item, isRedirectTo) => {
    const {
      id,
      enterpriseId,
      pages_template_id,
      priceDisplayConfig = {},
      isDiscountDescriptionEnabled,
      discountDescription
    } = item
    const url = `/subpages/purchase/index?activity_id=${id}&enterprise_id=${enterpriseId}&pages_template_id=${pages_template_id}`
    const _priceDisplayConfig = handlePriceConfig(priceDisplayConfig)
    //需要存活动价格展示
    dispatch(
      updateActivityInfo({
        priceDisplayConfig: _priceDisplayConfig,
        isDiscountDescriptionEnabled,
        discountDescription
      })
    )
    //更新活动购物车
    await dispatch(
      updateCount({
        shop_type: 'distributor',
        enterprise_id: enterpriseId,
        activity_id: id
      })
    )
    if (isRedirectTo) {
      Taro.redirectTo({ url })
    } else {
      Taro.navigateTo({ url })
    }
  }

  const handlePriceConfig = (val) => {
    if (!val) return {}
    const priceConfig = JSON.parse(JSON.stringify(val))
    Object.keys(priceConfig).forEach((key) => {
      const c_config = priceConfig[key]
      if (c_config) {
        for (let ckey in c_config) {
          c_config[ckey] = c_config[ckey] == 'true'
        }
      }
    })
    return priceConfig
  }

  const handleTypeChange = (e) => {
    setState((draft) => {
      draft.currentIndex = e
      draft.activityList = []
    })
    scrollRef.current.reset()
  }

  return (
    <SpPage
      className='page-purchase-index'
      // renderFloat={
      //   <View>
      //     <SpFloatMenuItem
      //       onClick={() => {
      //         dispatch(updatePurchaseShareInfo(null))
      //         Taro.navigateTo({ url: `/subpages/purchase/member?from=${'purchase_home'}` })
      //       }}
      //     >
      //       <Text className='iconfont icon-huiyuanzhongxin'></Text>
      //     </SpFloatMenuItem>
      //   </View>
      // }
      // renderFooter={renderFooter()}
      renderFooter={!loading && <CompTabbar />}
    >
      <View className='user-box'>
        <View className='user-serach'>
          <SpSearchInput placeholder='活动名称' onConfirm={onConfirm} />
        </View>
      </View>
      {/* <SpTabs current={currentIndex} tablist={tabList} onChange={handleTypeChange} /> */}
      <ScrollView className='item-list-scroll' scrollY>
        <SpScrollView
          ref={scrollRef}
          className=''
          auto={false}
          fetch={fetch}
          renderEmpty={<SpNote img='empty_activity.png' title='没有查询到内购活动' />}
        >
          <View className='scroll-view-container'>
            {activityList.map((item, index) => (
              <View key={item.id} className='activity-item' onClick={() => onClickChange(item)}>
                <View className='activity-item-hd'>
                  <View className='activity-title'>{item.name}</View>
                  {/* <View className='role'>{item.role}</View> */}
                </View>
                <View className='activity-time'>
                  {`活动时间：${item.employeeBeginTime} - ${item.employeeEndTime}`}
                </View>
                <SpImage className='activity-pic' circle={36} src={item.pic} />
              </View>
            ))}
          </View>
        </SpScrollView>
      </ScrollView>
    </SpPage>
  )
}

PurchaseActivityList.options = {
  addGlobalClass: true
}

export default PurchaseActivityList
