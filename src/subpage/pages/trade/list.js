import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { connect } from "@tarojs/redux";
import { AtTabs, AtTabsPane } from 'taro-ui'
import _mapKeys from 'lodash/mapKeys'
import { Loading, SpNote, NavBar } from '@/components'
import api from '@/api'
import { withPager, withLogin } from '@/hocs'
import { log, pickBy, resolveOrderStatus, getCurrentRoute } from '@/utils'
import TradeItem from './comps/item'
import { Tracker } from "@/service";

import './list.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))

@withPager
@withLogin()
export default class TradeList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ...this.state,
      curTabIdx: 0,
      tabList: [
        { title: '全部订单', status: '0' },
        { title: '待付款', status: '5' },
        { title: '待收货', status: '1' },
        { title: '已完成', status: '3' }
      ],
      list: [],
      rate_status: false,
      curItemActionsId: null
    }
  }

  componentDidShow() {
    const { status } = this.$router.params
    const tabIdx = this.state.tabList.findIndex(tab => tab.status === status)

    if (tabIdx >= 0) {
      this.setState({
        curTabIdx: tabIdx,
        list: []
      }, () => {
        this.resetPage()
        setTimeout(() => {
          this.nextPage()
        }, 500)
      })
    } else {
      this.resetPage()
      this.setState({
        list: []
      })
      setTimeout(() => {
        this.nextPage()
      }, 500)
    }

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
    const { tabList, curTabIdx } = this.state

    params = _mapKeys({
      ...params,
      order_type: 'normal',
      status: tabList[curTabIdx].status
    }, function (val, key) {
      if (key === 'page_no') return 'page'
      if (key === 'page_size') return 'pageSize'

      return key
    })

    const { list, pager: { count: total }, rate_status } = await api.trade.list(params)
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
      type: 'type',
      is_rate: 'is_rate',
      create_date: 'create_date',
      order: ({ items }) => pickBy(items, {
        order_id: 'order_id',
        item_id: 'item_id',
        pic_path: 'pic',
        title: 'item_name',
        origincountry_name: 'origincountry_name',
        origincountry_img_url: 'origincountry_img_url',
        type: 'type',
        item_spec_desc: 'item_spec_desc',
        price: ({ item_fee }) => (+item_fee / 100).toFixed(2),
        item_fee: 'item_fee',
        point: 'item_point',
        num: 'num'
      })
    })

    log.debug('[trade list] list fetched and processed: ', nList)

    this.setState({
      list: [...this.state.list, ...nList],
      rateStatus: rate_status
    })

    Taro.stopPullDownRefresh()

    return { total }
  }

  handleClickTab = (idx) => {
    this.hideLayer()
    if (this.state.page.isLoading) return

    if (idx !== this.state.curTabIdx) {
      this.resetPage()
      this.setState({
        list: []
      })
    }

    this.setState({
      curTabIdx: idx
    }, () => {
      this.nextPage()
    })
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
      case 'rate':
        Taro.navigateTo({
          url: `/marketing/pages/item/rate?id=${tid}`
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
    const { colors } = this.props
    const { curTabIdx, curItemActionsId, tabList, list, page, rateStatus } = this.state

    return (
      <View className='page-trade-list'>
        <NavBar
          title='订单列表'
          leftIconType='chevron-left'
          fixed='true'
        />
        <AtTabs
          className='trade-list__tabs'
          current={curTabIdx}
          tabList={tabList}
          onClick={this.handleClickTab}
        >
          {
            tabList.map((panes, pIdx) =>
              (<AtTabsPane
                current={curTabIdx}
                key={panes.status}
                index={pIdx}
              >
              </AtTabsPane>)
            )
          }
        </AtTabs>

        <ScrollView
          scrollY
          className='trade-list__scroll with-tabs'
          onScrollToUpper={this.onPullDownRefresh.bind(this)}
          onScrollToLower={this.nextPage}
        >
          {
            list.map((item) => {
              return (
                <TradeItem
                  payType={item.pay_type}
                  key={item.tid}
                  rateStatus={rateStatus}
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
