import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import S from '@/spx'

import { SpNote, BackToTop, FloatMenus, FloatMenuItem } from '@/components'
import { pickBy } from '@/utils'
import { withPager, withBackToTop } from '@/hocs'

import api from '@/api'
import { SearchBar, TagsBar, Scrollitem, TabBar } from '../../components'

import './index.scss'

@withPager
@withBackToTop
export default class mdugclist extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      list: [],
      oddList: [],
      evenList: [],
      curTagId: '',
      topic_name: '',
      istag: 1,
      refresherTriggered: false
    }
  }

  componentDidMount() {
    let { item } = this.$router.params
    item = JSON.parse(item)
    let { topic_id, topic_name } = item
    this.setState(
      {
        curTagId: topic_id,
        topic_name
      },
      () => {
        this.nextPage()
      }
    )
  }
  config = {
    navigationBarTitleText: '话题'
  }
  componentDidShow() {
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
  // 热度
  onistag = (istag) => {
    this.resetPage()
    this.setState({
      list: [],
      oddList: [],
      evenList: []
    })

    this.setState(
      {
        istag
      },
      () => {
        this.nextPage()
      }
    )
  }
  // 列表
  async fetch(params) {
    Taro.showLoading({
      title: '正在加载...'
    })
    const { curTagId } = this.state
    const { page_no: page, istag, page_size: pageSize } = params
    params = {
      page,
      pageSize,
      sort: istag == 1 ? 'likes desc' : 'created desc',
      topics: [curTagId]
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
        likes: 'likes',
        isheart: 'like_status',
        badges: 'badges'
      })
    }

    console.log('这是nlist', nList)

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
        evenList: [...this.state.evenList, ...even],
        refresherTriggered: false
      },
      () => {
        Taro.hideLoading()
      }
    )

    return { total }
  }
  handleClickItem = (item) => {
    console.log('item', item)
  }
  // 浮动按钮跳转
  topages = (url) => {
    console.log('url', url)
    Taro.navigateTo({ url })
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
        // if(idx_odd>=0){
        //   oddList=that.setlist(oddList,idx_odd,type)
        // }else{
        //   evenList=that.setlist(evenList,idx_even,type)
        // }
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
  // 自定义下拉刷新
  onRefresherRefresh = () => {
    const { refresherTriggered } = this.state
    // 正处于刷新状态
    if (refresherTriggered) return
    this.setState({
      refresherTriggered: true // 手动调整刷新状态
    })

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
      list,
      istag,
      topic_name,
      page,
      oddList,
      evenList,
      showBackToTop,
      scrollTop,
      refresherTriggered
    } = this.state
    return (
      <View className='ugclist'>
        <View className='ugclist_title'>#{topic_name}</View>
        <View className='ugclist_list'>
          <View className='ugclist_list__tag'>
            <View
              onClick={this.onistag.bind(this, 1)}
              className={
                istag == 1 ? 'ugclist_list__tag_i ugclist_list__tag_iact' : 'ugclist_list__tag_i'
              }
            >
              最热
            </View>
            <View
              onClick={this.onistag.bind(this, 2)}
              className={
                istag == 2 ? 'ugclist_list__tag_i ugclist_list__tag_iact' : 'ugclist_list__tag_i'
              }
            >
              最新
            </View>
          </View>
          <ScrollView
            scrollY
            className='ugclist_list__scroll'
            scrollTop={scrollTop}
            scrollWithAnimation
            onScroll={this.handleScroll}
            onScrollToLower={this.nextPage}
            refresherEnabled
            refresherTriggered={refresherTriggered}
            onRefresherRefresh={this.onRefresherRefresh}
          >
            <View className='ugclist_list__scroll_scrolls'>
              <View className='ugclist_list__scroll_scrolls_left'>
                {oddList.map((item) => {
                  return (
                    <View className='ugclist_list__scroll_scrolls_item'>
                      <Scrollitem item={item} />
                    </View>
                  )
                })}
              </View>
              <View className='ugclist_list__scroll_scrolls_right'>
                {evenList.map((item) => {
                  return (
                    <View className='ugclist_list__scroll_scrolls_item'>
                      <Scrollitem item={item} />
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
        <View className={showBackToTop ? 'ugcindex_floatmenus' : ''}>
          <FloatMenus>
            <FloatMenuItem
              iconPrefixClass='icon'
              icon='gerenzhongxin'
              onClick={this.topages.bind(this, '/mdugc/pages/member/index')}
            />
            <FloatMenuItem
              iconPrefixClass='icon'
              icon='jiahao'
              onClick={this.topages.bind(this, '/mdugc/pages/make/index')}
            />
          </FloatMenus>
        </View>
        {showBackToTop ? (
          <BackToTop show={showBackToTop} onClick={this.scrollBackToTop} bottom={150} />
        ) : null}
      </View>
    )
  }
}
