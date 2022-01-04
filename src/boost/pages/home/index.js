import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { SpNavBar } from '@/components'
import api from '@/api'
import { debounce, pickBy } from '@/utils'
import LoadingMore from '../../component/loadingMore'
import BargainItem from '../../component/bargainItem'

import './index.scss'

export default class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
      param: {
        page: 1,
        pageSize: 10
      },
      list: [],
      scrollTop: 0,
      isRefresh: false,
      isLoading: false,
      isEnd: false,
      isEmpty: false
    }
  }
  componentDidMount () {
    this.getList()
  }

  getList = async (isRefrsh = false) => {
    Taro.showLoading({ title: '正在加载中', mask: true })
    const { param, list } = this.state
    const data = await api.boost.getList(param)
    const total_count = data.total_count
    const isEnd = param.page >= total_count / param.pageSize
    const newList = pickBy(data.list || [], {
      item_pics: 'item_pics',
      item_name: 'item_name',
      bargain_id: 'bargain_id',
      mkt_price: ({ mkt_price }) => (mkt_price / 100).toFixed(2),
      price: ({ price }) => (price / 100).toFixed(2),
      diff_price: ({ mkt_price, price }) => ((mkt_price - price) / 100).toFixed(2)
    })
    this.setState({
      list: isRefrsh ? newList : [...list, ...newList],
      isRefresh: false,
      isLoading: false,
      isEnd,
      isEmpty: !data.list || data.list.length <= 0
    })
    Taro.hideLoading()
  }

  // 滚动事件
  onScroll = debounce((e) => {
    const { scrollTop } = e.detail
    this.setState({
      scrollTop
    })
  }, 1000)

  // 下拉刷新
  handleRefresh = () => {
    const { param } = this.state
    param.page = 1
    this.setState({
      isRefresh: true,
      param
    })
    this.getList(true)
  }

  // 上拉加载
  handleLoadMore = () => {
    const { isLoading, isEnd, param, isEmpty } = this.state
    if (isEnd || isLoading || isEmpty) return
    this.setState({
      param: {
        page: ++param.page,
        pageSize: param.pageSize
      },
      isLoading: true
    })
    this.getList()
  }

  render () {
    const { list, scrollTop, isRefresh, isLoading, isEnd, isEmpty } = this.state
    return (
      <View className='home'>
        <SpNavBar title='助力首页' leftIconType='chevron-left' fixed='true' />
        <ScrollView
          className='list'
          scrollY
          scroll-anchoring
          refresherEnabled
          scrollWithAnimation
          scrollTop={scrollTop}
          onScroll={this.onScroll}
          refresherTriggered={isRefresh}
          onRefresherRefresh={this.handleRefresh}
          onScrollToLower={this.handleLoadMore}
        >
          {/* 列表图 */}
          {list.map((item) => (
            <View className='item' key={item.bargain_id}>
              <BargainItem info={item} />
            </View>
          ))}
          {/* 加载更多 */}
          <LoadingMore isLoading={isLoading} isEnd={isEnd} isEmpty={isEmpty} />
          {/* 防止子内容无法支撑scroll-view下拉刷新 */}
          <View style='width:2rpx;height:2rpx;bottom:-2rpx;position:absolute;' />
        </ScrollView>
      </View>
    )
  }
}
