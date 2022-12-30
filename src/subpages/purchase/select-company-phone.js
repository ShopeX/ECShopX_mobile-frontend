import Taro from '@tarojs/taro'
import React, { useCallback, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import { View, Text, ScrollView, Image, Input, Picker ,Button} from '@tarojs/components'
import { AtButton, AtInput } from 'taro-ui'
import api from '@/api'
import { classNames } from '@/utils'
import './select-company-phone.scss'
import CompBottomTip from './comps/comp-bottomTip'


function SelectComponent(props) {
  const [phone, setPhone] = useState('18878787778')
  const { colorPrimary, pointName, openStore } = useSelector((state) => state.sys)

  const handleValidate = async () => {
    Taro.showModal({
      title: '验证失败',
      content: `手机号码错误，请更换手机号`,
      // confirmColor: colorPrimary,
      confirmColor:'#F4811F',
      showCancel: false,
      confirmText: '我知道了',
      success: () => {
        Taro.navigateTo({ url: `/subpages/purchase/select-company-activity` })
      }
    })
  }

  const handleBindPhone = async (e) => {
    const { encryptedData, iv } = e.detail
    if (encryptedData && iv) {
      console.log(e.detail)
      Taro.navigateTo({ url: `/subpages/purchase/select-company-activity` })
    }
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
      <AtButton circle className='btns-other' openType='getPhoneNumber' onGetPhoneNumber={handleBindPhone} >
        其他手机号码验证
      </AtButton>
      <AtButton circle className='btns-phone' openType='getPhoneNumber' onGetPhoneNumber={handleBindPhone} customStyle={{ marginTop: '50%' }}>
        微信授权登录
      </AtButton>
      <CompBottomTip />
    </View>
  )
}

SelectComponent.options = {
  addGlobalClass: true
}

export default SelectComponent

// 有商场和无商场 手机号授权登录