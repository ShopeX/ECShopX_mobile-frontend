import Taro from '@tarojs/taro'
import React, { useRef, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import { AtButton, AtInput } from 'taro-ui'
import api from '@/api'
import { classNames, pickBy } from '@/utils'
import { useLogin } from '@/hooks'
import { updateUserInfo } from '@/store/slices/user'
import { updatePurchaseShareInfo, updatePurchaseTabbar } from '@/store/slices/purchase'

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
  ]
}

function PurchaseActivityList() {
  const [state, setState] = useImmer(initialState)
  const { activityList, activity_name, tabList, currentIndex } = state

  const scrollRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!S.getAuthToken()) {
      Taro.redirectTo({
        url: '/pages/purchase/auth'
      })
      return
    } else {
      scrollRef.current.reset()
    }
    updataMemberInfo()
  }, [])

  const updataMemberInfo = async () => {
    const _userInfo = await api.member.memberInfo()
    dispatch(updateUserInfo(_userInfo))
  }

  const fetch = async ({ pageIndex, pageSize }) => {
    const type = tabList[currentIndex]?.value
    const { list, total_count } = await api.purchase.getEmployeeActivityList({
      page: pageIndex,
      pageSize,
      activity_name,
      type
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

  const onClickChange = (item) => {
    console.log(item)
    const { id, enterpriseId, pages_template_id } = item
    Taro.navigateTo({
      url: `/subpages/purchase/index?activity_id=${id}&enterprise_id=${enterpriseId}&pages_template_id=${pages_template_id}`
    })
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
      renderFooter={<CompTabbar />}
    >
      {/* <View className='user-box'>
        <View className='user-serach'>
          <SpSearchInput
            placeholder='活动名称'
            onConfirm={onConfirm}
          />
        </View>
      </View> */}
      <SpTabs current={currentIndex} tablist={tabList} onChange={handleTypeChange} />
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

// 内购活动列表
