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
import api from '@/api'
import * as mdugcApi from '@/api/mdugc'
import { $t, i18n } from '@/i18n'

import './index.scss'

@withPager
@withBackToTop
export default class make_collection extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      list: [],
      val: '' //搜索框
    }
  }

  async componentDidMount() {
    let { num } = this.$router?.params
    let data = {
      type: 'favoritePost'
    }
    if (num) {
      let { type } = await mdugcApi.messagesetTohasRead(data)
    }
    this.nextPage()
    Taro.setNavigationBarTitle({ title: $t('8a8e947d.5918ce') })
    this._onMakeCollectionLang = () => {
      Taro.setNavigationBarTitle({ title: $t('8a8e947d.5918ce') })
      this.forceUpdate()
    }
    i18n.on('languageChanged', this._onMakeCollectionLang)
  }
  config = {
    navigationBarTitleText: ''
  }

  componentWillUnmount() {
    if (this._onMakeCollectionLang) {
      i18n.off('languageChanged', this._onMakeCollectionLang)
    }
  }
  // 列表
  async fetch(params) {
    const { page_no: page, page_size: pageSize } = params
    params = {
      page,
      pageSize,
      type: 'favoritePost'
    }
    const { list, total_count: total } = await mdugcApi.messagelist(params)
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
      <View className='collection'>
        <View className='collection_list'>
          <ScrollView
            scrollY
            className='collection_list__scroll'
            scrollTop={scrollTop}
            scrollWithAnimation
            onScroll={this.handleScroll}
            onScrollToLower={this.nextPage}
          >
            <View className='collection_list__scroll_scrolls'>
              {list.map((item) => {
                return (
                  <View
                    className='collection_list__scroll_scrolls_item'
                    onClick={this.topages.bind(
                      this,
                      `/mdugc/pages/make_details/index?item_id=${item.post_id}`
                    )}
                  >
                    <View className='collection_list__scroll_scrolls_item_l'>
                      <Image
                        className='collection_list__scroll_scrolls_item_l_img'
                        mode='aspectFill'
                        src={item.from_userInfo.avatar}
                      />
                    </View>
                    <View className='collection_list__scroll_scrolls_item_cen'>
                      <View className='collection_list__scroll_scrolls_item_cen_title'>
                        {item.from_nickname}
                      </View>
                      <View className='collection_list__scroll_scrolls_item_cen_text'>
                        <View className='collection_list__scroll_scrolls_item_cen_text_word'>
                          {item.title}
                        </View>
                        <View className='collection_list__scroll_scrolls_item_cen_text_time'>
                          {item.time}
                        </View>
                      </View>
                    </View>
                    <View className='collection_list__scroll_scrolls_item_r'>
                      <Image
                        className='collection_list__scroll_scrolls_item_r_img'
                        mode='aspectFill'
                        src={item.postInfo.cover}
                      />
                    </View>
                  </View>
                )
              })}
            </View>
            {page.isLoading && <Loading>{$t('8a8e947d.bd0271')}</Loading>}
            {!page.isLoading && !page.hasNext && !list.length && (
              <SpNote img='trades_empty.png'>{$t('8a8e947d.1feb58')}</SpNote>
            )}
          </ScrollView>
        </View>

        <BackToTop show={showBackToTop} onClick={this.scrollBackToTop} bottom={150} />
      </View>
    )
  }
}
