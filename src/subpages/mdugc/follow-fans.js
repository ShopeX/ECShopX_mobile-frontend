/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { useSelector } from 'react-redux'
import React, { useEffect, useRef, useCallback, useMemo } from 'react'
import { useImmer } from 'use-immer'
import Taro, { usePullDownRefresh, useRouter } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { SpPage, SpScrollView, SpImage } from '@/components'
import { SpTagBar } from '@/subpages/components'
import * as mdugcApi from '@/api/mdugc'
import { useTranslation, $t } from '@/i18n'

import './follow-fans.scss'

const TAG_META = [
  { tag_id: 1, tag_type: 'follower' },
  { tag_id: 2, tag_type: 'user' }
]

const initialState = {
  curFilterIndex: -1,
  followlist: [],
  type: ''
}

function UgcFollowFans() {
  const { i18n } = useTranslation()
  const filterList = useMemo(
    () => [
      { ...TAG_META[0], tag_name: $t('85509bfd.4c0a3a') },
      { ...TAG_META[1], tag_name: $t('85509bfd.1c173c') }
    ],
    [i18n.language]
  )
  const [state, setState] = useImmer(initialState)
  const { curFilterIndex, followlist, type } = state
  const { userInfo = {} } = useSelector((state) => state.user)
  const { params } = useRouter()
  const user_id = params.user_id ? params.user_id : userInfo.user_id
  const router = useRouter()
  const listRef = useRef('')

  useEffect(() => {
    const { type } = router?.params
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
    const { list = [], total_count: total } = await mdugcApi.followerlist(params)
    setState((draft) => {
      draft.followlist = [...followlist, ...list]
    })
    Taro.stopPullDownRefresh()
    return { total: total || 0 }
  }

  const onChangeFilter = useCallback(
    (index) => {
      console.log(index)
      setState((draft) => {
        draft.type = filterList[index].tag_type
        draft.curFilterIndex = index
        draft.followlist = []
      })
    },
    [filterList, setState]
  )

  // 关注|取消关注
  const followercreate = async (e, i) => {
    e && e.stopPropagation()
    let item = JSON.parse(JSON.stringify(followlist[i]))
    let data = {
      user_id: item.user_id,
      follower_user_id: user_id
    }
    let res = await mdugcApi.followercreate(data)
    if (res.action == 'unfollow') {
      console.log(item.mutal_follow)
      // 取消关注
      item.mutal_follow = 0
      Taro.showToast({
        icon: 'none',
        title: $t('85509bfd.92bdc8')
      })
    } else if (res.action == 'follow') {
      console.log(item.mutal_follow)
      // 关注
      item.mutal_follow = 1
      Taro.showToast({
        icon: 'none',
        title: $t('85509bfd.60fa97')
      })
    }
    setState((draft) => {
      draft.followlist[i] = item
    })
  }

  const topages = (url) => {
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
            <View
              className='follow-item'
              key={`follow-item__${index}`}
              onClick={() => topages(`/subpages/mdugc/my?user_id=${item.user_id}`)}
            >
              <View className='item-lf'>
                <View className='item-hd'>
                  <SpImage circle src={item.headimgurl} width={80} height={80} />
                </View>
                <View className='item-bd'>{item.nickname}</View>
              </View>
              <View className='item-ft' onClick={(e) => followercreate(e, index)}>
                {item.mutal_follow == 0 ? (
                  type == 'user' ? (
                    <View className='item-ft__r active'>{$t('85509bfd.9b5b8a')}</View>
                  ) : (
                    <View className='item-ft__r'>{$t('85509bfd.f4f380')}</View>
                  )
                ) : (
                  <View className='item-ft__r'>{$t('85509bfd.4856be')}</View>
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
