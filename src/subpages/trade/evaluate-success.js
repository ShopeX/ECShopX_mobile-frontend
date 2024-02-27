import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance, useDidShow } from '@tarojs/taro'
import { AtButton } from 'taro-ui'
import { View, Text } from '@tarojs/components'
import { SpPage, SpButton, SpLoading } from '@/components'
import { usePayment } from '@/hooks'
import { isArray } from '@/utils'
import api from '@/api'
import { updateCount } from '@/store/slices/cart'
import './evaluate-success.scss'

function EvaluateSuccess(props) {
  return (
    <SpPage className='page-evaluate-success'>
      <View className='evaluate-result'>
        <Text className='iconfont icon-roundcheckfill'></Text>
        <Text className='evaluate-txt'>评价成功</Text>
      </View>

      <View className='btn-block'>
        <View className='btn-wrap'>
          <AtButton circle onClick={() => {
            Taro.redirectTo({ url: '/pages/index' })
          }}>返回首页</AtButton>
        </View>
      </View>
    </SpPage>
  )
}

EvaluateSuccess.options = {
  addGlobalClass: true
}

export default EvaluateSuccess
