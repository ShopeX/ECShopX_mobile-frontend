import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { connect } from 'react-redux'
import { AtTabs, AtTabsPane } from 'taro-ui'
import _mapKeys from 'lodash/mapKeys'
import { Loading, SpNote, SpNavBar } from '@/components'
import api from '@/api'
import { withPager } from '@/hocs'
import {
  log,
  pickBy,
  resolveOrderStatus,
  getCurrentRoute,
  classNames,
  isNavbar,
  getBrowserEnv,
  VERSION_PLATFORM
} from '@/utils'
import { Tracker } from '@/service'
import TradeItem from './comps/new-item'

import './list.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))
@withPager
export default class TradeList extends Component {
  $instance = getCurrentInstance()
  constructor(props) {
    super(props)

    this.state = {
      ...this.state,
      curTabIdx: 0,
      tabList: [
        { title: '全部订单', status: '0' },
        { title: '待支付', status: '5' },
        { title: '待收货', status: '1' },
        { title: '待评价', status: '7', is_rate: 0 }
      ],
      list: [],
      rate_status: false,
      curItemActionsId: null
    }
  }

  componentDidShow() {
    const { status } = this.$instance.router.params
    const tabIdx = this.state.tabList.findIndex((tab) => tab.status === status)

    if (tabIdx >= 0) {
      this.setState(
        {
          curTabIdx: tabIdx,
          list: []
        },
        () => {
          this.resetPage()
          setTimeout(() => {
            this.nextPage()
          }, 500)
        }
      )
    } else {
      this.resetPage()
      this.setState({
        list: []
      })
      setTimeout(() => {
        this.nextPage()
      }, 500)
    }
  }

  onPullDownRefresh = () => {
    Tracker.dispatch('PAGE_PULL_DOWN_REFRESH')

    Taro.showLoading({
      title: '加载中',
      icon: 'none'
    })
    this.resetPage(() => {
      this.nextPage()
      this.setState({
        list: []
      })
      Taro.hideLoading()
    })
  }

  componentWillUnmount() {
    this.hideLayer()
  }

  async fetch(params) {
    const { tabList, curTabIdx } = this.state

    params = _mapKeys(
      {
        ...params,
        order_type: 'normal',
        status: tabList[curTabIdx].status,
        is_rate: tabList[curTabIdx].is_rate
      },
      function (val, key) {
        if (key === 'page_no') return 'page'
        if (key === 'page_size') return 'pageSize'

        return key
      }
    )

    const {
      list,
      pager: { count: total },
      rate_status
    } = await api.trade.list(params)
    let nList = pickBy(list, {
      tid: 'order_id',
      status_desc: 'order_status_msg',
      order_status_des: 'order_status_des',
      status: ({ order_status }) => resolveOrderStatus(order_status),
      totalItems: ({ items }) => items.reduce((acc, item) => +item.num + acc, 0),
      payment: ({ total_fee }) => (total_fee / 100).toFixed(2),
      total_fee: 'total_fee',
      pay_type: 'pay_type',
      point: 'point',
      order_class: 'order_class',
      freight_fee: 'freight_fee',
      freight_type: 'freight_type',
      type: 'type',
      is_rate: 'is_rate',
      dada: 'dada',
      create_date: 'create_date',
      is_all_delivery: 'is_all_delivery',
      is_logistics: 'is_split',
      receipt_type: 'receipt_type',
      delivery_type: 'delivery_type',
      pay_status: 'pay_status',
      delivery_status: 'delivery_status',
      delivery_code: 'delivery_code',
      delivery_corp: 'delivery_corp',
      delivery_corp_name: 'delivery_corp_name',
      delivery_id: 'delivery_id',
      distributor_info: 'distributor_info',
      orders_delivery_id: 'orders_delivery_id',
      order_type: 'order_type',
      can_apply_cancel: 'can_apply_cancel',
      order: ({ items }) =>
        pickBy(items, {
          order_id: 'order_id',
          item_id: 'item_id',
          pic_path: 'pic',
          title: 'item_name',
          origincountry_name: 'origincountry_name',
          origincountry_img_url: 'origincountry_img_url',
          type: 'type',
          item_spec_desc: 'item_spec_desc',
          price: 'item_fee',
          item_fee: 'item_fee',
          point: 'item_point',
          num: 'num',
          order_item_type: 'order_item_type'
        })
    })

    log.debug('[trade list] list fetched and processed: ', nList)

    this.setState({
      list: [...this.state.list, ...nList],
      rateStatus: rate_status
    })

    Taro.stopPullDownRefresh()

    return { total }
  }

  handleClickTab = (idx) => {
    this.hideLayer()
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

  handleClickItem = (trade) => {
    const { tid } = trade

    let url = `/subpage/pages/trade/detail?id=${tid}`

    if (trade.order_class === 'pointsmall') {
      url += `&type=pointitem`
    }

    Taro.navigateTo({
      url
    })
  }

  handleClickItemBtn = async (trade, type) => {
    console.log(trade)
    const { tid } = trade

    let detailUrl = `/subpage/pages/trade/detail?id=${tid}`

    if (trade.order_class === 'pointsmall') {
      detailUrl += `&type=pointitem`
    }

    if (type === 'confirm') {
      await api.trade.confirm(tid)
      const { fullPath } = getCurrentRoute(this.$instance.router)
      Taro.redirectTo({
        url: fullPath
      })
      return
    }

    switch (type) {
      case 'cancel':
        Taro.navigateTo({
          url: `/subpage/pages/trade/cancel?order_id=${tid}`
        })
        break
      case 'rate':
        Taro.navigateTo({
          url: `/marketing/pages/item/rate?id=${tid}`
        })
        break
      case 'delivery':
        {
          let {
            delivery_code,
            delivery_corp,
            delivery_corp_name,
            orders_delivery_id,
            delivery_type,
            is_all_delivery,
            tid,
            order_type
          } = trade
          if (is_all_delivery || delivery_type === 'old') {
            Taro.navigateTo({
              url: `/subpage/pages/trade/delivery-info?delivery_id=${orders_delivery_id}&delivery_code=${delivery_code}&delivery_corp=${delivery_corp}&delivery_name=${
                delivery_corp_name || delivery_corp
              }&delivery_type=${delivery_type}&order_type=${order_type}&order_id=${tid}`
            })
          } else {
            Taro.navigateTo({
              url: `/subpage/pages/trade/split-bagpack?order_type=${order_type}&order_id=${tid}`
            })
          }
        }
        break
      default:
        Taro.navigateTo({
          url: detailUrl
        })
    }
  }

  handleActionClick = (type, item) => {
    console.log(type, item)
    this.hideLayer()
  }

  handleActionBtnClick = (item) => {
    console.log(item)
    this.setState({
      curItemActionsId: item.tid
    })
  }

  hideLayer = () => {
    this.setState({
      curItemActionsId: null
    })
  }

  render() {
    const { colors } = this.props
    const { curTabIdx, curItemActionsId, tabList, list = [], page, rateStatus } = this.state

    return (
      <View
        className={classNames('page-trade-list', {
          'has-navbar': isNavbar()
        })}
      >
        <SpNavBar title='订单列表' leftIconType='chevron-left' fixed='true' />
        <AtTabs
          className={`trade-list__tabs ${colors.data[0].primary ? 'customTabsStyle' : ''}`}
          current={curTabIdx}
          tabList={tabList}
          onClick={this.handleClickTab}
          customStyle={{ color: colors.data[0].primary }}
        >
          {tabList.map((panes, pIdx) => (
            <AtTabsPane current={curTabIdx} key={panes.status} index={pIdx}></AtTabsPane>
          ))}
        </AtTabs>
        <ScrollView
          scrollY
          className={`trade-list__scroll ${getBrowserEnv().weixin ? 'with-tabs-wx' : 'with-tabs'}`}
          // onScrollToUpper={this.onPullDownRefresh.bind(this)}
          onScrollToLower={this.nextPage}
        >
          {list.map((item) => {
            return (
              <TradeItem
                payType={item.pay_type}
                key={item.tid}
                rateStatus={rateStatus}
                info={item}
                isShowDistributorInfo={VERSION_PLATFORM}
                showActions={curItemActionsId === item.tid}
                onClick={this.handleClickItem.bind(this, item)}
                onClickBtn={this.handleClickItemBtn.bind(this, item)}
                onActionBtnClick={this.handleActionBtnClick.bind(this, item)}
                onActionClick={this.handleActionClick.bind(this, item)}
              />
            )
          })}
          {page.isLoading && <Loading>正在加载...</Loading>}
          {!page.isLoading && !page.hasNext && !list.length && (
            <SpNote isUrl img={`${process.env.APP_IMAGE_CDN}/empty_order.png`}>
              您还没有商城订单呦~
            </SpNote>
          )}
          {!!curItemActionsId && <View className='layer' onClick={this.hideLayer} />}
        </ScrollView>
      </View>
    )
  }
}
