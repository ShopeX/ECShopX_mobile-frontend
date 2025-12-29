/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { SpNote, BackToTop, Loading } from '@/components'
import { pickBy } from '@/utils'
import { withPager, withBackToTop } from '@/hocs'
import { connect } from 'react-redux'

import api from '@/api'

import './index.scss'

@connect(({ member }) => ({
  memberData: member.member
}))
@withPager
@withBackToTop
export default class make_follow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      list: [],
      val: '' //搜索框
    }
  }

  async componentDidShow() {
    let { num } = this.$router.params
    let data = {
      type: 'followerUser'
    }
    if (num) {
      let { type } = await api.mdugc.messagesetTohasRead(data)
    }
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
  config = {
    navigationBarTitleText: '新增关注'
  }
  // 列表
  async fetch(params) {
    const { page_no: page, page_size: pageSize } = params
    params = {
      page,
      pageSize,
      type: 'followerUser'
    }
    const { list, total_count: total } = await api.mdugc.messagelist(params)
    console.log('list, total', list, total)

    const nList = pickBy(list, {
      postInfo: 'postInfo',
      item_id: 'article_id',
      title: 'title',
      from_userInfo: 'from_userInfo',
      content: 'content',
      time: 'created_moment',
      from_nickname: 'from_nickname',
      mutal_follow: 'mutal_follow',
      from_user_id: 'from_user_id'
    })
    this.setState({
      list: [...this.state.list, ...nList]
    })

    return { total }
  }
  followercreate = async (i) => {
    let { list } = this.state
    const { memberData } = this.props

    let data = {
      user_id: list[i].from_user_id,
      follower_user_id: memberData.memberInfo.user_id
    }
    let res = await api.mdugc.followercreate(data)
    if (res.action == 'unfollow') {
      list[i].mutal_follow = 0
      Taro.showToast({
        icon: 'none',
        title: '取消关注'
      })
    } else if (res.action == 'follow') {
      list[i].mutal_follow = 1
      Taro.showToast({
        icon: 'none',
        title: '关注成功'
      })
    }
    this.setState({
      list
    })
  }
  topages = (url) => {
    console.log('url', url)
    Taro.navigateTo({ url })
  }

  render() {
    const { list, page, showBackToTop, scrollTop } = this.state
    return (
      <View className='follow'>
        <View className='follow_list'>
          <ScrollView
            scrollY
            className='follow_list__scroll'
            scrollTop={scrollTop}
            scrollWithAnimation
            onScroll={this.handleScroll}
            onScrollToLower={this.nextPage}
          >
            <View className='follow_list__scroll_scrolls'>
              {list.map((item, i) => {
                return (
                  <View
                    className='follow_list__scroll_scrolls_item'
                    onClick={this.topages.bind(
                      this,
                      `/mdugc/pages/member/index?user_id=${item.from_user_id}`
                    )}
                  >
                                                     {' '}
                    <View className='follow_list__scroll_scrolls_item_l'>
                                                         {' '}
                      <Image
                        className='follow_list__scroll_scrolls_item_l_img'
                        mode='aspectFill'
                        src={item.from_userInfo.avatar}
                      />
                                                       {' '}
                    </View>
                                                     {' '}
                    <View className='follow_list__scroll_scrolls_item_cen'>
                                                         {' '}
                      <View className='follow_list__scroll_scrolls_item_cen_title'>
                                                              {item.nickname}           {' '}
                      </View>
                                                         {' '}
                      <View className='follow_list__scroll_scrolls_item_cen_text'>
                                                             {' '}
                        <View className='follow_list__scroll_scrolls_item_cen_text_word'>
                                                                  {item.title}               {' '}
                        </View>
                                                             {' '}
                        <View className='follow_list__scroll_scrolls_item_cen_text_time'>
                          {item.time}
                        </View>
                                                           {' '}
                      </View>
                                                       {' '}
                    </View>
                                                     {' '}
                    {item.mutal_follow ? (
                      <View
                        className='follow_list__scroll_scrolls_item_r active'
                        onClick={this.followercreate.bind(this, i)}
                      >
                        互相关注
                      </View>
                    ) : (
                      <View
                        className='follow_list__scroll_scrolls_item_r'
                        onClick={this.followercreate.bind(this, i)}
                      >
                        回粉
                      </View>
                    )}
                                                 {' '}
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
