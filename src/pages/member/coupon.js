import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { Loading, SpNote } from '@/components'
import api from '@/api'
import { withPager } from '@/hocs'
import { classNames, pickBy } from '@/utils'

import './coupon.scss'

@withPager
export default class Coupon extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      curTabIdx: 0,
      tabList: [
        {title: '可用', status: '1'},
        {title: '不可用', status: '2'}
      ],
      list: []
    }
  }

  componentDidMount () {
    const tabIdx = this.state.tabList.findIndex(tab => tab.status === '1')

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
    const { page_no: page, page_size: pageSize } = params
    const { curTabIdx } = this.state
    console.log(curTabIdx, 43)
    let vaildStatus
    if(curTabIdx === 0) {
      vaildStatus = true
    }else {
      vaildStatus = false
    }
    params = {
      ...params,
      valid: vaildStatus,
      page,
      pageSize
    }
    const { list, count: total } = await api.member.couponList(params)
    const nList = pickBy(list, {
      status: 'status',
      reduce_cost: 'reduce_cost',
      least_cost: 'least_cost',
      begin_date: 'begin_date',
      end_date: 'end_date',
      card_type: 'card_type',
      tagClass: 'tagClass',
      title: 'title',
      discount: 'discount'
    })

    this.setState({
      list: [...this.state.list, ...nList],
    })
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


  render () {
    const { curTabIdx, tabList, list, page } = this.state

    return (
      <View className='coupon-list'>
        <AtTabs
          className='coupon-list__tabs'
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
          className='coupon-list__scroll'
          onScrollToLower={this.nextPage}
        >
          <View className='coupon-list-ticket'>
            {
              list.map((item, idx) => {
                return (
                  <View className='coupon-item' key={idx}>
                    {
                      item.card_type === 'cash'
                        ? <View className={classNames('coupon-item__name', item.status === '2' ? 'coupon-item__name-not' : null)}>
                            <View className='coupon-item___number'>￥<Text className='coupon-item___number_text'>{item.reduce_cost/100}</Text></View>
                            <View className='coupon-item___info'>满{item.least_cost > 0 ? item.least_cost/100 : 0.01}可用</View>
                          </View>
                        : null
                    }
                    {
                      item.card_type === 'gift'
                        ? <View className={classNames('coupon-item__name', item.status === '2' ? 'coupon-item__name-not' : null)}>
                            <View className='coupon-item___number'>兑换券</View>
                          </View>
                        : null
                    }
                    {
                      item.card_type === 'discount'
                        ? <View className={classNames('coupon-item__name', item.status === '2' ? 'coupon-item__name-not' : null)}>
                            <View className='coupon-item___number'><Text className='coupon-item___number_text'>{(100-item.discount)/10}</Text>折</View>
                            <View className='coupon-item___info'>满{item.least_cost > 0 ? item.least_cost/100 : 0.01}可用</View>
                          </View>
                        : null
                    }
                    <View className='coupon-item__content'>
                      <View className='coupon-item___description'>
                        <Text>{item.title}</Text>
                        {
                          item.tagClass === 'used' ? <View className='coupon-item___used'>已使用</View> : null
                        }
                      </View>
                      <View className='coupon-item___time'>使用期限 <Text>{item.begin_date} ~ {item.end_date}</Text></View>
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
          </View>
        </ScrollView>
      </View>
    )
  }
}
