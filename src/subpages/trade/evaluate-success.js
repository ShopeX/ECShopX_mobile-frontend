// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
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
          <AtButton
            circle
            onClick={() => {
              Taro.redirectTo({ url: '/pages/index' })
            }}
          >
            返回首页
          </AtButton>
        </View>
      </View>
    </SpPage>
  )
}

EvaluateSuccess.options = {
  addGlobalClass: true
}

export default EvaluateSuccess
