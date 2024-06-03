import Taro from '@tarojs/taro'
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import { View, Text, Image } from '@tarojs/components'
import api from '@/api'
import { classNames } from '@/utils'
import './select-identity.scss'

const initialState = {
  identity: [],
  invalidIdentity: []
}

function SelectIdentity(props) {
  const [state, setState] = useImmer(initialState)

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
      url: '/pages/purchase/auth?type=addIdentity'
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
        {state.invalidIdentity?.length > 0 &&
          <View className='invalid-identity'>
            <View className='title'>已失效身份</View>
            {state.invalidIdentity?.map((item, index) => (
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
            ))}
          </View>
        }
      </View>
    </View>
  )
}

SelectIdentity.options = {
  addGlobalClass: true
}

export default SelectIdentity
