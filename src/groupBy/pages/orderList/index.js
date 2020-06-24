/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description:  订单列表
 * @FilePath: /unite-vshop/src/groupBy/pages/orderList/index.js
 * @Date: 2020-05-09 10:17:35
 * @LastEditors: Arvin
 * @LastEditTime: 2020-06-24 15:50:29
 */
import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { NavBar } from '@/components'
import api from '@/api'
import { formatOrder } from '../../utils'
import OrderItem from '../../component/orderItem'
import LoadingMore from '../../component/loadingMore'

import './index.scss'

export default class OrderList extends Component {

  constructor (props) {
    super(props)
    this.state = {
      list: [],
      isRefresh: false,
      isLoading: false,
      isEnd: false,
      isEmpty: false,
      param: {
        status: 0,
        page: 1,
        pageSize: 10,
        order_type: 'normal_community',
        order_class: 'community'
      }
    }
  }

  componentDidMount() {
    this.getOrderList(true)
  }

  config = {
    navigationBarTitleText: '我的订单'
  }

  // 获取订单列表
  getOrderList = (isRefresh = false) => {
    let { param, list: oldList } = this.state
    if (isRefresh) {
      oldList = []
    }
    api.groupBy.getOrderList(param).then(res => {
      const { list, pager } = res
      const count = pager.count
      const isEnd = param.page >= (count / param.pageSize)
      this.setState({
        list: [...oldList, ...formatOrder(list)],
        isEnd,
        isRefresh: false,
        isLoading: false,
        isEmpty: count === 0
      })
    })
  }
  // 切换tabs
  handleTabs = (status) => {
    const { param } = this.state

    if (param.status === status) return
    param.status = status
    this.setState({
      param
    }, () => {
      this.handleRefresh()
    })
  }

  // 下拉刷新
  handleRefresh = () => {
    const { param } = this.state
    param.page = 1
    this.setState({
      isRefresh: true,
      param
    }, () => {
      this.getOrderList(true)
    })
  }

  // 上拉加载
  handleLoadMore = () => {
    const { isLoading, isEnd, isEmpty, param } = this.state
    if (isEnd || isLoading || isEmpty) return
    param.page += 1
    this.setState({
      isLoading: true,
      param
    }, () => {
      this.getOrderList()
    })
  }

  render () {
    const tabs = [{
      title: '全部',
      status: 0
    }, {
      title: '待支付',
      status: 5
    }, {
      title: '待取货',
      status: 4
    }, {
      title: '已完成',
      status: 3
    }]
    const { list, param, isRefresh, isLoading, isEnd, isEmpty } = this.state
    return (
      <View className='orderList'>
        <NavBar
          title={this.config.navigationBarTitleText}
          leftIconType='chevron-left'
          fixed='true'
        />
        <View className='orderListTabs'>
          {
            tabs.map(item => (
              <View 
                className={`tabsItem ${item.status === param.status && 'active'}`}
                key={item.status}
                onClick={this.handleTabs.bind(this, item.status)}
              >
                { item.title }
              </View>
            ))
          }
        </View>
        <ScrollView
          className='order-list'
          scrollY
          scroll-anchoring
          refresherEnabled
          scrollWithAnimation
          refresherTriggered={isRefresh}
          onRefresherRefresh={this.handleRefresh}
          onScrollToLower={this.handleLoadMore}
        >
          { list.map(item => <OrderItem key={item} info={item} onRefresh={this.handleRefresh} />) }
          {/* 加载更多 */}
          <LoadingMore isLoading={isLoading} isEnd={isEnd} isEmpty={isEmpty} />
          {/* 防止子内容无法支撑scroll-view下拉刷新 */}
          <View style='width:2rpx;height:2rpx;bottom:-2rpx;position:absolute;' />
        </ScrollView>
      </View>
    )
  }
}