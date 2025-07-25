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
export default class make_fabulous extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      list: [],
      val: '' //搜索框
    }
  }

  async componentDidMount() {
    let { num } = this.$router.params
    let data = {
      type: 'like'
    }
    console.log('num', num, num == 0, !num, toString.call(num))
    // num=Number(num)
    if (num) {
      console.log('触发num')
      let { type } = await api.mdugc.messagesetTohasRead(data)
    }
    this.nextPage()
  }
  config = {
    navigationBarTitleText: '收到的赞'
  }
  // 列表
  async fetch(params) {
    const { page_no: page, page_size: pageSize } = params
    params = {
      page,
      pageSize,
      type: 'like'
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
      post_id: 'post_id'
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
      <View className='fabulous'>
        <View className='fabulous_list'>
          <ScrollView
            scrollY
            className='fabulous_list__scroll'
            scrollTop={scrollTop}
            scrollWithAnimation
            onScroll={this.handleScroll}
            onScrollToLower={this.nextPage}
          >
            <View className='fabulous_list__scroll_scrolls'>
              {list.map((item) => {
                return (
                  <View
                    className='fabulous_list__scroll_scrolls_item'
                    onClick={this.topages.bind(
                      this,
                      `/mdugc/pages/make_details/index?item_id=${item.post_id}`
                    )}
                  >
                    <View className='fabulous_list__scroll_scrolls_item_l'>
                      <Image
                        className='fabulous_list__scroll_scrolls_item_l_img'
                        mode='aspectFill'
                        src={item.from_userInfo.avatar}
                      />
                    </View>
                    <View className='fabulous_list__scroll_scrolls_item_cen'>
                      <View className='fabulous_list__scroll_scrolls_item_cen_title'>
                        {item.from_nickname}
                      </View>
                      <View className='fabulous_list__scroll_scrolls_item_cen_text'>
                        <View className='fabulous_list__scroll_scrolls_item_cen_text_word'>
                          {item.title}
                          {/* ：{item.content} */}
                        </View>
                        <View className='fabulous_list__scroll_scrolls_item_cen_text_time'>
                          {item.time}
                        </View>
                      </View>
                    </View>
                    <View className='fabulous_list__scroll_scrolls_item_r'>
                      <Image
                        className='fabulous_list__scroll_scrolls_item_r_img'
                        mode='aspectFill'
                        src={item.postInfo.cover}
                      />
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
