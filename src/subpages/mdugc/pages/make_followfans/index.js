import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import S from '@/spx'
import { connect } from 'react-redux'
import { SpNote, BackToTop, Loading } from '@/components'
import { pickBy } from '@/utils'
import { withPager, withBackToTop } from '@/hocs'

import api from '@/api'

//import '../../font/iconfont.scss'
import './index.scss'

@connect(({ member }) => ({
  memberData: member.member
}))
@withPager
@withBackToTop
export default class make_followfans extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      list: [],
      val: '', //搜索框
      type: ''
    }
  }
  config = {
    enablePullDownRefresh: true,
    'backgroundTextStyle': 'dark'
  }
  componentDidShow() {
    const { type, user_id } = getCurrentInstance().router.params
    const { memberData } = this.props

    let title = ''
    if (type == 'user') {
      title = '粉丝'
    } else {
      title = '关注'
    }
    if (memberData.memberInfo.user_id == user_id) {
      title = '我的' + title
    }
    Taro.setNavigationBarTitle({
      title
    })
    this.resetPage()
    this.setState(
      {
        type,
        list: []
      },
      () => {
        this.nextPage()
      }
    )
  }
  // 列表
  async fetch(params) {
    const { page_no, page_size } = params
    const { user_id } = getCurrentInstance().router.params
    let { type } = this.state
    let { memberData } = this.props
    params = {
      page_no,
      page_size,
      user_id,
      user_type: type
    }
    const { list, total_count: total } = await api.mdugc.followerlist(params)
    console.log('list, total', list, total)

    this.setState(
      {
        list: [...this.state.list, ...list]
      },
      () => {
        Taro.stopPullDownRefresh()
      }
    )

    return { total }
  }
  // 关注|取消关注
  followercreate = async (i) => {
    const { memberData } = this.props
    let { list } = this.state
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
    this.setState({
      list
    })
  }
  topages = (url) => {
    console.log('url', url)
    Taro.navigateTo({ url })
  }
  // 下拉刷新
  onPullDownRefresh() {
    console.log('下拉')
    Taro.startPullDownRefresh()
    this.resetPage()
    this.setState(
      {
        list: []
      },
      () => {
        this.nextPage()
      }
    )
  }

  render() {
    const { list, page, showBackToTop, scrollTop } = this.state
    const { type, user_id } = getCurrentInstance().router.params

    return (
      <View className='follow'>
        <View className='follow_list'>
          <ScrollView
            scrollY
            className={`follow_list__scroll ${
              memberData.memberInfo.user_id != user_id ? 'itemrn' : ''
            }`}
            scrollTop={scrollTop}
            scrollWithAnimation
            onScroll={this.handleScroll}
            onScrollToLower={this.nextPage}
          >
            <View className='follow_list__scroll_scrolls'>
              {list.map((item, i) => {
                return (
                  <View className='follow_list__scroll_scrolls_item' key={i}>
                    <View
                      className='follow_list__scroll_scrolls_item_l'
                      onClick={this.topages.bind(
                        this,
                        `/mdugc/pages/member/index?user_id=${item.user_id}`
                      )}
                    >
                      <Image
                        className='follow_list__scroll_scrolls_item_l_img'
                        mode='aspectFill'
                        src={item.headimgurl}
                      />
                    </View>
                    <View className='follow_list__scroll_scrolls_item_cen'>
                      <View className='follow_list__scroll_scrolls_item_cen_title'>
                        {item.nickname}
                      </View>
                    </View>
                    {item.mutal_follow == 0 ? (
                      type == 'user' ? (
                        <View
                          onClick={this.followercreate.bind(this, i)}
                          className='follow_list__scroll_scrolls_item_r'
                        >
                          回粉
                        </View>
                      ) : (
                        <View className='follow_list__scroll_scrolls_item_r active'>已关注</View>
                      )
                    ) : (
                      <View className='follow_list__scroll_scrolls_item_r active'>互相关注</View>
                    )}
                  </View>
                )
              })}
            </View>
            {page.isLoading && <Loading>正在加载...</Loading>}
            {!page.isLoading && !page.hasNext && !list.length && (
              <SpNote img='trades_empty.png'>列表页为空!</SpNote>
            )}
          </ScrollView>
        </View>

        <BackToTop show={showBackToTop} onClick={this.scrollBackToTop} bottom={150} />
      </View>
    )
  }
}
