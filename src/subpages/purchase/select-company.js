import Taro from '@tarojs/taro'
import React, { useCallback, useState, useEffect } from 'react'
import { useImmer } from 'use-immer'
import { View, Text, ScrollView, Image, Input } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import api from '@/api'
import { classNames } from '@/utils'
import './select-company.scss'
import userIcon from '@/assets/imgs/user-icon.png'
import CompBottomTip from './comps/comp-bottomTip'
import arrow from '@/assets/imgs/arrow.png'

const initialState = {}

function SelectComponent(props) {



  useEffect(() => {

  }, [])

  return (
    <View className='select-component'>
      <View className='select-component-title'>选择企业</View>
      <Input placeholder='123' className='select-option' />
      <AtButton circle className='btns-staff'>
          继续验证
        </AtButton>
    </View>
  )
}

SelectComponent.options = {
  addGlobalClass: true
}

export default SelectComponent
