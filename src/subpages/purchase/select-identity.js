import Taro from '@tarojs/taro'
import React, { useCallback, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import { View, Text, ScrollView, Image, Input, Picker, Button } from '@tarojs/components'
import { AtButton, AtInput } from 'taro-ui'
import api from '@/api'
import { classNames } from '@/utils'
import './select-identity.scss'
import CompBottomTip from './comps/comp-bottomTip'
import { SpPage, SpTabbar } from '@/components'
import CompTabbar from './comps/comp-tabbar'

const initialState = {
  identity: [],
  invalidIdentity: []
}

function SelectIdentity(props) {
  const [state, setState] = useImmer(initialState)
  const { colorPrimary, pointName, openStore } = useSelector((state) => state.sys)

  useEffect(() => {
    getUserEnterprises()
  }, [])
  
  const getUserEnterprises = async () => {
    const data = await api.purchase.getUserEnterprises()
    setState(draft => {
      draft.identity = data.filter(item => item.disabled == 0)
      draft.invalidIdentity = data.filter(item => item.disabled == 1)
    })
  }

  const onAddIdentityChange = () => {
    Taro.navigateTo({
      url: '/pages/select-role/index'
    })
  }

  return (
    <View className='select-identity'>
      <View className='identity-item' onClick={onAddIdentityChange}>
        <View className='identity-item-avatar'>
          <Text className='iconfont icon-tianjia1 add-icon avatar'></Text>
        </View>
        <View className='add-identity'>添加身份</View>
      </View>
      <View className='content'>
        <View className='identity'>
          {state.identity.map((item, index) => {
            return (
              <View key={index} className='identity-item'>
                <View className='identity-item-avatar'>
                  <Image src={item?.logo} className='avatar' />
                </View>
                <View className='identity-item-content'>
                  <View className='content-top'>
                    <View className='company'>{item.name}</View>
                  </View>
                  <View className='content-bottom'>
                    <View className={classNames('role', item.is_relative == 1 ? 'friend' : '')}>
                      {item.is_employee == 1 && '员工' || item.is_relative == 1 && '亲友'}
                    </View>
                    <View className='account'>{item.login_account}</View>
                  </View>
                </View>
              </View>
            )
          })}
        </View>
        <View className='invalid-identity'>
          {state.invalidIdentity?.length > 0 && <View className='title'>已失效身份</View>}
          {state.invalidIdentity?.map((item, index) => {
            return (
              <View key={index} className='identity-item'>
                <View className='identity-item-avatar'>
                  <Image src={item?.avatar} className='avatar' />
                </View>
                <View className='identity-item-content'>
                  <View className='content-top'>
                    <View className='company'>{item.name}</View>
                  </View>
                  <View className='content-bottom'>
                    <View className={classNames('role', item.is_relative == 1 ? 'friend' : '')}>
                      {item.is_employee == 1 && '员工' || item.is_relative == 1 && '亲友'}
                    </View>
                    <View className='account'>{item.login_account}</View>
                  </View>
                </View>
              </View>
            )
          })}
        </View>
      </View>
    </View>
  )
}

SelectIdentity.options = {
  addGlobalClass: true
}

export default SelectIdentity
