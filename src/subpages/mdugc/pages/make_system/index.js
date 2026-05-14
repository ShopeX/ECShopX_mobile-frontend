/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { SpNote, BackToTop, Loading } from '@/components'
import { pickBy } from '@/utils'
import { withPager, withBackToTop } from '@/hocs'
import * as mdugcApi from '@/api/mdugc'
import { $t, i18n } from '@/i18n'
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
    let { num } = this.$router?.params
    let data = {
      type: 'system'
    }
    if (num) {
      let { type } = await mdugcApi.messagesetTohasRead(data)
    }

    Taro.setNavigationBarTitle({ title: $t('8558ef14.891584') })
    this._onMakeSystemLang = () => {
      Taro.setNavigationBarTitle({ title: $t('8558ef14.891584') })
      this.forceUpdate()
    }
    i18n.on('languageChanged', this._onMakeSystemLang)
    this.nextPage()
  }

  componentWillUnmount() {
    if (this._onMakeSystemLang) {
      i18n.off('languageChanged', this._onMakeSystemLang)
    }
  }

  config = {
    navigationBarTitleText: ''
  }
  // 列表
  async fetch(params) {
    const { page_no: page, page_size: pageSize } = params
    params = {
      page,
      pageSize,
      type: 'system'
    }
    const { list, total_count: total } = await mdugcApi.messagelist(params)
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
                          {$t('8558ef14.1c2a7b')}
                          <Text className='system_list__scroll_scrolls_item_content_b_icon icon-jiantouxiangzuo'></Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                )
              })}
            </View>
            {page.isLoading && <Loading>{$t('8558ef14.bd0271')}</Loading>}
            {!page.isLoading && !page.hasNext && !list.length && (
              <SpNote img='trades_empty.png'>{$t('8558ef14.1feb58')}</SpNote>
            )}
          </ScrollView>
        </View>

        <BackToTop show={showBackToTop} onClick={this.scrollBackToTop} bottom={150} />
      </View>
    )
  }
}
