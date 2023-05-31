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
import { Popups } from './components'

const initialState = {
  list: [],
  oddList: [],
  evenList: [],
  curTagId: 0,
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
    { tag_id: 3, tag_name: '赞过' }
  ],
  curFilterIndex: 0,
  leftList: [],
  rightList: []
}

function UgcMember(props) {
  const [state, setState] = useImmer(initialState)
  const { filterList, curFilterIndex, leftList, rightList, userinfo, isPopups, popnum } = state
  const { params } = useRouter()
  const { userInfo = {} } = useSelector((state) => state.user)
  const user_id = params.user_id ? params.user_id : userInfo.user_id
  const listRef = useRef()

  useEffect(() => {
    isMember()

    // 笔记编辑、删除后刷新页面
    Taro.eventCenter.on('onEventRefreshFromNote', () => {
      console.log('onEventRefreshFromNote:', )
      listRef.current.reset()
    })

    return () => {
      Taro.eventCenter.off('onEventRefreshFromNote')
    }
  }, [])

  useEffect(() => {
    listRef.current.reset()
  }, [curFilterIndex])
  const isMember = async () => {
    const isAuth = S.getAuthToken()
    const memberData = await S.getMemberInfo()
    console.log(memberData, '------')
    if (!isAuth || !memberData.memberInfo) {
      Taro.showToast({
        icon: 'none',
        title: '请先登录'
      })
      return
    }
    let isoneself = false
    let userid = ''
    if (parseInt(user_id) >= 0) {
      if (memberData.memberInfo && user_id == memberData.memberInfo.user_id) {
        isoneself = true
      }
      console.log('是管理员', isoneself)
      userid = user_id
    } else {
      userid = memberData.memberInfo.user_id
      isoneself = true
    }
    if (!isoneself) {
      Taro.setNavigationBarTitle({
        title: '主页'
      })
    }
    getuserinfo(userid)
    setState((draft) => {
      draft.userinfo.userid = userid
      draft.userinfo.isoneself = isoneself
    })
    // userinfo.userid = userid
    // setState(
    //   {
    //     userinfo
    //   },
    //   () => {
    //     that.nextPage()
    //   }
    // )
  }

  const fetch = async ({ pageIndex, pageSize }) => {
    let params = {
      page: pageIndex,
      pageSize,
      user_id,
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
  const getuserinfo = async (userid) => {
    let data = {
      user_id: userid
    }
    let {
      followers,
      idols,
      likes,
      post_all_nums,
      unread_nums,
      userInfo,
      follow_status,
      draft_post
    } = await api.mdugc.followerstat(data)
    setState((draft) => {
      draft.popnum[0].num = post_all_nums
      draft.popnum[1].num = likes
      draft.userinfo.headimgurl = userInfo.headimgurl
      draft.userinfo.nickname = userInfo.nickname
      draft.userinfo.follow_status = follow_status
      draft.userinfo.followers = followers
      draft.userinfo.unread_nums = unread_nums
      draft.userinfo.idols = idols
      draft.userinfo.likes = likes
      draft.userinfo.draft_post = draft_post
      draft.userinfo.unionid = userInfo.unionid
    })
  }

  const onChangeFilter = (index) => {
    setState((draft) => {
      draft.leftList = []
      draft.rightList = []
      draft.curFilterIndex = index
    })
  }
  const topages = (url) => {
    Taro.navigateTo({
      url
    })
  }
  // 开启弹窗
  const openonLast = () => {
    setState((draft) => {
      draft.isPopups = true
    })
  }
  // 关闭弹窗
  const onLast = (isLast) => {
    console.log('这是遮罩层数据', isLast)
    setState((draft) => {
      draft.isPopups = false
    })
  }

  console.log('useri', props)

  return (
    <SpPage className='page-ugc-my'>
      <View className='main-hd'>
        <View className='main-info'>
          <SpImage circle src={userinfo?.headimgurl || 'user_icon.png'} width={112} />
          <View className='ugcmember_t_data'>
            <Text>{userinfo.nickname}</Text>
            {userinfo.isoneself && (
              <View
                className='ugcmember_t_data_r'
                onClick={() => {
                  Taro.navigateTo({
                    url: `/subpages/mdugc/info-notify`
                  })
                }}
              >
                <View className='ugcmember_t_data_r_icon iconfont icon-xiaoxi'></View>
                {userinfo.unread_nums > 0 ? <View className='ugcmember_t_data_r_num'></View> : null}
              </View>
            )}
            {/* onClick={this.topages.bind(this, '/subpages/mdugc/pages/make_newslist/index')} */}

            {/* <Text className='at-icon at-icon-bell'></Text> */}
          </View>
        </View>
        <View className='info-container'>
          <View className='info-hd'>
            <View
              className='item-info'
              onClick={() => {
                Taro.navigateTo({
                  url: `/subpages/mdugc/follow-fans?user_id=${user_id}&type=follower`
                })
              }}
            >
              <View className='num'>{userinfo.idols}</View>
              <View className='label'>关注</View>
            </View>
            <View
              className='item-info'
              onClick={() => {
                Taro.navigateTo({
                  url: `/subpages/mdugc/follow-fans?user_id=${user_id}&type=user`
                })
              }}
            >
              <View className='num'>{userinfo.followers}</View>
              <View className='label'>粉丝</View>
            </View>
            <View className='item-info' onClick={() => openonLast()}>
              <View className='num'>{userinfo.likes}</View>
              <View className='label'>获赞</View>
            </View>
          </View>
          {/* <View className='btn-follow'>已关注</View> */}
        </View>
        <View className='filter-bar-wrap'>
          <SpTagBar
            list={filterList}
            value={filterList[curFilterIndex]?.tag_id}
            onChange={onChangeFilter}
          />
        </View>
      </View>

      <SpScrollView className='list-scroll' ref={listRef} auto={false} fetch={fetch}>
        <View className='list-container'>
          <View className='left-container'>
            {userinfo.isoneself &&
              userinfo.draft_post &&
              userinfo.draft_post.post_id &&
              curFilterIndex == 0 && (
                <View
                  className='local_draft'
                  onClick={() =>
                    topages(
                      `/subpages/mdugc/note?post_id=${userinfo.draft_post.post_id}&md_drafts=true`
                    )
                  }
                >
                  <View className='local_draft_icon iconfont icon-caogaoxiang'></View>
                  <View className='local_draft_title'>本地草稿</View>
                  <View className='local_draft_text'>有1篇笔记，继续编辑</View>
                </View>
              )}
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
      {isPopups ? <Popups title='获赞' text={popnum} istext Last={() => onLast()}></Popups> : null}
    </SpPage>
  )
}
export default UgcMember
