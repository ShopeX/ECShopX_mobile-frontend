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
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View, Text } from '@tarojs/components'
import { SpScrollView } from '@/components'
import dayjs from 'dayjs'
import './withdraw-list.scss'

const initialState = {
  list: []
}
function WithdrawList(props) {
  const listRef = useRef()
  const [state, setState] = useImmer(initialState)
  const { list } = state

  const fetch = async ({ pageIndex, pageSize }) => {
    const { list, total_count } = await api.community.getCashWithDraw({
      page: pageIndex,
      pageSize
    })
    setState((draft) => {
      draft.list = list
    })
    return { total: total_count }
  }

  return (
    <View className='page-withdraw-list'>
      <View className='list-hd'>
        <Text className='iconfont'></Text>
        <Text className='title'>提现列表</Text>
      </View>
      <SpScrollView className='list-scroll' ref={listRef} fetch={fetch}>
        {list.map((item) => (
          <View className='withdraw-item'>
            <View className='item-hd'>
              <Text className='apply-money'>{`申请提现 ${item.money / 100} 元`}</Text>
              <Text className='apply-datetime'>
                {dayjs(item.created_date).format('YYYY-MM-DD HH:mm:ss')}
              </Text>
            </View>
            <View className='item-ft'>
              <Text className='iconfont'></Text>
              <Text className='status-txt'>
                {
                  {
                    'apply': '待处理',
                    'reject': '拒绝',
                    'success': '提现成功',
                    'process': '处理中',
                    'failed': '提现失败'
                  }[item.status]
                }
              </Text>
            </View>
          </View>
        ))}
      </SpScrollView>
    </View>
  )
}

WithdrawList.options = {
  addGlobalClass: true
}

export default WithdrawList
