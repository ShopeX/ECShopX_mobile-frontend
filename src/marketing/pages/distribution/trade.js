import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { Loading, SpNote, SpNavBar } from '@/components'
import api from '@/api'
import { pickBy } from '@/utils'
import { withPager, withBackToTop } from '@/hocs'

import './trade.scss'

@withPager
@withBackToTop
export default class DistributionTrade extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      curTabIdx: 0,
      tabList: [
        { title: '未确认', num: '0' },
        { title: '已确认', num: '0' }
      ],
      list: []
    }
  }

  componentDidMount () {
    this.nextPage()
  }

  async fetch (params) {
    const { curTabIdx } = this.state
    const { type } = this.$router.params
    const { page_no: page, page_size: pageSize } = params
    const query = {
      brokerage_source: type,
      page,
      pageSize
    }

    const { close, noClose } = await api.distribution.commission(query)
    const total = curTabIdx == 0 ? noClose.total_count : close.total_count

    const nList = pickBy(curTabIdx == 0 ? noClose.list : close.list, {
      order_id: 'order_id',
      rebate: 'rebate',
      created_date: 'created_date',
      headimgurl: 'headimgurl',
      username: 'username',
      mobile: 'mobile',
      commission_type: 'commission_type',
      rebate_point: 'rebate_point'
    })

    this.setState({
      list: [...this.state.list, ...nList]
    })

    return {
      total
    }
  }

  handleClickTab = (idx) => {
    if (this.state.page.isLoading) return

    if (idx !== this.state.curTabIdx) {
      this.resetPage()
      this.setState({
        list: []
      })
    }

    this.setState(
      {
        curTabIdx: idx
      },
      () => {
        this.nextPage()
      }
    )
  }

  render () {
    const { list, page, tabList, curFilterIdx, scrollTop, curTabIdx } = this.state
    console.log(list)

    return (
      <View className='page-distribution-trade'>
        <SpNavBar title='订单' leftIconType='chevron-left' />
        <AtTabs
          className='trade-list__tabs'
          current={curTabIdx}
          tabList={tabList}
          onClick={this.handleClickTab}
        >
          {tabList.map((panes, pIdx) => (
            <AtTabsPane current={curTabIdx} key={pIdx.title} index={pIdx}></AtTabsPane>
          ))}
        </AtTabs>
        <ScrollView
          className='trade-list__scroll'
          scrollY
          scrollTop={scrollTop}
          onScrollToLower={this.nextPage}
        >
          <View className='section list'>
            {list.map((item) => {
              return (
                <View className='list-item'>
                  <View className='list-item-txt'>
                    <View className='order-no'>
                      <Text className='key'>单号：</Text>
                      {item.order_id}
                    </View>
                    <View className='order-no'>
                      <Text className='key'>佣金：</Text>
                      <Text className='mark'>
                        {item.commission_type === 'money' ? (
                          <Text className='cur'>
                            ￥<Text className='commission'>{item.rebate / 100}</Text>
                          </Text>
                        ) : (
                          <Text className='cur'>
                            {' '}
                            <Text className='commission'>{item.rebate_point}积分</Text>
                          </Text>
                        )}
                      </Text>
                    </View>
                    <View className='order-date'>{item.created_date}</View>
                  </View>
                  <View className='content-center'>
                    <Image className='customer-logo' src={item.headimgurl} />
                    <View className='customer-name'>{item.username}</View>
                    <View className='customer-phone'>{item.mobile}</View>
                  </View>
                </View>
              )
            })}
          </View>
          {page.isLoading ? <Loading>正在加载...</Loading> : null}
          {!page.isLoading && !page.hasNext && !list.length && (
            <SpNote img='trades_empty.png'>暂无数据~</SpNote>
          )}
        </ScrollView>
      </View>
    )
  }
}
