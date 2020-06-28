/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 下期预告
 * @FilePath: /unite-vshop/src/groupBy/pages/nextNotice/index.js
 * @Date: 2020-06-22 15:22:59
 * @LastEditors: Arvin
 * @LastEditTime: 2020-06-28 18:18:38
 */ 
import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { NavBar } from '@/components'
import api from '@/api'
import { debounce } from '@/utils'
import { formatGood, formatCountTime } from '../../utils'
import GoodItem from '../../component/goodItem'
import LoadingMore from '../../component/loadingMore'

import './index.scss'

export default class nextNotice extends Component {

  constructor(props) {
    super(props)
    this.state = {
      // 活动列表
      list: [],
      isRefresh: false,
      isLoading: false,
      isEnd: false,
      isEmpty: false,
      countTime: 0,
      isNotData: true,
      param: {
        page: 1,
        pageSize: 10,
        status: 'waiting'
      }
    }
  }

  componentDidMount () {
    this.getActiveData(true)
  }

  componentWillUnmount () {
    let { timeId } = this.state
    if (timeId) {
      clearTimeout(timeId)
    }
  }

  config = {
    navigationBarTitleText: '下期预告'
  }

  // 获取活动数据
  getActiveData = async (isRefrsh = false) => {
    Taro.showLoading({title: '正在加载中', mask: true})
    const currentCommunity = Taro.getStorageSync('community')
    const { param, list, timeId } = this.state
    // 刷新清除原倒计时
    if (timeId) clearTimeout(timeId)
    // 原列表数据
    const oldList = isRefrsh ? [] : list

    api.groupBy.activityDetail({
      ...param,
      community_id: currentCommunity.community_id
    }).then(res => {
      if (!res.status) {
        this.setState({
          isNotData: false
        })
        return
      }
      const total_count = res.items.total_count
      const isEnd = param.page >= (total_count / param.pageSize)
      const newlist =  [...oldList, ...formatGood(res.items.list)]
      this.setState({
        list: newlist,
        deliveryDate: res.delivery_date,
        countTime: res.last_second,
        isRefresh: false,
        isLoading: false,
        isEnd,
        isEmpty: newlist.length <= 0,
      }, () => {
        this.countdown()
      })
      Taro.hideLoading()
    })
  }
  
  // 倒计时
  countdown = () => {
    let { countTime, timeId } = this.state
    if (countTime > 0) {
      timeId = setTimeout(() => {
        this.setState({
          countTime: countTime - 1
        }, () => {
          this.countdown()
        })
      }, 1000)
    } else {
      // 清除倒计时
      timeId = ''
      clearTimeout(timeId)
      Taro.reLaunch({
        url: '/groupBy/pages/home/index'
      })
    }
    this.setState({
      timeId
    })
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
    this.getActiveData(true)
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
    this.getActiveData()
  }

  render () {
    const {
      list,
      countTime,
      scrollTop,
      isRefresh, 
      isLoading,
      isEnd,
      isEmpty,
      deliveryDate,
      isNotData
    } = this.state
    return (
      <View className='nextNotice'>
        <NavBar
          title={this.config.navigationBarTitleText}
          leftIconType='chevron-left'
          fixed='true'
        />
        {
          isNotData ? <View className='haveData'>
            <View className='info'>
              <View className='time'>
                <View className='left'>
                  距离开始时间{ formatCountTime(countTime) }
                </View>
              </View>
              <View>
                预计送达：{ deliveryDate }
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
              {
                list && list.map(item => <GoodItem key={item.itemId} isNext isEnd={isEnd} goodInfo={item} />)
              }
              {/* 加载更多 */}
              <LoadingMore isLoading={isLoading} isEnd={isEnd} isEmpty={isEmpty} />
              {/* 防止子内容无法支撑scroll-view下拉刷新 */}
              <View style='width:2rpx;height:2rpx;bottom:-2rpx;position:absolute;' />
            </ScrollView>          
          </View>
          : <View className='noData'>暂无下期活动</View>          
        }
      </View>
    )
  }
}