import Taro from '@tarojs/taro'
import React, { useCallback, useState, useEffect } from 'react'
import { useImmer } from 'use-immer'
import { View, Text, ScrollView, Image, Input, Picker } from '@tarojs/components'
import { AtButton, AtInput } from 'taro-ui'
import api from '@/api'
import { classNames } from '@/utils'
import './select-company-no.scss'
import CompBottomTip from './comps/comp-bottomTip'


function SelectComponent(props) {
  const [companyNo, setCompanyNo] = useState()
  const [isError, setIsError] = useState(false)
  const [isSuccess, setIsSuccess] = useState(true)

  useEffect(() => {
    //请求获取企业信息
  }, [])

  const onChange = (e) => {
    setCompanyNo(e)
  }

  return (
    <View className='select-component'>
      <View className='select-component-title'>选择企业</View>
      <View className='selecte-box'>
        <AtInput
          placeholder='请输入完整的企业编号'
          value={companyNo}
          onChange={onChange}
          className='select-option '
          clear
        />
        <Text className='iconfont icon-search1 icon'></Text>
      </View>
      <View className='info'>
        <Text className='iconfont icon-info icon'></Text>
        <Text>请先输入企业编号搜索</Text>
      </View>
      {isError && <View className='err-info'>企业不存在，请检查企业编号是否正确</View>}
      {isSuccess && (
        <View className='success-info'>
          <Text>商派软件有限公司</Text>
          <Text className='iconfont icon-zhengque-correct icon'></Text>
        </View>
      )}

      <AtButton circle className='btns-staff' disabled={!companyNo}>
        继续验证
      </AtButton>
      <CompBottomTip />
    </View>
  )
}

SelectComponent.options = {
  addGlobalClass: true
}

export default SelectComponent
