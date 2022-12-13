import Taro from '@tarojs/taro'
import React, { useCallback, useState, useEffect } from 'react'
import { useImmer } from 'use-immer'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import api from '@/api'
import { classNames } from '@/utils'
import './select-role.scss'
import userIcon from '@/assets/imgs/user-icon.png'
import CompBottomTip from './comps/comp-bottomTip'

const initialState = {}

function SelectRole(props) {

  useEffect(() => {}, [])

  return (
    <View className='select-role'>
      <View className='header'>
        <Image className='header-avatar' src={userIcon} mode='aspectFill' />
        <Text className='welcome'>欢迎登陆</Text>
        <Text className='title'>上海商派员工亲友购</Text>
      </View>
      <View className='btns'>
        <AtButton circle className='btns-staff'>
          我是员工
          <Text className='iconfont icon-close'></Text>
        </AtButton>
        <AtButton circle className='btns-frined'>
          我是亲友
          <Text className='iconfont icon-close'></Text>
        </AtButton>
      </View>
      <CompBottomTip />
    </View>
  )
}

SelectRole.options = {
  addGlobalClass: true
}

export default SelectRole
