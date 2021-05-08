import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { Loading, SpNote, NavBar, CouponItem } from '@/components'
import api from '@/api'
import { connect } from '@tarojs/redux'
import { withPager } from '@/hocs'
import { pickBy } from '@/utils'

import './coupon.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))
@withPager
export default class Coupon extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      curTabIdx: 0,
      tabList: [
        {title: '未使用', status: '1'},
        {title: '已使用', status: '2'},
        {title: '已过期', status: '3'}
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
    const { curTabIdx, tabList } = this.state
    // let vaildStatus
    // if(curTabIdx === 0) {
    //   vaildStatus = true
    // }else {
    //   vaildStatus = false
    // }
    const status = tabList[curTabIdx].status
    params = {
      ...params,
      status,
      page,
      pageSize
    }
    const { list, total_count: total } = await api.member.getUserCardList(params)
    const nList = pickBy(list, {
      id: 'id',
      status: 'status',
      reduce_cost: 'reduce_cost',
      least_cost: 'least_cost',
      begin_date: 'begin_date',
      end_date: 'end_date',
      card_type: 'card_type',
      card_id: 'card_id',
      code: 'code',
      tagClass: 'tagClass',
      title: 'title',
      discount: 'discount',
      use_condition:'use_condition',
      description:'description',
      use_bound:'use_bound'
    })

    this.setState({
      list: [...this.state.list, ...nList],
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

  handleClick = (item) => {
    const { card_id, code, card_type, status, tagClass } = item
    if (status === '2' || tagClass === 'overdue') {
      return false
    }
    let url = `/pages/item/list?cardId=${card_id}`
    if (card_type === 'gift') {
      url = `/marketing/pages/member/coupon-detail?card_id=${card_id}&code=${code}`
    }
    Taro.navigateTo({
      url
    })
  }

  /*handleClickChecked = (id) => {
    this.setState({
      curId: id
    })
  }*/


  render () {
    const { curTabIdx, tabList, list, page } = this.state
    const { colors }=this.props

    return (
      <View className='coupon-list'>
        <NavBar
          title='优惠券列表'
          leftIconType='chevron-left'
          fixed='true'
        />
        <AtTabs
          className={`coupon-list__tabs ${colors.data[0].primary?'customTabsStyle':''}`}
          current={curTabIdx}
          tabList={tabList}
          onClick={this.handleClickTab}
          customStyle={{color:colors.data[0].primary,backgroundColor:colors.data[0].primary}}
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
                    onClick={this.handleClick.bind(this, item)}
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
