/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Input } from '@tarojs/components'
import { SpNavBar } from '@/components'
import { debounce } from '@/utils'
import api from '@/api'
import entry from '@/utils/entry'
import entryLaunchFun from '@/utils/entryLaunch'
import { $t } from '@/i18n'
import LoadingMore from '../../component/loadingMore'

import './index.scss'

export default class Community extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      isRefresh: false,
      isLoading: false,
      isEnd: false,
      current: {},
      param: {
        page: 1,
        pageSize: 10
      },
      lbs: {
        lat: '',
        lng: ''
      }
    }
  }

  async componentDidMount() {
    this.init()
  }

  // 搜索框输入
  searchInput = (event) => {
    const { detail } = event
    const { param } = this.state
    param.keywords = detail.value
    this.setState({
      param
    })
  }

  // 获取定位
  init = async () => {
    const lbs = await entryLaunchFun.getLocationInfo()
    // if (lbs.lat) await InverseAnalysisGaode(lbs)
    // const lbs = this.getLoacl()
    if (!lbs) return false
    const { lat, lng } = lbs
    this.setState(
      {
        lbs: {
          lat,
          lng
        }
      },
      () => {
        this.getCommunity(true)
        this.getNearBuyCommunity()
      }
    )
  }

  // 定位
  // getLoacl = async () => {
  //   let lbs = ''
  //   if (Taro.getEnv() === 'WEAPP') {
  //     lbs = await Taro.getLocation({ type: 'gcj02' }).catch(() => {
  //       Taro.showModal({
  //         content: '您未授权访问您的定位信息，请先更改您的授权设置',
  //         showCancel: false,
  //         success: (res) => {
  //           if (res.confirm) {
  //             Taro.openSetting({
  //               success: () => {
  //                 this.init()
  //               }
  //             })
  //           }
  //         }
  //       })
  //       return false
  //     })
  //   } else {
  //     lbs = await entry.getWebLocal(false).catch(() => false)
  //   }
  //   return lbs
  // }

  // 获取社区列表
  getCommunity = async (isRefresh = false) => {
    const { param, list: oldList, lbs } = this.state
    isRefresh && Taro.showLoading({ title: $t('1a305f8e.bd0271'), mask: true })
    api.groupBy.activityCommunityList({ ...param, ...lbs }).then((res) => {
      const { total_count, list } = res
      this.setState({
        list: isRefresh ? list : [...oldList, ...list],
        isRefresh: false,
        isLoading: false,
        isEnd: param.page >= total_count / param.pageSize
      })
      isRefresh && Taro.hideLoading()
    })
  }

  // 获取附近活动社区
  getNearBuyCommunity = () => {
    const currentCommunity = Taro.getStorageSync('community')
    if (currentCommunity) {
      this.setState({
        current: currentCommunity
      })
    } else {
      const { lbs } = this.state
      console.log(lbs)
      api.groupBy.activityCommunity(lbs).then((res) => {
        Taro.setStorageSync('community', res)
        this.setState({
          current: res
        })
      })
    }
  }

  // 选择社区
  setCommunity = (community) => {
    Taro.setStorageSync('community', community)
    this.setState({
      current: community
    })
    Taro.navigateBack()
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
    this.getCommunity(true)
  }

  // 上拉加载
  handleLoadMore = () => {
    const { isLoading, isEnd, param } = this.state
    if (isEnd || isLoading) return
    param.page++
    this.setState({
      isLoading: true,
      param
    })
    this.getCommunity()
  }

  render() {
    const { list, isLoading, isEnd, isRefresh, scrollTop, current } = this.state
    return (
      <View className='community'>
        <SpNavBar title={$t('1a305f8e.147861')} leftIconType='chevron-left' fixed='true' />
        <View className='header'>
          {/* 搜索 */}
          <View className='search'>
            <View className='content'>
              <View className='iconfont icon-search'></View>
              <Input
                type='text'
                placeholder={$t('1a305f8e.6545f0')}
                confirmType='search'
                onInput={this.searchInput}
                onConfirm={this.handleRefresh}
              />
            </View>
          </View>
          <View className='myZiti'>
            <View className='title'>{$t('1a305f8e.c332d0')}</View>
            <View className='myCommunity' onClick={() => Taro.navigateBack()}>
              <View className='location'>{current.community_name}</View>
              <View className='distance'>
                {current.distance_show}
                {current.distance_unit}
              </View>
            </View>
          </View>
          <View className='nearBy'>
            <View>{$t('1a305f8e.20508d')}</View>
            <View onClick={this.init.bind(this)}>{$t('1a305f8e.b915af')}</View>
          </View>
        </View>
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
          {list.map((item) => (
            <View
              className='item'
              key={item.community_id}
              onClick={this.setCommunity.bind(this, item)}
            >
              <View className='name'>
                {item.city + item.area}({item.community_name})
              </View>
              <View className='distance'>
                {item.distance_show}
                {item.distance_unit}
              </View>
            </View>
          ))}
          {/* 加载更多 */}
          <LoadingMore isLoading={isLoading} isEnd={isEnd} />
          {/* 防止子内容无法支撑scroll-view下拉刷新 */}
          <View style='width:2rpx;height:2rpx;bottom:-2rpx;position:absolute;' />
        </ScrollView>
      </View>
    )
  }
}
