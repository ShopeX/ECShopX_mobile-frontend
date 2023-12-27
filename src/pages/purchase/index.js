import Taro from '@tarojs/taro'
import React, { useRef, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import { AtButton, AtInput } from 'taro-ui'
import api from '@/api'
import { classNames } from '@/utils'
import { useLogin } from '@/hooks'
import { updateUserInfo } from '@/store/slices/user'
import S from '@/spx'
import { SpPage, SpTabbar, SpScrollView, SpSearchInput } from '@/components'
import './auth.scss'

const initialState = {
  activityList: [],
  activity_name: ''
}

function PurchaseActivityList() {
  const [state, setState] = useImmer(initialState)
  const { activityList, activity_name } = state


  const scrollRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!S.getAuthToken()) {
      Taro.redirectTo({
        url: '/pages/purchase/auth'
      })
      return
    }
    updataMemberInfo()
  }, [])

  const updataMemberInfo = async () => {
    const _userInfo = await api.member.memberInfo()
    dispatch(updateUserInfo(_userInfo))
  }

  const fetch = async ({ pageIndex, pageSize }) => {
    const { list, total_count } = await api.purchase.getEmployeeActivityList({ page: pageIndex, pageSize, activity_name })
    setState(draft => {
      draft.activityList = [...activityList, ...list]
    })

    return { total: total_count }
  }

  const handleToggleRole = () => {
    Taro.navigateTo({
      url: '/subpages/purchase/select-identity'
    })
  }

  const onConfirm = (value) => {
    setState(draft => {
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
    const { id, enterprise_id, pages_template_id } = item
    Taro.redirectTo({
      url: `/subpages/purchase/index?activity_id=${id}&enterprise_id=${enterprise_id}&pages_template_id=${pages_template_id}`
    })
  }

  return (
    <SpPage
      className='page-purchase-activity'
      renderFooter={renderFooter()}
    >
      <View className='user-box'>
        <View className='user-serach'>
          <SpSearchInput
            placeholder='活动名称'
            onConfirm={onConfirm}
          />
        </View>
      </View>
      <SpScrollView ref={scrollRef} className='item-list-scroll' auto={false} fetch={fetch}>
        {activityList.map((item, index) => (
          <View
            key={item.id}
            className={classNames(
              'activity-item',
              `act${(index % 4) + 1}`
            )}
            onClick={() => onClickChange(item)}
          >
            <View className='activity-item-top user-more'>
              <View className='activity-item-title'>{item.name}</View>
              <Text className='iconfont icon-qianwang-01 more'></Text>
            </View>
            <View className='activity-item-role'>
              <View className='activity-item-role-left'>
                <View className='role'>{item.is_employee == 1 && '员工' || item.is_relative == 1 && '亲友'}</View>
                <View className='enterise'>{item.rel_enterprise}</View>
              </View>
              <View className='hot'>{item.status_desc}</View>
            </View>
          </View>
        ))}
      </SpScrollView>
    </SpPage>
  )
}

PurchaseActivityList.options = {
  addGlobalClass: true
}

export default PurchaseActivityList

// 内购活动列表
