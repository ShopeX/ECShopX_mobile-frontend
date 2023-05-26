import { useSelector, useDispatch } from 'react-redux'
import React, { useEffect, useRef, useCallback } from 'react'
import { connect } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance, useRouter } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { SpPage, SpTagBar, SpScrollView, SpImage } from '@/components'
import { pickBy } from '@/utils'
import S from '@/spx'
import api from '@/api'

import { FilterBar } from '../../components'
import './follow-fans.scss'

const initialState = {
  // list: [],
  // val: '', //搜索框
  // type: '',
  // curTagId: 0,
  // tab: [
  //   {
  //     title: '关注',
  //     t_id: 0
  //   },
  //   {
  //     title: '粉丝',
  //     t_id: 1
  //   }
  // ],
  // list1: [
  //   {
  //     headimgurl:
  //       'https://bbc-espier-images.amorepacific.com.cn/image/2/2023/02/27/8cb6a339f27aeaeb02669173e9a68fdeHe4tKEonZIuygGC8ZSSCWXdGJXJKeywv',
  //     nickname: '123'
  //   },
  //   {
  //     headimgurl:
  //       'https://bbc-espier-images.amorepacific.com.cn/image/2/2023/02/27/8cb6a339f27aeaeb02669173e9a68fdeHe4tKEonZIuygGC8ZSSCWXdGJXJKeywv',
  //     nickname: '456'
  //   }
  // ],

  filterList: [
    { tag_id: 1, tag_name: '关注' },
    { tag_id: 2, tag_name: '粉丝' },
  ],
  curFilterIndex: 0,
  followlist: []
}

function UgcFollowFans(props) {
  const [state, setState] = useImmer(initialState)
  const { filterList, curFilterIndex, followlist } = state
  const { userInfo = {} } = useSelector((state) => state.user)
  const router = useRouter()
  const listRef = useRef()

  useEffect(() => {
    listRef.current.reset()
  }, [curFilterIndex])

  // 列表
  const fetch = async ({ pageIndex, pageSize }) => {
    const { type } = router.params
    const params = {
      page_no: pageIndex,
      page_size: pageSize,
      user_id: userInfo.user_id,
      user_type: type
    }
    const { list, total_count: total } = await api.mdugc.followerlist(params)

    setState((draft) => {
      draft.followlist = [...followlist, ...list]
    },
      () => {
        debugger
        Taro.stopPullDownRefresh()
      }
    )

    return { total: total || 0 }
  }

  const onChangeFilter = useCallback((index) => {
    setState((draft) => {
      draft.curFilterIndex = index
    })
  })

  // 关注|取消关注
  const followercreate = async (i) => {
    let { list } = state
    let item = list[i]
    let data = {
      user_id: item.user_id,
      follower_user_id: memberData.memberInfo.user_id
    }
    let res = await api.mdugc.followercreate(data)
    if (res.action == 'unfollow') {
      // 取消关注
      item.mutal_follow = 0
      Taro.showToast({
        icon: 'none',
        title: '取消关注'
      })
    } else if (res.action == 'follow') {
      // 关注
      item.mutal_follow = 1
      Taro.showToast({
        icon: 'none',
        title: '关注成功'
      })
    }
    list[i] = item
    setState((draft) => {
      draft.list = list
    })
  }
  const topages = (url) => {
    console.log('url', url)
    Taro.navigateTo({ url })
  }
  // 下拉刷新
  const onPullDownRefresh = () => {
    console.log('下拉')
    Taro.startPullDownRefresh()
    // this.resetPage()
    this.setState((draft) => {
      draft.list = []
    })
  }



  return (
    <SpPage className='page-ugc-follow-fans'>
      <SpTagBar
        list={filterList}
        value={filterList[curFilterIndex]?.tag_id}
        onChange={onChangeFilter}
      />
      <SpScrollView className='scroll-list' auto={true} ref={listRef} fetch={fetch}>
        <View className='follow-list'>
          {followlist.map((item, index) => (
            <View className='follow-item' key={`follow-item__${index}`}>
              <View className="item-hd">
                <SpImage
                  circle
                  src={item.headimgurl}
                  width={80}
                  height={80}
                />
              </View>
              <View className="item-bd">
              {item.nickname}
              </View>
              <View className="item-ft">
                <View className="btn-follow">
                  { type == 'follower' }
                </View>
              </View>
              {/* {type == 'follower' ? (
                <View
                  onClick={followercreate.bind(this, i)}
                  className='follow_list__scroll_scrolls_item_r'
                >
                  已关注
                </View>
              ) : (
                <View
                  className='follow_list__scroll_scrolls_item_r active'
                  onClick={followercreate.bind(this, i)}
                >
                  +关注
                </View>
              )} */}
            </View>
          ))}
        </View>
      </SpScrollView>
    </SpPage>
  )
}

export default UgcFollowFans
