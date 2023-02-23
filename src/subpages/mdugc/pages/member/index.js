import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Button, ScrollView, Image } from '@tarojs/components'

import { Scrollitem, Popups } from '../../components'
import S from '@/spx'
import { connect } from 'react-redux'

import { SpNote, BackToTop, FloatMenus, FloatMenuItem, Loading } from '@/components'
import { pickBy } from '@/utils'
import { withPager, withBackToTop } from '@/hocs'
import { AtTabs, AtTabsPane } from 'taro-ui'

import api from '@/api'

//import '../../font/iconfont.scss'
import './index.scss'
@connect(({ member }) => ({
  memberData: member.member
}))
@withPager
@withBackToTop
export default class mdugcmember extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
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
      ],
      istop: false, //是否到达顶部
      startX: 0, // 开始坐标
      startY: 0
    }
  }

  async componentDidMount() {

    let  {memberData}  = this.props
    console.log(123,memberData)
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

      return
    }
    let { user_id } = this.$router.params
    let file_drafts = wx.getStorageSync('md_drafts')
    let { userinfo } = this.state
    let userid = ''
    let that = this
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
    this.getuserinfo(userid)
    userinfo.userid = userid
    this.setState(
      {
        userinfo
      },
      () => {
        that.nextPage()
      }
    )
  }
  getuserinfo = async (userid) => {
    let { popnum, tab } = this.state
    let userinfos = this.state.userinfo
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
      this.setState({
        popnum,
        userinfo: userinfos
      })
  }
  config = {
    navigationBarTitleText: '个人主页',
    enablePullDownRefresh: true,
    'backgroundTextStyle': 'dark'
  }
  componentDidShow() {
    if (this.state.userinfo.userid) {
      this.getuserinfo(this.state.userinfo.userid)
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
      this.updatelist(post_id, 'delete')
      setTimeout(() => {
        currentPage.setData({
          //清空上一页面传递值
          delete: ''
        })
      }, 1000)
    } else if (currentPage.__data__.heart) {
      console.log('这是笔记详情传递的点赞数据', currentPage.__data__.heart)
      let heart = currentPage.__data__.heart
      this.updatelist(heart.item_id, heart.isheart, heart.likes)
      setTimeout(() => {
        currentPage.setData({
          //清空上一页面传递值
          heart: ''
        })
      }, 1000)
    }
  }
  // 更新列表
  updatelist = (post_id, type, likes) => {
    let { list, oddList, evenList } = this.state
    let idx = list.findIndex((item) => item.item_id == post_id)
    let idx_odd = oddList.findIndex((item) => item.item_id == post_id)
    let idx_even = evenList.findIndex((item) => item.item_id == post_id)
    let that = this
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
        list = that.setlist(list, idx, type, likes)
        console.log('这是改后数据', list, oddList, evenList)
      }
      this.setState({
        list,
        oddList,
        evenList
      })
    }
  }
  setlist = (lists, idxs, types, likes) => {
    let listi = lists,
      idx = idxs,
      type = types
    listi[idx].isheart = type
    listi[idx].likes = likes
    return listi
  }
  async fetch(params) {
    const { curTagId, userinfo } = this.state
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
    this.setState(
      {
        list: [...this.state.list, ...nList],
        oddList: [...this.state.oddList, ...odd],
        evenList: [...this.state.evenList, ...even]
      },
      () => {
        Taro.stopPullDownRefresh()
      }
    )

    return { total }
  }
  topages = (url) => {
    Taro.navigateTo({
      url
    })
  }
  handleTagChange = (i) => {
    this.setState({
      curTagId: i
    })
    setTimeout(() => {
      this.resetPage()
      this.setState(
        {
          list: [],
          oddList: [],
          evenList: []
        },
        () => {
          this.nextPage()
        }
      )
    }, 50)
  }
  // 开启弹窗
  openonLast = () => {
    this.setState({
      isPopups: true
    })
  }
  // 关闭弹窗
  onLast = (isLast) => {
    console.log('这是遮罩层数据', isLast)
    this.setState({
      isPopups: false
    })
  }
  // 关注|取消关注
  followercreate = async () => {
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
    const { memberData } = this.props
    let { userinfo } = this.state
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
    this.setState({
      userinfo
    })
  }
  onPageScroll = (e) => {
    let that = this
    let { istop } = this.state
    // Taro.nextTick(() => {
    Taro.createSelectorQuery()
      .in(this.$scope)
      .select('#scroll')
      .boundingClientRect()
      .exec((res) => {
        let obj = res[0]
        console.log('这是元素', obj.top)
        if (obj.top <= 0) {
          istop = true
          if (!this.state.istop) {
            that.setState({
              istop
            })
          }
        } else {
          istop = false
          if (this.state.istop) {
            that.setState({
              istop
            })
          }
        }
      })
    // })
    console.log(e.scrollTop)
  }
  // 滑动开始
  touchstart(e) {
    this.setState({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY
    })
  }

  // 滑动事件处理 _index当前索引
  touchmove(e) {
    const that = this
    let { curTagId } = this.state

    const startX = that.state.startX // 开始X坐标
    const startY = that.state.startY // 开始Y坐标
    const touchMoveX = e.changedTouches[0].clientX // 滑动变化坐标
    const touchMoveY = e.changedTouches[0].clientY // 滑动变化坐标
    console.log('这是坐标', touchMoveX, touchMoveY)

    // 获取滑动角度
    const angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY })

    // 滑动超过30度角 return
    if (Math.abs(angle) > 30) return

    // 临界值
    let num = Number(70)

    if (touchMoveX - startX > num) {
      console.log('上')
      if (curTagId > 0) {
        curTagId -= 1
      }
    } else if (startX - touchMoveX > num) {
      // 左滑
      console.log('下')
      if (curTagId < 2) {
        curTagId += 1
      }
    }
    console.log('hahaha')
    if (curTagId != this.state.curTagId) {
      this.handleTagChange(curTagId)
    }
  }

  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle(start, end) {
    const _X = end.X - start.X
    const _Y = end.Y - start.Y
    // 返回角度 /Math.atan()返回数字的反正切值
    return (360 * Math.atan(_Y / _X)) / (2 * Math.PI)
  }
  // 下拉刷新
  onPullDownRefresh() {
    Taro.startPullDownRefresh()
    console.log('下拉')
    if (this.state.userinfo.userid) {
      this.getuserinfo(this.state.userinfo.userid)
    }
    this.resetPage()
    this.setState(
      {
        list: [],
        oddList: [],
        evenList: []
      },
      () => {
        this.nextPage()
      }
    )
  }

  render() {
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
      userinfo,
      istop
    } = this.state

    return (
      <View className='ugcmember'>
        <View className='ugcmember_t'>
          <View className='ugcmember_t_data'>
            <View className='ugcmember_t_data_l'>
              <Image
                mode='aspectFit'
                src={userinfo.headimgurl}
                className='ugcmember_t_data_l_avatar'
              />
              <View className='ugcmember_t_data_l_name'>{userinfo.nickname}</View>
            </View>
            {userinfo.isoneself ? (
              <View
                className='ugcmember_t_data_r'
                onClick={this.topages.bind(this, '/subpages/mdugc/pages/make_newslist/index')}
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
                  onClick={this.topages.bind(
                    this,
                    `/subpages/mdugc/pages/make_followfans/index?type=follower&user_id=${userinfo.userid}`
                  )}
                >
                  <View className='ugcmember_t_news_l_i_t'>{userinfo.idols}</View>
                  <View className='ugcmember_t_news_l_i_b'>关注</View>
                </View>
              ) : null}

              <View
                className='ugcmember_t_news_l_i'
                onClick={this.topages.bind(
                  this,
                  `/subpages/mdugc/pages/make_followfans/index?type=user&user_id=${userinfo.userid}`
                )}
              >
                <View className='ugcmember_t_news_l_i_t'>{userinfo.followers}</View>
                <View className='ugcmember_t_news_l_i_b'>粉丝</View>
              </View>
              <View className='ugcmember_t_news_l_i' onClick={this.openonLast.bind(this)}>
                <View className='ugcmember_t_news_l_i_t'>{userinfo.likes}</View>
                <View className='ugcmember_t_news_l_i_b'>获赞</View>
              </View>
            </View>
            {userinfo.isoneself ? null : userinfo.follow_status ? (
              <View className='ugcmember_t_news_r' onClick={this.followercreate.bind(this)}>
                已关注
              </View>
            ) : (
              <View className='ugcmember_t_news_r follow' onClick={this.followercreate.bind(this)}>
                关注
              </View>
            )}
          </View>
        </View>

        <View id='scroll' className={istop ? 'ugcmember_scroll' : ''}>
          <AtTabs
            current={curTagId}
            tabList={tab}
            onClick={this.handleTagChange.bind(this)}
            animated={true}
            swipeable={false}
          >
            {tab.map((idx) => {
              return (
                <AtTabsPane current={curTagId} index={curTagId} key={idx}>
                  <View
                    className='ugcmember_b'
                    onTouchStart={this.touchstart.bind(this)}
                    onTouchEnd={this.touchmove.bind(this)}
                  >
                    <View className='ugcmember_b_list'>
                      <ScrollView
                        scrollY={true}
                        className='ugcmember_b_list__scroll'
                        scrollTop={scrollTop}
                        scrollWithAnimation
                        onScroll={this.handleScroll}
                        onScrollToLower={this.nextPage}
                      >
                        {curTagId == 0 &&
                        userinfo.isoneself &&
                        userinfo.draft_post &&
                        userinfo.draft_post.post_id ? (
                          <View
                            className='ugcmember_b_list__scroll_draft'
                            onClick={this.topages.bind(
                              this,
                              `/subpages/mdugc/pages/make/index?post_id=${userinfo.draft_post.post_id}&md_drafts=true`
                            )}
                          >
                            <View className='ugcmember_b_list__scroll_draft_icon icon-caogao'></View>
                            <View className='ugcmember_b_list__scroll_draft_text'>本地草稿</View>
                          </View>
                        ) : null}
                        <View className='ugcmember_b_list__scroll_scrolls'>
                          <View className='ugcmember_b_list__scroll_scrolls_left'>
                            {oddList.map((item) => {
                              return (
                                <View
                                  key={item.item_id}
                                  className='ugcmember_b_list__scroll_scrolls_item'
                                >
                                  <Scrollitem
                                    item={item}
                                    type={userinfo.isoneself ? 'member' : ''}
                                  />
                                </View>
                              )
                            })}
                          </View>
                          <View className='ugcmember_b_list__scroll_scrolls_right'>
                            {evenList.map((item) => {
                              return (
                                <View
                                  key={item.item_id}
                                  className='ugcmember_b_list__scroll_scrolls_item'
                                >
                                  <Scrollitem
                                    item={item}
                                    type={userinfo.isoneself ? 'member' : ''}
                                  />
                                </View>
                              )
                            })}
                          </View>
                        </View>
                        {/* {
                                page.isLoading && <Loading>正在加载...</Loading>
                              } */}
                        {!page.isLoading && !page.hasNext && !list.length && (
                          <SpNote img='trades_empty.png'>列表页为空!</SpNote>
                        )}
                      </ScrollView>
                    </View>
                  </View>
                </AtTabsPane>
              )
            })}
          </AtTabs>
          {page.isLoading && <Loading>正在加载...</Loading>}
        </View>
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
        <BackToTop show={showBackToTop} onClick={this.scrollBackToTop} bottom={150} />
        {isPopups ? (
          <Popups title='获赞' text={popnum} istext={true} Last={this.onLast.bind(this)}></Popups>
        ) : null}
      </View>
    )
  }
}
