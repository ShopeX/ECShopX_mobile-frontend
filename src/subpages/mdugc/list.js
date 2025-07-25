import React, { useEffect, useState, useCallback, useRef } from 'react'
import Taro, {
  getCurrentInstance,
  useShareAppMessage,
  useShareTimeline,
  useDidShow,
  useRouter
} from '@tarojs/taro'
import { AtButton } from 'taro-ui'
import { View, Image, Text, Button, ScrollView } from '@tarojs/components'
import { useSelector, useDispatch } from 'react-redux'
import {
  SpLogin,
  SpScrollView,
  SpTagBar,
  FloatMenus,
  FloatMenuItem,
  SpPage,
  SpFloatMenuItem
} from '@/components'
import api from '@/api'
import { useImmer } from 'use-immer'
import { useLogin, useNavigation } from '@/hooks'
import { pickBy, showToast, navigateTo } from '@/utils'
import doc from '@/doc'
import S from '@/spx'
import CompNoteItem from './comps/comp-noteitem'

import './list.scss'

const initialState = {
  filterList: [
    { tag_id: 1, tag_name: '最热' },
    { tag_id: 2, tag_name: '最新' }
  ],
  curFilterIndex: 0,
  leftList: [],
  rightList: [],
  topicName: ''
}

function UgcTopicList() {
  const [state, setState] = useImmer(initialState)
  const {
    keyword,
    tagsList,
    curTagIndex,
    filterList,
    curFilterIndex,
    leftList,
    rightList,
    topicName
  } = state
  const listRef = useRef()
  const router = useRouter()

  useEffect(() => {
    listRef.current.reset()
  }, [curTagIndex])

  // 列表
  const fetch = async ({ pageIndex, pageSize }) => {
    const { topic_id, topic_name } = router.params
    let params = {
      page: pageIndex,
      pageSize,
      sort: curFilterIndex == 0 ? 'likes desc' : 'created desc',
      topics: [topic_id]
    }
    const { list, total_count: total } = await api.mdugc.postlist(params)

    let nList = pickBy(list, doc.mdugc.UGC_LIST)

    const resLeftList = nList.filter((item, index) => {
      if (index % 2 == 0) {
        return item
      }
    })
    const resRightList = nList.filter((item, index) => {
      if (index % 2 == 1) {
        return item
      }
    })

    setState((draft) => {
      draft.leftList[pageIndex - 1] = resLeftList
      draft.rightList[pageIndex - 1] = resRightList
      draft.topicName = topic_name
    })

    return { total: total || 0 }
  }

  const onChangeFilter = (index, item) => {
    setState((draft) => {
      draft.leftList = []
      draft.rightList = []
      draft.curFilterIndex = index
    })
  }

  // 浮动按钮跳转
  const onHandleMenuItem = (url) => {
    // const isAuth = S.getAuthToken()
    // if (!isAuth) {
    //   showToast('请先登录')
    //   return
    // }
    Taro.navigateTo({ url })
  }

  return (
    <SpPage
      className='page-ugc-list'
      scrollToTopBtn
      renderFloat={
        <View className='float-icon'>
          <SpLogin onChange={onHandleMenuItem.bind(this, '/subpages/mdugc/my')}>
            <SpFloatMenuItem>
              <Text className='iconfont icon-huiyuanzhongxin'></Text>
            </SpFloatMenuItem>
          </SpLogin>
          <SpLogin onChange={onHandleMenuItem.bind(this, '/subpages/mdugc/note')}>
            <SpFloatMenuItem>
              <Text className='iconfont icon-tianjia1'></Text>
            </SpFloatMenuItem>
          </SpLogin>
        </View>
      }
    >
      <View className='topic-name'>{`#${topicName}`}</View>
      <View className='ugc-filter'>
        <SpTagBar
          list={filterList}
          value={filterList[curFilterIndex]?.tag_id}
          onChange={onChangeFilter}
        />
      </View>
      <SpScrollView className='list-scroll' ref={listRef} auto={false} fetch={fetch}>
        <View className='list-container'>
          <View className='left-container'>
            {leftList.map((list) => {
              return list?.map((item) => {
                return (
                  <View className='note-item-wrap' key={item.item_id}>
                    <CompNoteItem info={item} />
                  </View>
                )
              })
            })}
          </View>
          <View className='right-container'>
            {rightList.map((list) => {
              return list?.map((item) => {
                return (
                  <View className='note-item-wrap' key={item.item_id}>
                    <CompNoteItem info={item} />
                  </View>
                )
              })
            })}
          </View>
        </View>
      </SpScrollView>
    </SpPage>
  )
}

export default UgcTopicList
