import React, { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import { SpImage, SpPrice } from '@/components'
import { classNames } from '@/utils'
import { useImmer } from 'use-immer'
import api from '@/api'
import { useAsyncCallback } from '@/hooks'

import './index.scss'

const initialState = {
  groupList: [],
  isOpen: false,
  pageSize: 20,
  page: 1,
  total: 5
}

const CompGroupLogListItem = (props) => {
  const { isLeader = false, list = [] } = props
  const [state, setState] = useAsyncCallback(initialState)

  const { isOpen, pageSize, groupList, page, total } = state

  // useEffect(() => {
  //   getActivityList()
  // }, [])

  // 查看更多
  // const handleClickMore = async () => {
  //   let pages = page
  //   setState(draft => {
  //     draft.isOpen = !isOpen
  //     draft.page = ++pages
  //     draft.total = ++pages
  //   }, ({ page }) => {
  //     getActivityList(page)
  //   })
  // }

  // const getActivityList = async (pages = 1) => {
  //   const list = await api.community.
  //   setState(draft => {
  //     draft.groupList = list.items
  //   })
  // }

  return (
    <View className='comp-grouploglist'>
      {list.map((item, index) => {
        if (isOpen ? true : index < pageSize) {
          return (
            <View className='comp-grouploglist-item' key={index}>
              <View className='comp-grouploglist-item__num'>{index + 1}</View>
              <View className='comp-grouploglist-item__img'>
                <SpImage src={item.avatar} className='user-head' />
              </View>
              <View className='comp-grouploglist-item__info'>
                <View className='user'>
                  <Text className='user__name'>{item.username}</Text>
                  {/* {isLeader && <Text className='user__tag'>回头客</Text>} */}
                  <Text className='user__time'>{item.save_time}</Text>
                </View>

                <View className='goods'>
                  {item.item_name}
                  <Text className='goods__num'>+{item.num}</Text>
                  {/* {isLeader && <Text className='goods__status'>已取消</Text>} */}
                </View>

                {/* {isLeader && (
                  <View className='order'>
                    <Text className='order__time'>2022-04-01 22:10:10</Text>
                    <Text className='order__status'>核销成功</Text>
                  </View>
                )} */}
              </View>
            </View>
          )
        }
      })}
      {/* {total <= 10 &&
        <View className='more' onClick={handleClickMore.bind(this)}>
          查看更多
          <Text className={classNames('icon-arrowDown iconfont icon')}></Text>
        </View>
      } */}
    </View>
  )
}

export default CompGroupLogListItem
