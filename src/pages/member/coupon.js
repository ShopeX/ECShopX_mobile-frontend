import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { Loading, SpNote, NavBar, CouponItem } from '@/components'
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
        {title: '可用优惠券', status: '1'},
        {title: '过期和已使用', status: '2'}
      ],
      list: [],
      curId: null
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
      id: 'id',
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

  /*handleClickChecked = (id) => {
    this.setState({
      curId: id
    })
  }*/


  render () {
    const { curTabIdx, tabList, list, page } = this.state

    return (
      <View className='coupon-list'>
        <NavBar
          title='优惠券列表'
          leftIconType='chevron-left'
          fixed='true'
        />
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
              list.map(item => {
                return (
                  <CouponItem
                    info={item}
                    key={item.id}
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
          </View>
        </ScrollView>
      </View>
    )
  }
}
