import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { Loading, SpNote, NavBar } from '@/components'
import api from '@/api'
import { withPager, withLogin } from '@/hocs'
import { log, pickBy, resolveOrderStatus, getCurrentRoute } from '@/utils'
import TradeItem from './comps/item'
import { Tracker } from "@/service";

import './list.scss'

@withPager
@withLogin()
export default class TradePickList extends Component {
  static config = {
    navigationBarTitleText: '自提订单'
  }

  constructor(props) {
    super(props)

    this.state = {
      ...this.state,
      query: null,
      list: [],
      curItemActionsId: null
    }
  }

  componentDidMount() {
    this.setState({
      query: {
        order_type: 'normal',
        status: 4
      }
    }, () => {
      this.nextPage()
    })
  }

  onPullDownRefresh = () => {
    Tracker.dispatch("PAGE_PULL_DOWN_REFRESH");
    // debugger
    Taro.showLoading({
      title: '加载中',
      icon: 'none',
    })
    this.resetPage(() => {
      this.nextPage()
      this.setState({
        list: []
      })
      Taro.hideLoading()
    })
  }


  componentWillUnmount() {
    this.hideLayer()
  }

  async fetch(params) {
    const { page_no: page, page_size: pageSize } = params
    const query = {
      ...this.state.query,
      page,
      pageSize
    }
    const { list, pager: { count: total } } = await api.trade.list(query)
    let nList = pickBy(list, {
      tid: 'order_id',
      status_desc: 'order_status_msg',
      order_status_des: 'order_status_des',
      status: ({ order_status }) => resolveOrderStatus(order_status),
      totalItems: ({ items }) => items.reduce((acc, item) => (+item.num) + acc, 0),
      payment: ({ total_fee }) => (total_fee / 100).toFixed(2),
      total_fee: 'total_fee',
      pay_type: 'pay_type',
      point: 'point',
      create_date: 'create_date',
      order: ({ items }) => pickBy(items, {
        order_id: 'order_id',
        item_id: 'item_id',
        pic_path: 'pic',
        title: 'item_name',
        price: ({ item_fee }) => (+item_fee / 100).toFixed(2),
        item_fee: 'item_fee',
        point: 'item_point',
        num: 'num'
      })
    })

    log.debug('[trade list] list fetched and processed: ', nList)

    this.setState({
      list: [...this.state.list, ...nList]
    })

    return { total }
  }

  handleClickItem = (trade) => {
    const { tid } = trade

    Taro.navigateTo({
      url: `/subpage/pages/trade/detail?id=${tid}`
    })
  }

  handleClickItemBtn = async (trade, type) => {
    const { tid } = trade
    if (type === 'confirm') {
      await api.trade.confirm(tid)
      const { fullPath } = getCurrentRoute(this.$router)
      Taro.redirectTo({
        url: fullPath
      })
      return
    }

    switch (type) {
      case 'cancel':
        Taro.navigateTo({
          url: `/subpage/pages/trade/cancel?order_id=${tid}`
        })
        break
      default:
        Taro.navigateTo({
          url: `/subpage/pages/trade/detail?id=${tid}`
        })
    }
  }

  handleActionClick = (type, item) => {
    console.log(type, item)
    this.hideLayer()
  }

  handleActionBtnClick = (item) => {
    console.log(item)
    this.setState({
      curItemActionsId: item.tid
    })
  }

  hideLayer = () => {
    this.setState({
      curItemActionsId: null
    })
  }

  render() {
    const { curItemActionsId, tabList, list, page } = this.state

    return (
      <View className='page-trade-list'>
        <NavBar
          title='自提订单'
          leftIconType='chevron-left'
          fixed='true'
        />

        <ScrollView
          scrollY
          className='trade-list__scroll'
          onScrollToUpper={this.onPullDownRefresh.bind(this)}
          onScrollToLower={this.nextPage}
        >
          {
            list.map((item) => {
              return (
                <TradeItem
                  payType={item.pay_type}
                  key={item.tid}
                  info={item}
                  showActions={curItemActionsId === item.tid}
                  onClick={this.handleClickItem.bind(this, item)}
                  onClickBtn={this.handleClickItemBtn.bind(this, item)}
                  onActionBtnClick={this.handleActionBtnClick.bind(this, item)}
                  onActionClick={this.handleActionClick.bind(this, item)}
                />
              )
            })
          }
          {
            page.isLoading && <Loading>正在加载...</Loading>
          }
          {
            !page.isLoading && !page.hasNext && !list.length
            && (<SpNote img='trades_empty.png'>赶快去添加吧~</SpNote>)
          }
          {!!curItemActionsId && <View
            className='layer'
            onClick={this.hideLayer}
          />}
        </ScrollView>
      </View>
    )
  }
}
