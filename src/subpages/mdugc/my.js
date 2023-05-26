import React, { useEffect, useRef } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Text, Button, ScrollView, Image } from '@tarojs/components'
import { SpImage, SpPage, SpScrollView, SpTagBar } from '@/components'
import S from '@/spx'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import { pickBy } from '@/utils'
import api from '@/api'
import doc from '@/doc'
import CompNoteItem from './comps/comp-noteitem'

import './my.scss'

const initialState = {
  list: [],
  oddList: [],
  evenList: [],
  curTagId: 0,
  isdrafts: false, //是否存在本地草稿
  userinfo: {
    userid: '',
    isoneself: false,
    headimgurl: '',
    nickname: '',
    follow_status: 0, //是否关注该博主
    followers: 0, //粉丝数
    idols: 0, //关注数
    likes: 0, //获赞数
    unread_nums: 0, //未读消息数
    draft_post: {}
  },
  isPopups: false, //弹窗
  popnum: [
    {
      text: '当前发布笔记数',
      // icon: 'icon-16',
      icon: 'icon-guanbi2',
      num: 10
    },
    {
      text: '当前获得点赞数',
      // icon: 'icon-dianzan',
      icon: 'icon-guanbi2',
      num: 100
    }
  ],

  filterList: [
    { tag_id: 1, tag_name: '笔记' },
    { tag_id: 2, tag_name: '收藏' },
    { tag_id: 3, tag_name: '赞过' },
  ],
  curFilterIndex: 0,
  leftList: [],
  rightList: [],
}

function UgcMember(props) {
  const [state, setState] = useImmer(initialState)
  const { filterList, curFilterIndex, leftList, rightList } = state
  const { userInfo = {} } = useSelector((state) => state.user)
  const router = useRouter()
  const listRef = useRef()

  useEffect(() => {
    listRef.current.reset()
  }, [curFilterIndex])

  const fetch = async ({ pageIndex, pageSize }) => {
    let params = {
      page: pageIndex,
      pageSize,
      user_id: userInfo.user_id,
      is_draft: 0
    }
    if (curFilterIndex > 0) {
      params = {
        ...params,
        searchType: curFilterIndex == 1 ? 'favorite' : 'like'
      }
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
    })

    return { total: total || 0 }
  }


  const onChangeFilter = (index) => {
    setState((draft) => {
      draft.leftList = []
      draft.rightList = []
      draft.curFilterIndex = index
    })
  }

  const {
    tab,
    list,
    page,
    oddList,
    evenList,
    curTagId,
    showBackToTop,
    scrollTop,
    isPopups,
    popnum,
    userinfo
  } = state

  console.log('useri', userinfo)

  return (
    <SpPage className='page-ugc-my'>
      <View className='main-hd'>
        <View className='main-info'>
          <SpImage
            circle
            src={userinfo?.headimgurl || 'user_icon.png'}
            width={112}
            height={112}
          />
          <View className='author-name'>商派Ecshopx-漕宝店</View>
        </View>
        <View className='info-container'>
          <View className='info-hd'>
            <View className='item-info' onClick={() => {
              Taro.navigateTo({
                url: '/subpages/mdugc/follow-fans?type=follower'
              })
            }}>
              <View className='num'>888</View>
              <View className='label'>关注</View>
            </View>
            <View className='item-info' onClick={() => {
              Taro.navigateTo({
                url: '/subpages/mdugc/follow-fans?type=user'
              })
            }}>
              <View className='num'>888</View>
              <View className='label'>粉丝</View>
            </View>
            <View className='item-info'>
              <View className='num'>888</View>
              <View className='label'>获赞</View>
            </View>
          </View>
          <View className='btn-follow'>已关注</View>
        </View>
        <View className='filter-bar-wrap'>
          <SpTagBar
            list={filterList}
            value={filterList[curFilterIndex]?.tag_id}
            onChange={onChangeFilter}
          />
        </View>
      </View>


      <SpScrollView className='list-scroll'
        ref={listRef}
        auto={false}
        fetch={fetch}>
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
export default UgcMember
