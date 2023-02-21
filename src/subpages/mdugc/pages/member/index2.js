import React, { Component, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Text, Button, ScrollView,Image } from '@tarojs/components'
import { Scrollitem, Popups } from '../../components'
import S from '@/spx'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'

import { SpNote, BackToTop, FloatMenus, FloatMenuItem, Loading } from '@/components'
import { pickBy } from '@/utils'
import { withPager, withBackToTop } from '@/hocs'
import { AtTabs, AtTabsPane } from 'taro-ui'

import api from '@/api'

//import '../../font/iconfont.scss'
import './index2.scss'

const initialState = {
  list: [],
  oddList: [],
  evenList: [],
  curTagId: 0,
  isdrafts: false, //是否存在本地草稿
  tab: [
    {
      title: '笔记',
      t_id: 0
    },
    {
      title: '收藏',
      t_id: 1
    },
    {
      title: '赞过',
      t_id: 2
    }
  ],
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
      icon: 'icon-bi',
      num: 10
    },
    {
      text: '当前获得点赞数',
      icon: 'icon-aixin',
      num: 100
    }
  ]
}

function mdugcmember(props) {
  const [state, setState] = useImmer(initialState)
  const memberData = useSelector((member) => member.member)
  const router = useRouter()

  useEffect(() => {
    let { memberData } = props
    const isAuth = S.getAuthToken()
    if (!isAuth || !memberData.memberInfo) {
      Taro.showToast({
        icon: 'none',
        title: '请先登录'
      })
      // setTimeout(() => {
      //   Taro.redirectTo({
      //     url:"/pages/member/index"
      //   })
      // }, 1000)

      initHandle()

      return
    }
    let { user_id } = router.params
    let file_drafts = wx.getStorageSync('md_drafts')
    let { userinfo } = state
    let userid = ''
    if (parseInt(user_id) >= 0) {
      if (memberData.memberInfo && user_id == memberData.memberInfo.user_id) {
        userinfo.isoneself = true
      } else {
      }
      console.log('是管理员', user_id)
      userid = user_id
    } else {
      userid = memberData.memberInfo.user_id
      userinfo.isoneself = true
    }
    if (!userinfo.isoneself) {
      Taro.setNavigationBarTitle({
        title: '主页'
      })
    }
    getuserinfo(userid)
    userinfo.userid = userid
    setState(
      (draft) => {
        draft.userinfo = userinfo
      },
      () => {
        // that.nextPage()
      }
    )
  })

  const getuserinfo = async (userid) => {
    let { popnum, tab } = state
    let userinfos = state.userinfo
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
    popnum[0].num = post_all_nums
    popnum[1].num = likes
    userinfos.headimgurl = userInfo.headimgurl
    userinfos.nickname = userInfo.nickname
    userinfos.follow_status = follow_status
    userinfos.followers = followers
    userinfos.unread_nums = unread_nums
    userinfos.idols = idols
    userinfos.likes = likes
    ;(userinfos.draft_post = draft_post),
      (userinfos.unionid = userInfo.unionid),
      setState((draft) => {
        ;(draft.popnum = popnum), (draft.userinfo = userinfos)
      })
  }

  // componentDidShow () {
  const initHandle = () => {
    if (state.userinfo.userid) {
      getuserinfo(state.userinfo.userid)
    }
    Taro.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#eeeeee'
    })
    let pages = Taro.getCurrentPages()
    let currentPage = pages[pages.length - 1] // 获取当前页面
    if (currentPage.__data__.delete) {
      // 获取值
      console.log('这是笔记详情传递的删除数据', currentPage.__data__.delete)
      let post_id = currentPage.__data__.delete
      updatelist(post_id, 'delete')
      setTimeout(() => {
        currentPage.setData({
          //清空上一页面传递值
          delete: ''
        })
      }, 1000)
    } else if (currentPage.__data__.heart) {
      console.log('这是笔记详情传递的点赞数据', currentPage.__data__.heart)
      let heart = currentPage.__data__.heart
      updatelist(heart.item_id, heart.isheart, heart.likes)
      setTimeout(() => {
        currentPage.setData({
          //清空上一页面传递值
          heart: ''
        })
      }, 1000)
    }
  }
  // 更新列表
  const updatelist = (post_id, type, likes) => {
    let { list, oddList, evenList } = state
    let idx = list.findIndex((item) => item.item_id == post_id)
    let idx_odd = oddList.findIndex((item) => item.item_id == post_id)
    let idx_even = evenList.findIndex((item) => item.item_id == post_id)
    console.log('这是下标', idx, idx_odd, idx_even)
    if (idx >= 0) {
      if (type == 'delete') {
        list.splice(idx, 1)
        if (idx_odd >= 0) {
          oddList.splice(idx_odd, 1)
        } else {
          evenList.splice(idx_even, 1)
        }
      } else {
        list = setlist(list, idx, type, likes)
        console.log('这是改后数据', list, oddList, evenList)
      }
      setState((draft) => {
        ;(draft.list = list), (draft.oddList = oddList), (draft.evenList = evenList)
      })
    }
  }
  const setlist = (lists, idxs, types, likes) => {
    let listi = lists,
      idx = idxs,
      type = types
    listi[idx].isheart = type
    listi[idx].likes = likes
    return listi
  }

  const fetch = async (params) => {
    const { curTagId, userinfo } = state
    const { page_no: page, page_size: pageSize } = params
    params = {
      page,
      pageSize,
      user_id: userinfo.userid,
      is_draft: 0
    }
    if (curTagId > 0) {
      params.searchType = curTagId == 1 ? 'favorite' : 'like'
    }
    const { list, total_count: total } = await api.mdugc.postlist(params)
    console.log('list, total', list, total)
    let nList = []
    if (list) {
      nList = pickBy(list, {
        image_url: 'cover',
        head_portrait: 'userInfo.headimgurl',
        item_id: 'post_id',
        title: 'title',
        author: 'userInfo.nickname',
        user_id: 'userInfo.user_id',
        likes: 'likes',
        isheart: 'isheart',
        status: 'status',
        status_text: 'status_text',
        isheart: 'like_status',
        badges: 'badges'
      })
    }
    let odd = [],
      even = []
    nList.map((item, idx) => {
      if (idx % 2 == 0) {
        odd.push(item)
      } else {
        even.push(item)
      }
    })
    setState((draft) => {
      ;(draft.list = [...state.list, ...nList]),
        (draft.oddList = [...state.oddList, ...odd]),
        (draft.evenList = [...state.evenList, ...even])
    })

    return { total }
  }
  const topages = (url) => {
    Taro.navigateTo({
      url
    })
  }
  const handleTagChange = (i) => {
    // this.resetPage()
    setState((draft) => {
      ;(draft.list = []), (draft.oddList = []), (draft.evenList = [])
    })

    setState(
      (draft) => {
        draft.curTagId = i
      },
      () => {
        // this.nextPage()
      }
    )
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
  // 关注|取消关注
  const followercreate = async () => {
    const isAuth = S.getAuthToken()
    if (!isAuth) {
      Taro.showToast({
        icon: 'none',
        title: '请先登录'
      })
      // setTimeout(() => {
      //   Taro.redirectTo({
      //     url:"/pages/member/index"
      //   })
      // }, 1000)

      return
    }
    const { memberData } = props
    let { userinfo } = state
    let data = {
      user_id: userinfo.userid,
      follower_user_id: memberData.memberInfo.user_id
    }
    let res = await api.mdugc.followercreate(data)
    if (res.action == 'unfollow') {
      userinfo.follow_status = 0
      userinfo.followers = userinfo.followers - 1

      Taro.showToast({
        icon: 'none',
        title: '取消关注'
      })
    } else if (res.action == 'follow') {
      userinfo.follow_status = 1
      userinfo.followers = userinfo.followers - 0 + 1

      Taro.showToast({
        icon: 'none',
        title: '关注成功'
      })
    }
    setState((draft) => {
      draft.userinfo = userinfo
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

  return (
    <View className='ugcmember'>
      123
      <View className='ugcmember_t'>
        <View className='ugcmember_t_data'>
          <View className='ugcmember_t_data_l'>
            <Image src={userinfo.headimgurl} className='ugcmember_t_data_l_avatar' />
            <View className='ugcmember_t_data_l_name'>{userinfo.nickname}</View>
          </View>
          {userinfo.isoneself ? (
            <View
              className='ugcmember_t_data_r'
              onClick={topages.bind(this, '/mdugc/pages/make_newslist/index')}
            >
              <View className='ugcmember_t_data_r_icon icon-xiaoxi'></View>
              {userinfo.unread_nums > 0 ? (
                <View className='ugcmember_t_data_r_num'>{userinfo.unread_nums}</View>
              ) : null}
            </View>
          ) : null}
        </View>
        <View className='ugcmember_t_news'>
          <View className='ugcmember_t_news_l'>
            {userinfo.unionid != '18888888888' ? (
              <View
                className='ugcmember_t_news_l_i'
                onClick={topages.bind(
                  this,
                  `/mdugc/pages/make_followfans/index?type=follower&user_id=${userinfo.userid}`
                )}
              >
                <View className='ugcmember_t_news_l_i_t'>{userinfo.idols}</View>
                <View className='ugcmember_t_news_l_i_b'>关注</View>
              </View>
            ) : null}

            <View
              className='ugcmember_t_news_l_i'
              onClick={topages.bind(
                this,
                `/mdugc/pages/make_followfans/index?type=user&user_id=${userinfo.userid}`
              )}
            >
              <View className='ugcmember_t_news_l_i_t'>{userinfo.followers}</View>
              <View className='ugcmember_t_news_l_i_b'>粉丝</View>
            </View>
            <View className='ugcmember_t_news_l_i' onClick={openonLast.bind(this)}>
              <View className='ugcmember_t_news_l_i_t'>{userinfo.likes}</View>
              <View className='ugcmember_t_news_l_i_b'>获赞</View>
            </View>
          </View>
          {userinfo.isoneself ? null : userinfo.follow_status ? (
            <View className='ugcmember_t_news_r' onClick={followercreate.bind(this)}>
              已关注
            </View>
          ) : (
            <View className='ugcmember_t_news_r follow' onClick={followercreate.bind(this)}>
              关注
            </View>
          )}
        </View>
      </View>
      <AtTabs current={curTagId} scroll tabList={tab} onClick={handleTagChange.bind(this)}>
        <AtTabsPane current={curTagId} index={0}>
          <View className='ugcmember_b'>
            <View className='ugcmember_b_list'>
              <ScrollView
                scrollY
                className='ugcmember_b_list__scroll'
                scrollTop={scrollTop}
                scrollWithAnimation
                onScroll={handleScroll}
                onScrollToLower={nextPage}
              >
                {userinfo.isoneself && userinfo.draft_post && userinfo.draft_post.post_id ? (
                  <View
                    className='ugcmember_b_list__scroll_draft'
                    onClick={topages.bind(
                      this,
                      `/mdugc/pages/make/index?post_id=${userinfo.draft_post.post_id}&md_drafts=true`
                    )}
                  >
                    <View className='ugcmember_b_list__scroll_draft_icon icon-caogao'></View>
                    <View className='ugcmember_b_list__scroll_draft_text'>本地草稿</View>
                  </View>
                ) : null}
                <View className='ugcmember_b_list__scroll_scrolls'>
                  <View className='ugcmember_b_list__scroll_scrolls_left'>
                    {oddList.map((item, index) => {
                      return (
                        <View className='ugcmember_b_list__scroll_scrolls_item' key={index}>
                          <Scrollitem item={item} type={userinfo.isoneself ? 'member' : ''} />
                        </View>
                      )
                    })}
                  </View>
                  <View className='ugcmember_b_list__scroll_scrolls_right'>
                    {evenList.map((item, index) => {
                      return (
                        <View className='ugcmember_b_list__scroll_scrolls_item' key={index}>
                          <Scrollitem item={item} type={userinfo.isoneself ? 'member' : ''} />
                        </View>
                      )
                    })}
                  </View>
                </View>
                {page.isLoading && <Loading>正在加载...</Loading>}
                {!page.isLoading && !page.hasNext && !list.length && (
                  <SpNote img='trades_empty.png'>列表页为空!</SpNote>
                )}
              </ScrollView>
            </View>
          </View>
        </AtTabsPane>
        <AtTabsPane current={curTagId} index={1}></AtTabsPane>
        <AtTabsPane current={curTagId} index={2}></AtTabsPane>
      </AtTabs>
      {/* <View className='ugcmember_b'>
          <View className='ugcmember_b_list'>

            <ScrollView
              scrollY
              className='ugcmember_b_list__scroll'
              scrollTop={scrollTop}
              scrollWithAnimation
              onScroll={this.handleScroll}
              onScrollToLower={this.nextPage}
            >
                <View className='ugcmember_b_list__scroll_tab'>
                  {
                    tab.map((item,i)=>{
                      return(
                        userinfo.unionid=='18888888888' && i>0?(
                          null
                        ):(
                        <View className={`ugcmember_b_list__scroll_tab_i ${curTagId==item.t_id?'active':''}`} onClick={this.handleTagChange.bind(this,item)}>
                          {item.title}
                        </View>
                        )
                      )
                    })
                  }

                </View>
                {
                  (userinfo.isoneself && userinfo.draft_post && userinfo.draft_post.post_id) ?(
                    <View className='ugcmember_b_list__scroll_draft' onClick={this.topages.bind(this,`/mdugc/pages/make/index?post_id=${userinfo.draft_post.post_id}&md_drafts=true`)}>
                      <View className='ugcmember_b_list__scroll_draft_icon icon-caogao'></View>
                      <View className='ugcmember_b_list__scroll_draft_text'>本地草稿</View>
                    </View>
                  ):null
                }
                <View className="ugcmember_b_list__scroll_scrolls">
                  <View className='ugcmember_b_list__scroll_scrolls_left'>
                    {
                          oddList.map(item => {
                              return (
                                <View className="ugcmember_b_list__scroll_scrolls_item">
                                  <Scrollitem
                                    item={item}
                                    type={userinfo.isoneself?'member':''}
                                  />
                                </View>
                                  )
                          })
                      }
                  </View>
                  <View className='ugcmember_b_list__scroll_scrolls_right'>
                      {
                          evenList.map(item => {
                              return (
                                <View className="ugcmember_b_list__scroll_scrolls_item">
                                  <Scrollitem
                                    item={item}
                                    type={userinfo.isoneself?'member':''}
                                  />
                                </View>
                                  )
                          })
                      }
                  </View>
                </View>
                {
                  page.isLoading && <Loading>正在加载...</Loading>
                }
                {
                  !page.isLoading && !page.hasNext && !list.length
                  && (<SpNote img='trades_empty.png'>列表页为空!</SpNote>)
                }
            </ScrollView>
          </View>
        </View> */}
      <BackToTop
        show={showBackToTop}
        // onClick={scrollBackToTop}
        bottom={150}
      />
      {isPopups ? (
        <Popups title='获赞' text={popnum} istext={true} Last={onLast.bind(this)}></Popups>
      ) : null}
    </View>
  )
}
export default mdugcmember
