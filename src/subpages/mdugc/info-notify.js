import { useSelector } from 'react-redux'
import React, { useEffect, useRef, useCallback } from 'react'
import { useImmer } from 'use-immer'
import Taro, { usePullDownRefresh, useRouter } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { SpPage, SpTagBar, SpScrollView, SpImage } from '@/components'
import api from '@/api'
import './info-notify.scss'

const initialState = {
  curFilterIndex: -1,
  followlist: [],
  type: '',
  infoList: []
}
const filterList = [
  { tag_id: 1, tag_name: '系统', tag_type: 'system',icon:'icon-logo' },
  { tag_id: 2, tag_name: '回复', tag_type: 'reply',icon:'icon-sixin'  },
  { tag_id: 3, tag_name: '喜欢', tag_type: 'like',icon:'icon-aixin'  },
  { tag_id: 4, tag_name: '关注', tag_type: 'favoritePost',icon:'icon-redu'  },
  { tag_id: 5, tag_name: '粉丝', tag_type: 'followerUser',icon:'icon-gerenzhongxin'  }
]
function UgcFollowFans() {
  const [state, setState] = useImmer(initialState)
  const { curFilterIndex, followlist, type, infoList } = state
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

  const onChangeFilter = useCallback((index) => {
    setState((draft) => {
      draft.type = filterList[index].tag_type
      draft.curFilterIndex = index
      draft.followlist = []
    })
  })

  //刷新
  usePullDownRefresh(() => {
    setState((draft) => {
      draft.followlist = []
    })
    listRef.current.reset()
  })
  const fetch = async ({}) => {
    let { message_info } = await api.mdugc.messagedashboard()
    setState((draft) => {
      draft.infoList = message_info
    })
    if (!type) return 0
    const params = {
      page_no: pageIndex,
      page_size: pageSize,
      user_id: user_id,
      user_type: type
    }
    const { list, total_count: total } = await api.mdugc.followerlist(params)
    Taro.stopPullDownRefresh()
    return { total: total || 0 }
  }


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

  const isicon = (type) => {
    let icon = ''
    if (type == 'system') {
      icon = 'icon-logo'
    } else if (type == 'reply') {
      icon = 'icon-sixin'
    } else if (type == 'like') {
      icon = 'icon-aixin'
    } else if (type == 'favoritePost') {
      icon = 'icon-redu'
    } else if (type == 'followerUser') {
      icon = 'icon-gerenzhongxin'
    }
    return icon
  }
  const topage = (item) => {
    let { type, unread_nums } = item
    let url = ''
    if (type == 'system') {
      url = 'make_system'
    } else if (type == 'reply') {
      url = 'make_comment'
    } else if (type == 'like') {
      url = 'make_fabulous'
    } else if (type == 'favoritePost') {
      url = 'make_collection'
    } else if (type == 'followerUser') {
      url = 'make_follow'
    }
    if (!Number(unread_nums)) {
      unread_nums = ''
    }
    Taro.navigateTo({
      url: `/mdugc/pages/${url}/index?num=${unread_nums}`
    })
  }

  return (
    <SpPage className='page-ugc-info-notify'>
      <SpTagBar
        list={filterList}
        value={filterList[curFilterIndex]?.tag_id}
        onChange={onChangeFilter}
      />
      <SpScrollView className='scroll-list' auto ref={listRef} fetch={fetch}>
        <View className='info-list'>
          {followlist.map((item, index) => (
            <View className='newslist_i' key={`info-item__${index}`}>
              <View className='newslist_i_icon'>
                <View className={`newslist_i_icon_icons ${item.type} ${isicon(item.type)}`}></View>
                {item.unread_nums ? (
                  <View className='newslist_i_icon_num'>{item.unread_nums}</View>
                ) : null}
              </View>
              <View className='newslist_i_cen'>
                <View className='newslist_i_cen_title'>
                  {item.type == 'system' ? '系统通知' : item.recent_message.list[0]?.from_nickname}
                </View>
                <View className='newslist_i_cen_text'>
                  {item.recent_message.list.length > 0
                    ? (item.type == 'system' ? '' : item.recent_message.list[0]?.created_moment) +
                      '' +
                      item.recent_message.list[0]?.title
                    : null}
                </View>
              </View>

              <View className='newslist_i_time'>
                {item.recent_message.list.length > 0
                  ? item.recent_message.list[0]?.created_text
                  : null}
              </View>
            </View>
          ))}
        </View>
      </SpScrollView>
    </SpPage>
  )
}

export default UgcFollowFans
