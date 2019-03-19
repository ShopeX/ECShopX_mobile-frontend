import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import _mapKeys from 'lodash/mapKeys'
import { Loading, SpNote, NavBar } from '@/components'
import api from '@/api'
import { withPager, withLogin } from '@/hocs'
import { log, pickBy, resolveOrderStatus } from '@/utils'
import TradeItem from './comps/item'

import './list.scss'

@withPager
@withLogin()
export default class TradeList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      curTabIdx: 0,
      tabList: [
        {title: '全部', status: '0'},
        {title: '待发货', status: '6'},
        {title: '待收货', status: '2'},
        {title: '已完成', status: '3'}
      ],
      list: []
    }
  }

  componentDidMount () {
    const { status } = this.$router.params
    const tabIdx = this.state.tabList.findIndex(tab => tab.status === status)

    if (tabIdx >= 0) {
      this.setState({
        curTabIdx: tabIdx
      }, () => {
        this.nextPage()
      })
    } else {
      this.nextPage()
    }
  }

  async fetch (params) {
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

    const { list, pager: { count: total } } = await api.trade.list(params)
    let nList = pickBy(list, {
      tid: 'order_id',
      status_desc: 'order_status_msg',
      status: ({ order_status }) => resolveOrderStatus(order_status),
      totalItems: ({ items }) => items.reduce((acc, item) => (+item.num) + acc, 0),
      payment: ({ total_fee }) => (total_fee / 100).toFixed(2),
      order: ({ items }) => pickBy(items, {
        order_id: 'order_id',
        item_id: 'item_id',
        pic_path: 'pic',
        title: 'item_name',
        price: ({ item_fee }) => (+item_fee / 100).toFixed(2),
        num: 'num'
      })
    })

    log.debug('[trade list] list fetched and processed: ', nList)

    this.setState({
      list: [...this.state.list, ...nList]
    })

    return { total }
  }

  handleClickTab = (idx) => {
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
      url: `/pages/trade/detail?id=${tid}`
    })
  }

  handleClickItemBtn = (type, trade) => {
    console.log(type, trade)

    switch(type) {
      case 'pay':
        Taro.navigateTo({
          url: `/pages/cashier/index?order_id=${trade.tid}`
        })
        break
      case 'cancel':
        Taro.navigateTo({
          url: `/pages/trade/cancel?order_id=${trade.tid}`
        })
        break
      default:
    }
  }

  render () {
    const { curTabIdx, tabList, list, page } = this.state

    return (
      <View className='trade-list'>
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
                key={pIdx}
                index={pIdx}
              >
              </AtTabsPane>)
            )
          }
        </AtTabs>

        <ScrollView
          scrollY
          className='trade-list__scroll'
          onScrollToLower={this.nextPage}
        >
          {
            list.map((item, idx) => {
              return (
                <TradeItem
                  customHeader
                  renderHeader={
                    <View className='trade-item__hd-cont'>
                      <Text className='trade-item__shop'>订单号：{item.tid}</Text>
                      <Text className='more'>{item.status_desc}</Text>
                    </View>
                  }
                  key={idx}
                  info={item}
                  onClick={this.handleClickItem.bind(this, item)}
                  onClickBtn={this.handleClickItemBtn}
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
        </ScrollView>
      </View>
    )
  }
}
