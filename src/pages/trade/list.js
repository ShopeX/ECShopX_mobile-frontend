import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { Loading, SpNote } from '@/components'
import api from '@/api'
import { withPager } from '@/hocs'
import TradeItem from './comps/item'

import './list.scss'

@withPager
export default class TradeList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      curTabIdx: 0,
      tabList: [
        {title: '全部', status: ''},
        {title: '待付款', status: 'WAIT_BUYER_PAY'},
        {title: '待发货', status: 'WAIT_SELLER_SEND_GOODS'},
        {title: '待收货', status: 'WAIT_BUYER_CONFIRM_GOODS'},
        {title: '待评价', status: 'WAIT_RATE'}
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
    params = {
      ...params,
      status: tabList[curTabIdx].status
    }
    const { list, total_count: total } = await api.trade.list(params)
    const nList = this.state.list.concat(list)

    this.setState({
      list: nList
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

  handleClickItem (trade) {
    const { tid } = trade
    Taro.navigateTo({
      url: `/pages/trade/detail?id=${tid}`
    })
  }

  handleClickItemBtn = (type, trade) => {
    console.log(type, trade)
  }

  render () {
    const { curTabIdx, tabList, list, page } = this.state

    return (
      <View className='trade-list'>
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
                  key={idx}
                  info={item}
                  onClick={this.handleClickItem}
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
