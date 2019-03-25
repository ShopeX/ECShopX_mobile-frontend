import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { Loading, SpNote, NavBar } from '@/components'
import api from '@/api'
import { withPager } from '@/hocs'
import { pickBy, formatDataTime } from '@/utils'


import './recommend-order.scss'

@withPager
export default class RecommendOrder extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      list: []
    }
  }

  componentDidMount () {
    this.nextPage()
  }

  async fetch (params) {
    // const { tabList, curTabIdx } = this.state
    const { brokerage_source } = this.$router.params
    params = {
      ...params,
      close_type: 'close',
      brokerage_source: brokerage_source
    }
    const { list, total_count: total} = await api.member.recommendOrder(params)
    const nList = pickBy(list, {
      username: 'username',
      created: ({ created }) => (formatDataTime(created * 1000)),
      order_id: 'order_id',
      rebate: ({ rebate }) => (rebate/100).toFixed(2),
      source: 'source'
    })
    this.setState({
      list: [...this.state.list, ...nList],
    })
    return {
      total
    }
  }

  render () {
    const { list, page } = this.state

    return (
      <View className='trade-list'>
        <NavBar
          title='我的推广订单'
          leftIconType='chevron-left'
          fixed='true'
        />

        <ScrollView
          scrollY
          className='trade-list__scroll order-recom'
          onScrollToLower={this.nextPage}
        >
          {
            list.map((item, idx) => {
              return (
                <View key={idx}>
                  <View className='order-item'>
                    <View className='order-item__title'>
                      <View className='order-item__title-name'>
                        <Text className='small-text'>订单号：</Text>{item.order_id}
                      </View>
                      <Text className='order-item__title__data'>{item.username}</Text>
                    </View>
                    <View className='order-item__title-name'>
                      <Text className='small-text'>{item.source === 'order' ? '佣金' : '津贴' }：</Text>
                      <Text className='order-item__title-name rebate-color'>￥{item.rebate}</Text>
                    </View>
                    <View className='small-text'>{item.created}</View>
                  </View>
                </View>
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
