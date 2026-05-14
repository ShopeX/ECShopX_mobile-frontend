/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, ScrollView, Text, Image } from '@tarojs/components'
import { withTranslation } from 'react-i18next'
import { withPager, withBackToTop } from '@/hocs'
import { BackToTop, Loading, SpNote, GoodsItem, SpNavBar } from '@/components'
import { AtCountdown } from 'taro-ui'
import { connect } from 'react-redux'
import { $t } from '@/i18n'
import api from '@/api'
import { classNames, pickBy, isNavbar, getDistributorId } from '@/utils'
import './seckill-goods-list.scss'

class SeckillGoodsList extends Component {
  $instance = getCurrentInstance() || {}
  constructor(props) {
    super(props)

    this.state = {
      ...this.state,
      query: null,
      last_seconds: 1759242,
      timer: null,
      list: [],
      imgurl: '',
      status: '',
      shareInfo: {}
    }
  }

  componentDidMount() {
    this.syncNavTitle()
    // this.setState({
    //   query: {
    //     status: this.state.curTabIdx === 0 ? 'valid' : 'notice',
    //     item_type: 'normal'
    //   }
    // }, () => {
    //   this.nextPage()
    // })
    console.log(this.$instance?.router?.params, 41)
    this.nextPage()
    api.wx.shareSetting({ shareindex: 'seckill' }).then((res) => {
      this.setState({
        shareInfo: res
      })
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.i18n?.language !== this.props.i18n?.language) {
      this.syncNavTitle()
    }
  }

  syncNavTitle = () => {
    Taro.setNavigationBarTitle({ title: $t('c4d2fddd.d1ca1e') })
  }

  onShareAppMessage() {
    const seckill_id = this.$instance?.router?.params.seckill_id
    const res = this.state.shareInfo
    const { userId } = Taro.getStorageSync('userinfo')
    let query = userId ? `?uid=${userId}` : ''
    query = seckill_id
      ? query
        ? `${query}&seckill_id=${seckill_id}`
        : `${query}?seckill_id=${seckill_id}`
      : ''

    return {
      title: res.title,
      imageUrl: res.imageUrl,
      path: `/marketing/pages/item/seckill-goods-list${query}`
    }
  }

  onShareTimeline() {
    const res = this.state.shareInfo
    const { userId } = Taro.getStorageSync('userinfo')
    const query = userId ? `uid=${userId}` : ''
    return {
      title: res.title,
      imageUrl: res.imageUrl,
      query: query
    }
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
    const dtid = distributor_id ? distributor_id : getDistributorId()
    Taro.navigateTo({
      url: `/subpages/item/espier-detail?id=${item.item_id}&dtid=${dtid}`
    })
  }
  async fetch(params) {
    const { page_no: page, page_size: pageSize } = params
    const dtid = getDistributorId()
    const query = {
      seckill_id: this.$instance?.router?.params.seckill_id,
      type: this.$instance?.router?.params.seckill_type,
      distributor_id: dtid,
      page,
      pageSize
    }

    const {
      items: list,
      total_count: total,
      ad_pic: imgurl,
      last_seconds,
      status
    } = await api.seckill.seckillGoodsList(query)

    let timer = null
    timer = this.calcTimer(last_seconds)

    const nList = pickBy(list, {
      img: 'pics[0]',
      item_id: 'item_id',
      title: 'itemName',
      desc: 'brief',
      distributor_id: 'distributor_id',
      price: ({ activity_price }) => (activity_price / 100).toFixed(2),
      market_price: ({ market_price }) => (market_price / 100).toFixed(2)
    })

    this.setState({
      timer,
      list: [...this.state.list, ...nList],
      imgurl,
      status,
      last_seconds
    })
    return {
      total
    }
  }

  render() {
    const { colors } = this.props
    const { list, imgurl, showBackToTop, scrollTop, page, timer, status } = this.state
    return (
      <View
        className={classNames('page-seckill-goods', {
          'has-navbar': isNavbar()
        })}
      >
        <SpNavBar title={$t('c4d2fddd.d1ca1e')} />
        <ScrollView
          className='seckill-goods__scroll'
          scrollY
          scrollTop={scrollTop}
          scrollWithAnimation
          onScroll={this.handleScroll}
          onScrollToLower={this.nextPage}
        >
          <Image className='seckill-goods__swiper' src={imgurl} mode='widthFix' />
          {status === 'it_has_ended' ? (
            <View className='seckill-goods__timer'>
              <Text>{$t('c4d2fddd.cdae1c')}</Text>
            </View>
          ) : (
            <View className='seckill-goods__timer'>
              {timer && (
                <View>
                  <AtCountdown
                    isShowDay
                    day={timer.dd}
                    hours={timer.hh}
                    minutes={timer.mm}
                    seconds={timer.ss}
                  />
                  {status === 'in_the_notice' && <Text>{$t('c4d2fddd.e42723')}</Text>}
                  {status === 'in_sale' && <Text>{$t('c4d2fddd.23a300')}</Text>}
                </View>
              )}
            </View>
          )}
          <View className='seckill-goods__list seckill-goods__type-list'>
            {list.map((item) => {
              return (
                <View
                  key={item.item_id}
                  className='goods-list__item'
                  onClick={() => this.handleClickItem(item)}
                >
                  <GoodsItem key={item.item_id} info={item} showFav={false}>
                    <View
                      className='seckill-goods__list-btn'
                      style={`background: ${colors.data[0].primary}`}
                    >
                      {status === 'in_the_notice' && <Text>{$t('c4d2fddd.5aa512')}</Text>}
                      {status === 'in_sale' && <Text>{$t('c4d2fddd.f7e08e')}</Text>}
                      {status === 'it_has_ended' && <Text>{$t('c4d2fddd.01df40')}</Text>}
                    </View>
                  </GoodsItem>
                </View>
              )
            })}
          </View>
          {page.isLoading ? <Loading>{$t('56af9ff8.bd0271')}</Loading> : null}
          {!page.isLoading && !page.hasNext && !list.length && (
            <SpNote img='trades_empty.png'>{$t('56af9ff8.ba1de9')}</SpNote>
          )}
        </ScrollView>

        <BackToTop show={showBackToTop} onClick={this.scrollBackToTop} />
      </View>
    )
  }
}

export default connect(({ colors }) => ({
  colors: colors.current
}))(withPager(withBackToTop(withTranslation()(SeckillGoodsList))))
