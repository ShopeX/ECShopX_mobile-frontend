/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 订单列表
 * @FilePath: /unite-vshop/src/boost/pages/order/index.js
 * @Date: 2020-09-27 14:08:06
 * @LastEditors: Arvin
 * @LastEditTime: 2020-09-29 17:49:04
 */
import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Image } from '@tarojs/components'
import { NavBar } from '@/components'
import api from '@/api'
import { connect } from "@tarojs/redux"
import { debounce, pickBy, formatDataTime } from '@/utils'
import LoadingMore from '../../component/loadingMore'

import './index.scss'


@connect(({ colors }) => ({
  colors: colors.current
}))
export default class Order extends Component {
  constructor (props) {
    super(props)
    this.state = {
      param: {
        page: 1,
        pageSize: 10,
        order_type: 'bargain',
        order_status: 'DONE'
      },
      list: [],
      scrollTop: 0,
      isRefresh: false,
      isLoading: false,
      isEnd: false,
      isEmpty: false,
    }
  }
  componentDidMount () {
    this.getList()
  }

  config = {
    navigationBarTitleText: '我的助力订单'
  }

  getList = async (isRefrsh = false) => {
    Taro.showLoading({title: '正在加载中', mask: true})
    const { param, list } = this.state
    const data = await api.boost.getOrderList(param)
    const total_count = data.total_count
    const isEnd = param.page >= (total_count / param.pageSize)
    const newList = pickBy(data.list, {
      order_id: 'order_id',
      items: 'items',
      order_status: 'order_status',
      create_time: ({create_time}) => formatDataTime(create_time),
      bargain_id: 'bargain_id',
      total_fee: ({ total_fee }) => (total_fee / 100).toFixed(2),
      item_price: ({ item_price }) => (item_price / 100).toFixed(2)
    })
    this.setState({
      list: isRefrsh ? data.list : [...list, ...newList],
      isRefresh: false,
      isLoading: false,
      isEnd,
      isEmpty: data.list.length <= 0
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

  handleItem = (item) => {
    const { order_id, bargain_id } = item
    Taro.navigateTo({
      url: `/subpage/pages/trade/detail?id=${order_id}?bargain_id=${bargain_id}`
    })
  }

  render () {
    const {
      list,
      scrollTop,
      isRefresh,
      isLoading,
      isEnd,
      isEmpty
    } = this.state
    const { colors } = this.props
    return (
      <View className='order'>
        <NavBar
          title={this.config.navigationBarTitleText}
          leftIconType='chevron-left'
          fixed='true'
        />
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
          {
            list.map(item => <View className='item' key={item.bargain_id}>
              <View className='head'>
                <View className='text'>{ item.create_time }</View>
                <View className='text'>订单号：{ item.order_id }</View>
              </View>
              <View className='info'>
                <Image src={item.items[0].pic} mode='aspectFill' className='img' />
                <View className='detail'>
                  <View className='title'>{ item.items[0].item_name }</View>
                  <View className='price'>
                    支付金额: ¥{ item.total_fee }
                  </View>
                </View>
              </View>
              <View className='foot'>
                <View className='check' style={`background: ${colors.data[0].primary}`} onClick={this.handleItem.bind(this, item)}>订单详情</View>
              </View>
            </View>)
          }
          {/* 加载更多 */}
          <LoadingMore isLoading={isLoading} isEnd={isEnd} isEmpty={isEmpty} />
          {/* 防止子内容无法支撑scroll-view下拉刷新 */}
          <View style='width:2rpx;height:2rpx;bottom:-2rpx;position:absolute;' />
        </ScrollView>
      </View>
    )
  }
}
