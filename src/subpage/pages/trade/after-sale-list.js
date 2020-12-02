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
      list: []
    }
  }

  componentDidMount () {
    this.fetch()
  }

  async fetch (params) {
    const { id } = this.$router.params

    params = _mapKeys({
      ...params,
      id
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
      pay_type: 'orderInfo.pay_type',
      point: 'orderInfo.point',
      order: ({ orderInfo }) => pickBy(orderInfo.items, {
        order_id: 'order_id',
        item_id: 'item_id',
        pic_path: 'pic',
        title: 'item_name',
        price: ({ item_fee }) => (+item_fee / 100).toFixed(2),
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
      url: `/subpage/pages/trade/refund-detail?aftersales_bn=${id}`
    })
  }

  render () {
    const {list, page } = this.state

    return (
      <View className='page-after-sale trade-list'>
        <NavBar
          title='售后列表'
          leftIconType='chevron-left'
          fixed='true'
        />
        <ScrollView
          scrollY
          className='trade-list__scroll'
          onScrollToLower={this.nextPage}
        >
          {
            list.map((item, idx) => {
              return (
                <TradeItem
                  key={`${idx}1`}
                  payType={item.pay_type}
                  customHeader
                  renderHeader={
                    <View className='trade-item__hd-cont'>
                      <Text className='trade-item__shop'>退货/退货退款</Text>
                    </View>
                  }
                  customFooter
                  renderFooter={
                    <View>审核中</View>
                  }
                  info={item}
                  onClick={this.handleClickItem.bind(this, item)}
                />
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
