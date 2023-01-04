import Taro from '@tarojs/taro'
import React, { useRef, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import { AtButton, AtInput } from 'taro-ui'
import api from '@/api'
import { classNames } from '@/utils'
import { SpPage, SpTabbar, SpScrollView, SpSearchInput } from '@/components'
import CompTabbar from './comps/comp-tabbar'
import './select-company-activity.scss'

const initialState = {
  activityList: [],
  activity_name: ''
}

function SelectComponent(props) {
  const { userInfo = {} } = useSelector((state) => state.user)
  const [state, setState] = useImmer(initialState)
  const { activityList, activity_name } = state
  const scrollRef = useRef()

  const fetch = async({ pageIndex, pageSize }) => {
    const { list, total_count } = await api.purchase.getEmployeeActivityList({ page: pageIndex, pageSize, activity_name })
    setState(draft => {
      draft.activityList = [...activityList, ...list]
    })

    return { total: total_count }
  }

  const handleToggleRole = ()=>{
    Taro.navigateTo({
      url:'/subpages/purchase/select-identity'
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
      <View className='select-component-footer' onClick={handleToggleRole}>
        切换身份
      </View>
    )
  }

  return (
    <SpPage
      className='select-component'
      renderFooter={renderFooter()}
    >
      <View className='user-box'>
        {/* <View className='user-flex'>
          <Image
            className='user-avatar'
            src={userInfo?.avatar || `${process.env.APP_IMAGE_CDN}/user_icon.png`}
          />
          <View className='user-content'>
            <View className='user-content-account'>{userInfo?.nickname || userInfo.mobile}</View>
            <View className='user-content-info'>
              <View className='user-content-role'>{userInfo?.is_employee && '员工' || userInfo.is_dependent && '亲友'}</View>
              <View className='user-content-company'>{userInfo?.company}</View>
            </View>
          </View>
          <View className='user-more' onClick={handleToggleRole}>
            <Text className='iconfont icon-qianwang-01 more'></Text>
          </View>
        </View> */}
        <View className='user-serach'>
          <SpSearchInput
            placeholder='活动名称'
            onConfirm={onConfirm}
          />
        </View>
      </View>
      <SpScrollView ref={scrollRef} className='item-list-scroll' fetch={fetch}>
        {activityList.map((item,index) => (
          <View
            key={item.id}
            className={classNames(
              'activity-item',
              `act${(index%4)+1}`
            )}
          >
            <View className='activity-item-top user-more'>
              <View className='activity-item-title'>{item.name}</View>
              <Text className='iconfont icon-qianwang-01 more'></Text>
            </View>
            <View className='activity-item-role'>
              <View className='activity-item-role-left'>
                <View className='role'>{item.is_employee == 1 ? '员工': '亲友'}</View>
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

SelectComponent.options = {
  addGlobalClass: true
}

export default SelectComponent

// 内购活动列表