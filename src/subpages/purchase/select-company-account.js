import Taro from '@tarojs/taro'
import React, { useCallback, useState, useEffect } from 'react'
import { useImmer } from 'use-immer'
import { View, Text, ScrollView, Image, Input, Picker } from '@tarojs/components'
import { AtButton, AtInput } from 'taro-ui'
import api from '@/api'
import { classNames } from '@/utils'
import './select-company-account.scss'
import CompBottomTip from './comps/comp-bottomTip'


function SelectComponent(props) {
  const [state, setState] = useImmer({
    account:'',password:''
  })
  const [isError, setIsError] = useState(true)

  useEffect(() => {
    //请求获取企业信息
  }, [])

  const onChangeAccount = (e) => {

    setState(draft=>{
      draft.account = e
    })
  }

  const onChangePsd = (e) => {

    setState(draft=>{
      draft.password = e
    })
  }

  return (
    <View className='select-component'>
      <View className='select-component-title'>商派软件有限公司</View>
      <View className='select-component-prompt'>使用已注册账号密码进行验证</View>
      <View className='selecte-box'>
        <AtInput
          placeholder='请输入完整登陆账号'
          value={state.account}
          onChange={onChangeAccount}
          className='select-option '
          clear
        />
        <AtInput
          placeholder='请输入登陆密码'
          value={state.password}
          onChange={onChangePsd}
          className='select-option '
          clear
        />
      </View>
      <View className='info'>
        <Text className='iconfont icon-info icon'></Text>
        <Text>如忘记密码，请联系企业管理员处理</Text>
      </View>
      {isError && <View className='err-info'>账号或密码错误，请重新输入</View>}

      <AtButton circle className='btns-staff' disabled={!(state.account||state.password)}>
        验证
      </AtButton>
      <CompBottomTip />
    </View>
  )
}

SelectComponent.options = {
  addGlobalClass: true
}

export default SelectComponent
