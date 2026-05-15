/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, ScrollView, Text } from '@tarojs/components'
import { withTranslation } from 'react-i18next'
import { $t } from '@/i18n'
import { withPager, withBackToTop } from '@/hocs'
import { BackToTop, Loading, SpNote, GoodsItem, SpNavBar } from '@/components'
import { AtCountdown } from 'taro-ui'
import api from '@/api'
import { pickBy, validColor, isString } from '@/utils'
import NormalBackground from '../../assets/plusprice-head.png'
import './plusprice.scss'

class DetailPluspriceList extends Component {
  $instance = getCurrentInstance() || {}
  constructor(props) {
    super(props)

    this.state = {
      ...this.state,
      query: null,
      last_seconds: 1759242,
      timer: null,
      list: [],
      promotion_activity: {},
      isSetBackground: false,
      timeBackgroundColor: undefined
    }
  }

  componentDidMount() {
    this.syncNavTitle()
    this.nextPage()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.i18n?.language !== this.props.i18n?.language) {
      this.syncNavTitle()
    }
  }

  syncNavTitle = () => {
    Taro.setNavigationBarTitle({ title: $t('c4d2fddd.d1ca1e') })
  }

  setNavBar = (navbar_color) => {
    Taro.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor:
        isString(navbar_color) && validColor(navbar_color) ? navbar_color : '#FC7239',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
  }

  calcTimer(totalSec) {
    let remainingSec = totalSec
    const dd = Math.floor(totalSec / 24 / 3600)
    remainingSec -= dd * 3600 * 24
    const hh = Math.floor(remainingSec / 3600)
    remainingSec -= hh * 3600
    const mm = Math.floor(remainingSec / 60)
    remainingSec -= mm * 60
    const ss = Math.floor(remainingSec)

    return {
      dd,
      hh,
      mm,
      ss
    }
  }
  handleClickItem(item) {
    const { distributor_id } = item
    // const dtid = distributor_id ? distributor_id : getDistributorId()
    Taro.navigateTo({
      url: `/subpages/item/espier-detail?id=${item.item_id}&dtid=${distributor_id}`
    })
  }

  async fetch(params) {
    const { page_no: page, page_size: pageSize } = params
    const query = {
      marketing_id: this.$instance?.router?.params.marketing_id,
      page,
      pageSize
    }

    const {
      list,
      total_count: total,
      promotion_activity = {}
    } = await api.promotion.getpluspriceList(query)
    const { left_time, navbar_color, activity_background, timeBackgroundColor } = promotion_activity

    this.setNavBar(navbar_color)

    let timer = null
    timer = this.calcTimer(left_time)
    const nList = pickBy(list, {
      img: 'pics[0]',
      item_id: 'item_id',
      title: 'itemName',
      desc: 'item_spec_desc',
      distributor_id: 'distributor_id',
      marketing_id: 'marketing_id',
      // price: ({ price }) => (price / 100).toFixed(2),
      price: ({ plus_price }) => (plus_price / 100).toFixed(2),
      market_price: ({ market_price }) => (market_price / 100).toFixed(2)
    })

    this.setState({
      list: [...this.state.list, ...nList],
      promotion_activity,
      timer,
      isSetBackground: activity_background ? activity_background : NormalBackground,
      timeBackgroundColor: timeBackgroundColor ? timeBackgroundColor : undefined
    })
    return {
      total
    }
  }

  render() {
    const {
      list,
      showBackToTop,
      scrollTop,
      page,
      promotion_activity,
      timer,
      isSetBackground,
      timeBackgroundColor
    } = this.state
    if (!promotion_activity.marketing_name) return <Loading>{$t('f1d3181c.bd0271')}</Loading>
    return (
      <View
        className='page-plusprice'
        style={{
          'background-image': `url(${isSetBackground})`,
          'background-size': isSetBackground ? 'cover' : 'contain'
        }}
      >
        <SpNavBar title={$t('c4d2fddd.d1ca1e')} />
        <View className='plusprice-goods__info'>
          <View className='title'> {promotion_activity.marketing_name} </View>
          <View
            className='plusprice-goods__timer'
            style={{ 'background-color': timeBackgroundColor ? timeBackgroundColor : '#FC682D' }}
          >
            <View>
              <Text className='time-text'>{$t('6f27b25d.85423b')}</Text>
              {timer && (
                <AtCountdown
                  format={{
                    day: $t('12b6c337.249aba'),
                    hours: ':',
                    minutes: ':',
                    seconds: ''
                  }}
                  isShowDay
                  day={timer.dd}
                  hours={timer.hh}
                  minutes={timer.mm}
                  seconds={timer.ss}
                />
              )}

              {/* <AtCountdown
                        format={{ day:'天',hours: ':', minutes: ':', seconds: '' }}
                          isShowDay
                          day={2}
                          hours={1}
                          minutes={1}
                          seconds={10}
                        /> */}
            </View>
          </View>
        </View>
        <ScrollView
          className='plusprice-goods__scroll'
          scrollY
          scrollTop={scrollTop}
          scrollWithAnimation
          onScroll={this.handleScroll}
          onScrollToLower={this.nextPage}
        >
          {list && list.length && (
            <View className='plusprice-goods__list plusprice-goods__type-list'>
              {list.map((item) => {
                return (
                  <View
                    key={item.item_id}
                    className='goods-list__item'
                    onClick={() => this.handleClickItem(item)}
                  >
                    <GoodsItem key={item.item_id} info={item} showFav={false}></GoodsItem>
                  </View>
                )
              })}
            </View>
          )}

          {page.isLoading ? <Loading>{$t('f1d3181c.bd0271')}</Loading> : null}
          {!page.isLoading && !page.hasNext && !list.length && (
            <SpNote img='trades_empty.png'>{$t('f1d3181c.ba1de9')}</SpNote>
          )}
        </ScrollView>

        <BackToTop show={showBackToTop} onClick={this.scrollBackToTop} />
        {!isSetBackground && <View className='scroll-footer'></View>}
      </View>
    )
  }
}

export default withPager(withBackToTop(withTranslation()(DetailPluspriceList)))
