import { useSelector } from 'react-redux'
import React, { useEffect, useRef, useCallback } from 'react'
import { useImmer } from 'use-immer'
import Taro, { usePullDownRefresh, useRouter } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { SpPage, SpTagBar, SpScrollView, SpImage } from '@/components'
import api from '@/api'

import './follow-fans.scss'

const initialState = {
  filterList: [
    { tag_id: 1, tag_name: '关注', tag_type: 'follower' },
    { tag_id: 2, tag_name: '粉丝', tag_type: 'user' }
  ],
  curFilterIndex: -1,
  followlist: [],
  type: ''
}

function UgcFollowFans() {
  const [state, setState] = useImmer(initialState)
  const { filterList, curFilterIndex, followlist, type } = state
  const { user_id } = useSelector((state) => state.user?.userInfo)
  const router = useRouter()
  const listRef = useRef('')

  useEffect(() => {
    const { type } = router.params
    setState((draft) => {
      draft.curFilterIndex = type === 'user' ? 1 : 0
      draft.type = type
    })
  }, [])

  useEffect(() => {
    listRef.current.reset()
  }, [curFilterIndex])
  //刷新
  usePullDownRefresh(() => {
    setState((draft) => {
      draft.followlist = []
    })
    listRef.current.reset()
  })
  const fetch = async ({ pageIndex, pageSize }) => {
    if (!type) return 0
    const params = {
      page_no: pageIndex,
      page_size: pageSize,
      user_id: user_id,
      user_type: type
    }
    const { list, total_count: total } = await api.mdugc.followerlist(params)
    setState(
      (draft) => {
        draft.followlist = [...followlist, ...list]
      })
    Taro.stopPullDownRefresh()
    return { total: total || 0 }
  }

  const onChangeFilter = useCallback((index) => {
    console.log(index)
    setState((draft) => {
      draft.type = filterList[index].tag_type
      draft.curFilterIndex = index
      draft.followlist = []
    })
  })

  // 关注|取消关注
  const followercreate = async (i) => {
    let item = JSON.parse(JSON.stringify(followlist[i]))
    let data = {
      user_id: item.user_id,
      follower_user_id: user_id
    }
    let res = await api.mdugc.followercreate(data)
    if (res.action == 'unfollow') {
      console.log(item.mutal_follow)
      // 取消关注
      item.mutal_follow = 0
      Taro.showToast({
        icon: 'none',
        title: '取消关注'
      })
    } else if (res.action == 'follow') {
      console.log(item.mutal_follow)
      // 关注
      item.mutal_follow = 1
      Taro.showToast({
        icon: 'none',
        title: '关注成功'
      })
    }
    setState((draft) => {
      draft.followlist[i] = item
    })
  }

const topages = (url) =>{
  Taro.navigateTo({ url })
}

  return (
    <SpPage className='page-ugc-follow-fans'>
      <SpTagBar
        list={filterList}
        value={filterList[curFilterIndex]?.tag_id}
        onChange={onChangeFilter}
      />
      <SpScrollView className='scroll-list' auto ref={listRef} fetch={fetch}>
        <View className='follow-list'>
          {followlist.map((item, index) => (
            <View className='follow-item' key={`follow-item__${index}`} onClick={()=>topages(`/subpages/mdugc/my?user_id=${item.user_id}`)}>
              <View className='item-lf'>
                <View className='item-hd'>
                  <SpImage circle src={item.headimgurl} width={80} height={80} />
                </View>
                <View className='item-bd'>{item.nickname}</View>
              </View>
              <View className='item-ft' onClick={() => followercreate(index)}>
                {item.mutal_follow == 0 ? (
                  type == 'user' ? (
                    <View className='item-ft__r active'>+关注</View>
                  ) : (
                    <View className='item-ft__r'>已关注</View>
                  )
                ) : (
                  <View className='item-ft__r'>互相关注</View>
                )}
              </View>
            </View>
          ))}
        </View>
      </SpScrollView>
    </SpPage>
  )
}

export default UgcFollowFans
