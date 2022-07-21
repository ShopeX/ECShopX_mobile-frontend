import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, ScrollView, Text, Image } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { Loading, SpNote, SpNavBar, CouponItem } from '@/components'
import api from '@/api'
import { connect } from 'react-redux'
import { withPager } from '@/hocs'
import { pickBy, classNames, isNavbar } from '@/utils'
import './coupon-nullify.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))
@withPager
export default class CouponNullify extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      curTabIdx: 0,
      tabList: [
        { title: '已使用', status: '2', type: '' },
        { title: '已过期', status: '3', type: '' }
      ],
      couponTab: [
        { id: 1, title: '首页', val: `/pages/index` },
        { id: 2, title: '领券中心', val: `/subpages/marketing/coupon-center` }
      ],
      list: [],
      curId: null
    }
  }

  componentDidMount () {
    const tabIdx = this.state.tabList.findIndex((tab) => tab.status === '2')

    if (tabIdx >= 0) {
      this.setState(
        {
          curTabIdx: tabIdx
        },
        () => {
          this.nextPage()
        }
      )
    } else {
      this.nextPage()
    }
  }

  async fetch (params) {
    const { page_no: page, page_size: pageSize } = params
    const { curTabIdx, tabList } = this.state
    const status = tabList[curTabIdx].status
    const card_type = tabList[curTabIdx].type
    params = {
      ...params,
      status,
      page,
      pageSize,
      card_type
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
      use_condition: 'use_condition',
      description: 'description',
      use_bound: 'use_bound'
    })

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

    this.setState(
      {
        curTabIdx: idx
      },
      () => {
        this.nextPage()
      }
    )
  }

  onHandleClick = (params) => {
    Taro.navigateTo({
      url: params
    })
  }

  render () {
    const { curTabIdx, tabList, list, page, couponTab } = this.state
    const { colors } = this.props
    const status = tabList[curTabIdx].status

    return (
      <View
        className={classNames('page-nulify-couponnullify', {
          'has-navbar': isNavbar()
        })}
      >
        <SpNavBar title='优惠券列表' leftIconType='chevron-left' fixed='true' />
        <AtTabs
          className={`coupon-list__tabs ${colors.data[0].primary ? 'customTabsStyle' : ''}`}
          current={curTabIdx}
          tabList={tabList}
          onClick={this.handleClickTab}
          customStyle={{ color: colors.data[0].primary }}
        >
          {/* {tabList.map((panes, pIdx) => (
            <AtTabsPane current={curTabIdx} key={panes.status} index={pIdx}></AtTabsPane>
          ))} */}
        </AtTabs>

        <ScrollView scrollY className='coupon-list__scroll' onScrollToLower={this.nextPage}>
          <View className='coupon-list-ticket'>
            {list.map((item) => {
              return (
                <CouponItem info={item} key={item.id}>
                  <View style={{ fontSize: '22rpx' }}>
                    {/* {item.status == 2 ? '已使用' : item.status == 3 ? '已过期' : '' } */}
                    {item.status == 2 ? '已使用' : ''}
                    {item.tagClass == 'overdue' ? '已过期' : ''}
                  </View>
                </CouponItem>
              )
            })}
            {page.isLoading && <Loading>正在加载...</Loading>}
            {!page.isLoading && !page.hasNext && !list.length && (
              <SpNote img={`${process.env.APP_IMAGE_CDN}/coupon_exist.png`} isUrl>
                {status == 2 ? '没有已使用优惠券哦，赶紧去使用叭' : ''}
              </SpNote>
            )}
            {!page.isLoading && !page.hasNext && !list.length && (
              <View className='coupon-tab'>
                {couponTab.map((item, idx) => {
                  let { title, val } = item
                  return (
                    <View
                      key={item.id}
                      onClick={this.onHandleClick.bind(this, val)}
                      className={`content ${idx != 0 ? 'yellow' : 'gray'}`}
                    >
                      {title}
                    </View>
                  )
                })}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    )
  }
}
