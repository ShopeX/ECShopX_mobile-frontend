import Taro from '@tarojs/taro'
import React, { useCallback, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import { View, Text, ScrollView, Image, Input, Picker } from '@tarojs/components'
import { AtButton, AtInput } from 'taro-ui'
import api from '@/api'
import { classNames } from '@/utils'
import './select-company-validate.scss'
import CompBottomTip from './comps/comp-bottomTip'


function SelectComponent(props) {
  const [phone, setPhone] = useState('18878787778')
  const [isError, setIsError] = useState(true)
  const { colorPrimary, pointName, openStore } = useSelector((state) => state.sys)

  useEffect(() => {
    //请求获取企业信息
  }, [])

  const handleValidate = async () => {
    const { confirm } = await Taro.showModal({
        title: '验证失败',
        content: `手机号码错误，请更换手机号`,
        // confirmColor: colorPrimary,
        confirmColor:'#F4811F',
        showCancel: false,
        confirmText: '我知道了'
    })
  }

  return (
    <View className='select-component'>
      <View className='select-component-title'>商派软件有限公司</View>
      <View className='select-component-prompt'>使用手机号进行验证</View>
      <View className='phone-box'>
        <Text>已授权手机号：</Text>
        <Text className='phone-number'>{phone}</Text>
      </View>
      <AtButton circle className='btns-phone' onClick={handleValidate}>
        使用该号码验证
      </AtButton>
      <AtButton circle className='btns-other'>
        其他手机号码验证
      </AtButton>
      <CompBottomTip />
    </View>
  )
}

SelectComponent.options = {
  addGlobalClass: true
}

export default SelectComponent
