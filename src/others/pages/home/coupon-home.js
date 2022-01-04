import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, ScrollView, Image } from '@tarojs/components'
import { Loading, SpNote, SpNavBar, SpToast, CouponItem, SpPage } from '@/components'
import { connect } from 'react-redux'
import api from '@/api'
import S from '@/spx'
import { withPager } from '@/hocs'
import { pickBy, formatTime, buriedPoint, normalizeQuerys, getBrowserEnv } from '@/utils'
// import { Tracker } from '@/service'

import '../home/coupon-home.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))
@withPager
export default class CouponHome extends Component {
  $instance = getCurrentInstance()
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      list: [],
      shareInfo: {}
    }
    this.routerParams = {}
  }

  // config = {
  //   navigationBarBackgroundColor: "#F8DAA2"
  // };

  async componentDidMount () {
    api.wx.shareSetting({ shareindex: 'coupon' }).then((res) => {
      this.setState({
        shareInfo: res
      })
    })
    this.routerParams = await normalizeQuerys(this.$instance.router.params)
    this.nextPage()
    const { distributor_id = '', dtid = '' } = this.routerParams
    buriedPoint.call(this, {
      distributor_id: distributor_id || dtid,
      event_type: 'activeDiscountCoupon'
    })
  }

  onShareAppMessage () {
    const res = this.state.shareInfo
    const { userId } = Taro.getStorageSync('userinfo')
    const query = userId ? `?uid=${userId}` : ''
    return {
      title: res.title,
      imageUrl: res.imageUrl,
      path: `/others/pages/home/coupon-home${query}`
    }
  }

  onShareTimeline () {
    const res = this.state.shareInfo
    const { userId } = Taro.getStorageSync('userinfo')
    const query = userId ? `uid=${userId}` : ''
    return {
      title: res.title,
      imageUrl: res.imageUrl,
      query: query
    }
  }

  async fetch (params) {
    let { distributor_id, dtid, item_id = '', itemid = '', card_id } = this.routerParams
    params = {
      ...params,
      end_date: 1,
      card_id,
      distributor_id: distributor_id || dtid,
      item_id: item_id || itemid
    }
    const {
      list,
      pagers: { total: total }
    } = await api.member.homeCouponList(params)
    const nList = pickBy(list, {
      status: 'status',
      reduce_cost: 'reduce_cost',
      least_cost: 'least_cost',
      begin_date: ({ begin_date }) => formatTime(begin_date * 1000),
      end_date: ({ end_date }) => formatTime(end_date * 1000),
      fixed_term: 'fixed_term',
      card_type: 'card_type',
      tagClass: 'tagClass',
      title: 'title',
      discount: 'discount',
      get_limit: 'get_limit',
      user_get_num: 'user_get_num',
      quantity: 'quantity',
      get_num: 'get_num',
      card_id: 'card_id',
      description: 'description',
      use_bound: 'use_bound',
      send_begin_time: 'send_begin_time',
      send_end_time: 'send_end_time',
      distributor_list: 'distributor_list'
    })
    nList.map((item) => {
      if (item.get_limit - item.user_get_num <= 0) {
        item.getted = 1
      } else if (item.quantity - item.get_num <= 0) {
        item.getted = 2
      } else {
        item.getted = 0
      }
    })

    this.setState({
      list: [...this.state.list, ...nList]
    })

    return { total }
  }

  handleClickNews = (card_item, idx) => {
    console.log('===handleClickNews===>', card_item)
    if (card_item.getted === 1) {
      //已领取
      Taro.showToast({
        title: '优惠券领取机会已用完',
        icon: 'none'
      })
      return
    }
    if (card_item.getted === 2) {
      //已领完
      Taro.showToast({
        title: '领取失败，优惠券已领完',
        icon: 'none'
      })
      return
    }

    let time = parseInt(new Date().getTime() / 1000)
    if (time < card_item.send_begin_time) return

    if (process.env.TARO_ENV == 'h5') {
      this.handleGetCard(card_item, idx)
    }
    if (process.env.TARO_ENV == 'weapp') {
      let templeparams = {
        'temp_name': 'yykweishop',
        'source_type': 'coupon'
      }
      let _this = this
      api.user.newWxaMsgTmpl(templeparams).then(
        (tmlres) => {
          console.log('templeparams---1', tmlres)
          if (tmlres.template_id && tmlres.template_id.length > 0) {
            wx.requestSubscribeMessage({
              tmplIds: tmlres.template_id,
              success () {
                _this.handleGetCard(card_item, idx)
              },
              fail () {
                _this.handleGetCard(card_item, idx)
              }
            })
          } else {
            _this.handleGetCard(card_item, idx)
          }
        },
        () => {
          _this.handleGetCard(card_item, idx)
        }
      )
    }
  }

  handleGetCard = async (card_item, idx) => {
    const { list } = this.state

    if (list[idx].getted === 2 || list[idx].getted === 1) {
      return
    }
    console.log(card_item, 75)
    const query = {
      card_id: card_item.card_id ? card_item.card_id : card_item.$original.card_id
    }
    try {
      const data = await api.member.homeCouponGet(query)

      Tracker.dispatch('GET_COUPON', card_item)

      S.toast('优惠券领取成功')
      if (data.status) {
        if (data.status.total_lastget_num <= 0) {
          list[idx].getted = 2
        } else if (data.status.lastget_num <= 0) {
          list[idx].getted = 1
        }
        this.setState({
          list: list
        })
      }
    } catch (e) {}
  }

  render () {
    const { colors } = this.props
    const { list, page } = this.state
    return (
      <SpPage className='coupon-home'>
        <SpNavBar title='优惠券列表' leftIconType='chevron-left' fixed='true' />
        <ScrollView scrollY className='home_coupon-home__scroll' onScrollToLower={this.nextPage}>
          <View className='coupon-home-ticket'>
            {list.map((item, idx) => {
              let time = parseInt(new Date().getTime() / 1000)
              return (
                <CouponItem info={item} key={item.card_id}>
                  <View
                    style={{ fontSize: '22rpx' }}
                    onClick={this.handleClickNews.bind(this, item, idx)}
                  >
                    {item.getted === 1 ? '已领取' : ''}
                    {item.getted === 2 ? '已领完' : ''}
                    {time > item.send_begin_time && item.getted !== 2 && item.getted !== 1
                      ? '立即领取'
                      : ''}
                    {item.card_type === 'new_gift' && time < item.send_begin_time ? '未开始' : ''}
                  </View>
                </CouponItem>
              )
            })}
            {page.isLoading && <Loading>正在加载...</Loading>}
            {!page.isLoading && !page.hasNext && !list.length && (
              <SpNote img='trades_empty.png'>赶快去添加吧~</SpNote>
            )}
          </View>
        </ScrollView>
        <SpToast />
      </SpPage>
    )
  }
}
