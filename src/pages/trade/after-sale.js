import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { Loading, SpNote, NavBar } from '@/components'
import { pickBy, log } from '@/utils'
import api from '@/api'
import { withLogin, withPager } from '@/hocs'
import { AFTER_SALE_STATUS } from '@/consts'
import _mapKeys from 'lodash/mapKeys'
import TradeItem from './comps/item'

import './list.scss'

@withPager
@withLogin()
export default class AfterSale extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      curTabIdx: 0,
      tabList: [
        { title: '全部', status: '0' },
        { title: '处理中', status: '1' },
        { title: '已处理', status: '2' },
        { title: '已驳回', status: '3' },
        { title: '已关闭', status: '4' }
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
      aftersales_status: tabList[curTabIdx].status
    }, function (val, key) {
      if (key === 'page_no') return 'page'
      if (key === 'page_size') return 'pageSize'

      return key
    })

    const { list, total_count: total } = await api.aftersales.list(params)

    let nList = pickBy(list, {
      id: 'aftersales_bn',
      status_desc: ({ aftersales_status }) => AFTER_SALE_STATUS[aftersales_status],
      totalItems: 'num',
      payment: ({ item }) => (item.refunded_fee / 100).toFixed(2),
      pay_type: 'item.pay_type',
      point: 'item.point',
      order: ({ item }) => [pickBy(item, {
        order_id: 'order_id',
        item_id: 'item_id',
        pic_path: 'pic',
        title: 'item_name',
        price: ({ item_fee }) => (+item_fee / 100).toFixed(2),
        point: 'item_point',
        num: 'num'
      })]
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
    const { id } = trade

    Taro.navigateTo({
      url: `/pages/trade/refund-detail?aftersales_bn=${id}`
    })
  }

  render () {
    const { curTabIdx, tabList, list, page } = this.state

    return (
      <View className='page-after-sale trade-list'>
        <NavBar
          title='售后订单列表'
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
                  key={idx}
                  payType={item.pay_type}
                  customHeader
                  renderHeader={
                    <View className='trade-item__hd-cont'>
                      <Text className='trade-item__shop'>订单号：{item.id}</Text>
                      <Text className='more'>{item.status_desc}</Text>
                    </View>
                  }
                  customFooter
                  renderFooter={
                    <View></View>
                  }
                  info={item}
                  onClick={this.handleClickItem.bind(this, item)}
                ></TradeItem>
              )
            })
          }
          {page.isLoading && (<Loading>正在加载...</Loading>)}
          {!page.isLoading && !page.hasNext && !list.length && (<SpNote img='trades_empty.png'>暂无数据</SpNote>)}
        </ScrollView>
      </View>
    )
  }
}
