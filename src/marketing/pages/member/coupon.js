/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import Taro from '@tarojs/taro'
import { View, ScrollView, Image } from '@tarojs/components'
import { AtTabs } from 'taro-ui'
import { Loading, SpNote, SpNavBar, CouponItem } from '@/components'
import { $t } from '@/i18n'
import api from '@/api'
import { connect } from 'react-redux'
import { withPager } from '@/hocs'
import { pickBy, classNames, isNavbar, JumpStoreIndex, hasNavbar } from '@/utils'
import './coupon.scss'

class Coupon extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ...this.state,
      curTabIdx: 0,
      list: [],
      curId: null
    }
  }

  buildTabList = () => [
    { title: $t('f1d3181c.a8b0c2'), status: '1', type: '' },
    { title: $t('97c6bb81.f23195'), status: '1', type: 'cash' },
    { title: $t('97c6bb81.9268f9'), status: '1', type: 'discount' }
  ]

  componentDidShow() {
    this.nextPage()
  }

  async fetch(params) {
    const { page_no: page, page_size: pageSize } = params
    const { curTabIdx } = this.state
    const tabList = this.buildTabList()
    const status = tabList[curTabIdx].status
    const card_type = tabList[curTabIdx].type
    params = {
      ...params,
      status,
      page,
      pageSize,
      card_type,
      scope_type: 'all'
    }

    delete params.page_no
    delete params.page_size

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
      use_bound: 'use_bound',
      source_type: 'source_type',
      source_id: 'source_id',
      distributor_info: 'distributor_info'
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

  handleClick = (item) => {
    let time = parseInt(new Date().getTime() / 1000)
    let begin_date = new Date(item.begin_date) / 1000
    const { card_id, code, card_type, status, tagClass, id, source_type, source_id } = item

    if (status === '2' || tagClass === 'overdue' || tagClass == 'notstarted' || time < begin_date) {
      return false
    }

    let distributor_id = 0

    //如果有admin或者没有值则跳转到首页，否则跳转到对应店铺
    if (source_type === 'distributor') {
      if (source_id > 0) {
        distributor_id = source_id
      }
    }

    return JumpStoreIndex({ distributor_id })
  }

  handleCouponClick = () => {
    Taro.navigateTo({
      url: `/subpages/marketing/coupon-center`
    })
  }

  handleCouponClick1 = () => {
    Taro.navigateTo({
      url: `/others/pages/nullify/coupon-nullify`
    })
  }

  /*handleClickChecked = (id) => {
    this.setState({
      curId: id
    })
  }*/

  render() {
    const { curTabIdx, list, page, scrollTop } = this.state
    const { colors } = this.props
    const tabList = this.buildTabList()

    return (
      <View
        className={classNames('coupon-list', {
          'has-navbar': isNavbar()
        })}
      >
        <SpNavBar title={$t('708ca93b.42c28c')} leftIconType='chevron-left' fixed='true' />
        <AtTabs
          className={`coupon-list__tabs ${hasNavbar && 'navbar_padtop'} ${
            colors.data[0].primary ? 'customTabsStyle' : ''
          }`}
          current={curTabIdx}
          tabList={tabList}
          onClick={this.handleClickTab}
          customStyle={{
            color: colors.data[0].primary
            // backgroundColor: colors.data[0].primary
          }}
        ></AtTabs>

        <ScrollView
          scrollY
          className='coupon-list__scroll'
          scrollWithAnimation
          scrollTop={scrollTop}
          onScroll={this.handleScroll}
          onScrollToLower={this.nextPage}
        >
          <View className='coupon-list-ticket'>
            {list.map((item) => {
              let begin_date = new Date(item.begin_date) / 1000
              let time = parseInt(new Date().getTime() / 1000)
              return (
                <CouponItem
                  info={item}
                  key={item.id}
                  distributor_info={item.distributor_info}
                  onHandleClick={this.handleClick.bind(this, item)}
                >
                  <View style={{ fontSize: '22rpx' }}>
                    {item.card_type === 'cash' || item.card_type === 'discount'
                      ? $t('593377c2.d48da8')
                      : ''}
                    {item.card_type === 'new_gift' &&
                    item.status == 1 &&
                    item.tagClass == 'notstarted'
                      ? $t('da5ae518.dd4e55')
                      : ''}
                    {item.card_type === 'new_gift' && item.tagClass != 'notstarted'
                      ? item.status == 10
                        ? $t('708ca93b.e9cbed')
                        : item.status == 1 && time > begin_date
                        ? $t('708ca93b.16b114')
                        : item.status == 1 && time < begin_date
                        ? $t('da5ae518.dd4e55')
                        : ''
                      : ''}
                  </View>
                </CouponItem>
              )
            })}
            {page.isLoading && <Loading>{$t('f1d3181c.bd0271')}</Loading>}
            {!page.isLoading && !page.hasNext && !list.length && (
              <SpNote img='trades_empty.png'>{$t('708ca93b.8a4368')}</SpNote>
            )}
          </View>
        </ScrollView>
        <View className='coupon-bottom'>
          <View className='left' onClick={this.handleCouponClick1.bind(this)}>
            {$t('2d319bee.a396a9')}
          </View>
          <View className='middle'>｜</View>
          <View className='right' onClick={this.handleCouponClick.bind(this)}>
            {$t('0bed8171.cf5dc9')}
            <Image className='icon' src={`${process.env.APP_IMAGE_CDN}/coupon_right_icon.png`} />
          </View>
        </View>
      </View>
    )
  }
}

export default connect(({ colors }) => ({
  colors: colors.current
}))(withPager(withTranslation()(Coupon)))
