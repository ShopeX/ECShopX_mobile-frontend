/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { Loading, SpNote, SpNavBar } from '@/components'
import { pickBy, log, getBrowserEnv, classNames, isNavbar, VERSION_PLATFORM } from '@/utils'
import api from '@/api'
import { $t, ti } from '@/i18n'
import { connect } from 'react-redux'
import { withLogin, withPager } from '@/hocs'
import { AFTER_SALE_STATUS } from '@/consts'
import _mapKeys from 'lodash/mapKeys'
import TradeItem from './comps/item'
import './list.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))
@withPager
@withLogin()
export default class AfterSale extends Component {
  $instance = getCurrentInstance() || {}
  constructor(props) {
    super(props)

    this.state = {
      ...this.state,
      curTabIdx: 0,
      list: []
    }
  }

  getTabList = () => [
    { title: $t('7c005828.047109'), status: '0' },
    { title: $t('7c005828.5d459d'), status: '1' },
    { title: $t('7c005828.5ad605'), status: '2' },
    { title: $t('7c005828.dbf36d'), status: '3' },
    { title: $t('7c005828.9c5850'), status: '4' }
  ]

  componentDidMount() {
    const { status } = this.$instance?.router?.params
    const tabList = this.getTabList()
    const tabIdx = tabList.findIndex((tab) => tab.status === status)

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

  async fetch(params) {
    const { curTabIdx } = this.state
    const tabList = this.getTabList()

    params = _mapKeys(
      {
        ...params,
        aftersales_status: tabList[curTabIdx].status
      },
      function (val, key) {
        if (key === 'page_no') return 'page'
        if (key === 'page_size') return 'pageSize'

        return key
      }
    )

    const { list, total_count: total } = await api.aftersales.list(params)

    let nList = pickBy(list, {
      id: 'aftersales_bn',
      order_id: 'order_id',
      status_desc: ({ aftersales_status }) => AFTER_SALE_STATUS()[aftersales_status],
      totalItems: 'num',
      payment: ({ refund_fee }) => (refund_fee / 100).toFixed(2),
      pay_type: 'pay_type',
      point: 'point',
      distributor_info: 'distributor_info',
      order: ({ detail }) =>
        pickBy(detail, {
          order_id: 'order_id',
          item_id: 'item_id',
          pic_path: 'item_pic',
          title: 'item_name',
          price: ({ refund_fee }) => (+refund_fee / 100).toFixed(2),
          point: 'item_point',
          num: 'num'
        })
    })

    log.debug('[trade list] list fetched and processed: ', nList)

    //售后详情跳转过滤列表
    const nFList = this.detailFilter(nList)

    this.setState({
      list: [...this.state.list, ...nFList]
    })

    return { total }
  }

  detailFilter(nList) {
    const { order_id } = this.$instance?.router?.params
    let nFList = JSON.parse(JSON.stringify(nList))
    if (order_id) {
      nFList = nList.filter((item) => item.order_id == order_id)
    }
    return nFList
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

  handleClickItem = (trade) => {
    const { id } = trade

    // Taro.navigateTo({
    //   url: `/subpage/pages/trade/refund-detail?aftersales_bn=${id}`
    // })

    Taro.navigateTo({
      url: `/subpages/trade/after-sale-detail?aftersales_bn=${id}`
    })
  }

  render() {
    const { curTabIdx, list, page } = this.state
    const tabList = this.getTabList()

    const { colors } = this.props

    return (
      <View
        className={classNames('page-trade-list', {
          'has-navbar': isNavbar()
        })}
      >
        <SpNavBar title={$t('7540fb22.3c494a')} leftIconType='chevron-left' fixed='true' />
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
          onScrollToLower={this.nextPage}
        >
          {list &&
            list.map((item, idx) => {
              return (
                <TradeItem
                  key={`${idx}1`}
                  payType={item.pay_type}
                  customHeader
                  renderHeader={
                    <View className='trade-item__hd-cont trade-cont'>
                      <Text className='trade-item__shop'>
                        {ti('16726e8e.7024d4', [item.id])}
                        {'\u3000'}
                      </Text>
                      <Text className='more'>{item.status_desc}</Text>
                    </View>
                  }
                  customFooter
                  renderFooter={<View></View>}
                  info={item}
                  onClick={this.handleClickItem.bind(this, item)}
                />
              )
            })}
          {page.isLoading && <Loading>{$t('10293ac1.bd0271')}</Loading>}
          {!page.isLoading && !page.hasNext && !list.length && (
            <SpNote img='trades_empty.png'>{$t('884cd041.21efd8')}</SpNote>
          )}
        </ScrollView>
      </View>
    )
  }
}
