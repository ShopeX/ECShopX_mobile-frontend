import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView, Image, Navigator } from '@tarojs/components'
import { AtDrawer } from 'taro-ui'
import { SpToast, BackToTop, Loading, FilterBar, SpNote, GoodsItem } from '@/components'
import S from '@/spx'
import api from '@/api'
import { withPager, withBackToTop } from '@/hocs'
import { classNames, pickBy, formatDataTime } from '@/utils'
import entry from '@/utils/entry'

import './shop-trade.scss'

@withPager
@withBackToTop
export default class DistributionShopTrade extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      query: null,
      list: []
    }
  }

  componentDidMount () {
    this.nextPage()
  }

  async fetch (params) {
    const { page_no: page, page_size: pageSize } = params
    const query = {
      ...this.state.query,
      page,
      pageSize
    }

    const { list, total_count: total } = await api.distribution.shopTrade(query)
    console.log(list)
    const nList = pickBy(list, {
      order_id: 'order_id',
      created: 'created',
      title: 'item_name',
      num: 'num',
      price: ({ price }) => (price/100).toFixed(2)
    })

    this.setState({
      list: [...this.state.list, ...nList],
      query
    })

    return {
      total
    }
  }

  render () {
    const { list, page, scrollTop } = this.state

    return (
      <View className="page-distribution-shop">
        <ScrollView
          className='trade-list__scroll'
          scrollY
          scrollTop={scrollTop}
          scrollWithAnimation
          onScroll={this.handleScroll}
          onScrollToLower={this.nextPage}
        >
          <View className='trade-list'>
            {
              list.map((item, index) =>
                <View className='section trade-list__item'>
                  <View className='section-title view-flex view-flex-middle with-border'>
                    <View className='view-flex-item trade-list__item-code'>{item.order_id}</View>
                    <View className='trade-list__item-date'><Text className='icon-clock muted'></Text> {formatDataTime(item.created*1000)}</View>
                  </View>
                  <View className='section-body view-flex'>
                    <View className='view-flex-item'>
                      <View className='trade-list__item-title'>{item.title}</View>
                      <View className='trade-list__item-price'><Text className='cur'>¥</Text> {item.price}</View>
                    </View>
                    <View className='trade-list__item-count'>x{item.num}</View>
                  </View>
                </View>
              )
            }
          </View>
          {
            page.isLoading
              ? <Loading>正在加载...</Loading>
              : null
          }
          {
            !page.isLoading && !page.hasNext && !list.length
              && (<SpNote img='trades_empty.png'>暂无数据~</SpNote>)
          }
        </ScrollView>
        <SpToast />
      </View>
    )
  }
}
