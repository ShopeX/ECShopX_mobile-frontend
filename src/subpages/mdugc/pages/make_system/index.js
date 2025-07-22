import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { SpNote, BackToTop, Loading } from '@/components'
import { pickBy } from '@/utils'
import { withPager, withBackToTop } from '@/hocs'

import api from '@/api'

import './index.scss'

@withPager
@withBackToTop
export default class make_system extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      list: [],
      val: ''
    }
  }

  async componentDidMount() {
    let { num } = this.$router.params
    let data = {
      type: 'system'
    }
    if (num) {
      let { type } = await api.mdugc.messagesetTohasRead(data)
    }

    this.nextPage()
  }
  config = {
    navigationBarTitleText: '系统通知'
  }
  // 列表
  async fetch(params) {
    const { page_no: page, page_size: pageSize } = params
    params = {
      page,
      pageSize,
      type: 'system'
    }
    const { list, total_count: total } = await api.mdugc.messagelist(params)
    console.log('list, total', list, total)

    const nList = pickBy(list, {
      title: 'title',
      content: 'content',
      created_text: 'created_text',
      sub_type: 'sub_type',
      post_id: 'post_id',
      commentInfo: 'commentInfo',
      postInfo: 'postInfo'
    })
    this.setState({
      list: [...this.state.list, ...nList]
    })

    return { total }
  }
  topages = (url) => {
    console.log('url', url)
    Taro.navigateTo({ url })
  }

  render() {
    const { list, page, showBackToTop, scrollTop } = this.state
    return (
      <View className='system'>
        <View className='system_list'>
          <ScrollView
            scrollY
            className='system_list__scroll'
            scrollTop={scrollTop}
            scrollWithAnimation
            onScroll={this.handleScroll}
            onScrollToLower={this.nextPage}
          >
            <View className='system_list__scroll_scrolls'>
              {list.map((item) => {
                return (
                  <View className='system_list__scroll_scrolls_item'>
                    <View className='system_list__scroll_scrolls_item_time'>
                      {item.created_text}
                    </View>
                    <View className='system_list__scroll_scrolls_item_content'>
                      <View className='system_list__scroll_scrolls_item_content_t'>
                        <View className='system_list__scroll_scrolls_item_content_t_warning'>
                          {item.title}
                        </View>
                        <View className='system_list__scroll_scrolls_item_content_t_title'>
                          {item.content}
                        </View>
                        <View className='system_list__scroll_scrolls_item_content_t_text'>
                          {item.sub_type == 'refusePost'
                            ? item.postInfo.content
                            : item.commentInfo.content}
                        </View>
                      </View>
                      {item.sub_type == 'refusePost' ? (
                        <View
                          className='system_list__scroll_scrolls_item_content_b'
                          onClick={this.topages.bind(
                            this,
                            `/mdugc/pages/make/index?post_id=${item.post_id}`
                          )}
                        >
                          修改笔记
                          <Text className='system_list__scroll_scrolls_item_content_b_icon icon-jiantouxiangzuo'></Text>
                        </View>
                      ) : null}
                    </View>
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
