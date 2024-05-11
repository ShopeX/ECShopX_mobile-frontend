import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Switch, Text, Button } from '@tarojs/components'
import { AtInput, AtButton, AtTextarea } from 'taro-ui'
import { SpCell, SpPage, SpAddress } from '@/components'
import api from '@/api'
import { isWxWeb, showToast } from '@/utils'
import S from '@/spx'
import { useNavigation } from '@/hooks'

import './edit-deliveryman.scss'

const initialState = {
  isOpened: true,
  parent: {
    value1: ''
  }
}

function EditDeliveryman(props) {
  const [state, setState] = useImmer(initialState)
  const { isOpened, parent } = state
  const { setNavigationBarTitle } = useNavigation()

  const handleChange = (value) => {}

  useEffect(() => {
    setNavigationBarTitle(initNavigationBarTitle())
  }, [])

  const initNavigationBarTitle = () => {
    return isOpened ? '新增配送员' : '编辑配送员'
  }

  return (
    <SpPage className='page-address-edit'>
      <View className='page-address-edit-content'>
        <AtInput
          name='value1'
          title='配送员编码'
          type='text'
          placeholder='请输入配送员编码'
          value={parent.value1}
          onChange={handleChange}
        />
        <View className='attribute'>
          <Text>配送员属性</Text>
          <View>全职</View>
        </View>
        <View className='attribute'>
          <Text>配送员结算方式</Text>
          <View>按单笔订单</View>
        </View>
        {/* <AtInput
          name='value1'
          title='配送员结算方式'
          type='text'
          placeholder='请输入配送员结算方式'
          value={parent.value1}
          onChange={handleChange}
        /> */}
        <AtInput
          name='value1'
          title='结算费用'
          type='text'
          placeholder='请输入结算费用'
          value={parent.value1}
          onChange={handleChange}
        />
        <AtInput
          name='value1'
          title='配送员手机号'
          type='text'
          placeholder='请输入配送员手机号'
          value={parent.value1}
          onChange={handleChange}
        />
        <AtInput
          name='value1'
          title='配送员姓名'
          type='text'
          placeholder='请输入配送员姓名'
          value={parent.value1}
          onChange={handleChange}
        />
        <AtInput
          name='value1'
          title='登录密码'
          type='text'
          placeholder='请输入登录密码'
          value={parent.value1}
          onChange={handleChange}
        />
      </View>
      <View className='page-address-edit-scroll-establish'>
        <View>保 存</View>
      </View>
    </SpPage>
  )
}

EditDeliveryman.options = {
  addGlobalClass: true
}

export default EditDeliveryman
