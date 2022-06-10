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
