/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { connect } from 'react-redux'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { withPager, withBackToTop } from '@/hocs'
import api from '@/api'
import { pickBy, hasNavbar, isWxWeb, VERSION_PLATFORM } from '@/utils'
import { BackToTop, Loading, GoodsItem, SpNavBar, SpNote, SpRecommendItem } from '@/components'
import { $t, i18n } from '@/i18n'
import StoreFavItem from './comps/store-fav-item'

import './item-fav.scss'

@connect(({ user }) => ({
  favs: user.favs
}))
@withPager
@withBackToTop
export default class ItemFav extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ...this.state,
      curTabIdx: 0,
      list: []
    }
  }

  componentDidMount() {
    this._onLanguageChanged = () => this.forceUpdate()
    i18n.on('languageChanged', this._onLanguageChanged)
  }

  componentWillUnmount() {
    if (this._onLanguageChanged) {
      i18n.off('languageChanged', this._onLanguageChanged)
    }
  }

  getTabList() {
    const tabList = [
      { title: $t('ee4c0c5d.9897d8'), status: '0' },
      { title: $t('ee4c0c5d.e8f87a'), status: '1' }
    ]
    if (VERSION_PLATFORM) {
      tabList.push({ title: $t('ee4c0c5d.295713'), status: '2' })
    }
    return tabList
  }

  componentDidShow() {
    Taro.setNavigationBarTitle({ title: $t('ee4c0c5d.ae336c') })
    this.resetPage()
    this.setState(
      {
        list: []
      },
      () => {
        this.nextPage()
      }
    )
  }

  hasFav = (item_id) => {
    const { favs = [] } = this.props
    return favs.findIndex((item) => item.item_id === item_id) > -1
  }

  async fetch(params) {
    const { page_no: page, page_size: pageSize } = params
    const query = {
      page,
      pageSize
    }

    const { list, total } = await (async () => {
      let list = []
      let total = 0
      let res = null
      switch (this.state.curTabIdx) {
        case 0:
          res = await api.member.favsList(query)
          list = pickBy(res.list, {
            img: 'item_image',
            fav_id: 'fav_id',
            item_id: 'item_id',
            title: 'item_name',
            desc: 'brief',
            item_type: 'item_type',
            distributor_id: 'distributor_id',
            point: 'point',
            // price: ({ price }) => (price/100).toFixed(2),
            price: ({ price, item_price }) => ((price || item_price) / 100).toFixed(2),
            // is_fav: ({ item_id }) => this.hasFav(item_id)
            is_fav: true
          })
          total = res.total_count
          break
        case 1:
          res = await api.article.totalCollectArticle(query)
          list = pickBy(res.list, {
            img: 'image_url',
            fav_id: 'fav_id',
            item_id: 'article_id',
            title: 'title',
            summary: 'summary',
            head_portrait: 'head_portrait',
            author: 'author',
            item_type: 'item_type'
          })
          total = res.total_count
          break
        case 2:
          res = await api.member.storeFavList(query)
          list = pickBy(res.list, {
            distributor_id: 'distributor_id',
            fav_num: 'fav_num',
            name: 'name',
            logo: 'logo',
            item_type: 'item_type'
          })
          total = res.total_count
          break
        default:
      }
      return { list, total }
    })()

    this.setState({
      list: [...this.state.list, ...list],
      query
    })

    return {
      total
    }
  }

  handleClickItem = (item) => {
    let detailUrl
    if (item.item_type === 'pointsmall') {
      //积分商城
      detailUrl = `/subpages/item/espier-detail?id=${item.item_id}&dtid=${item.distributor_id}&type=pointitem`
    } else {
      detailUrl = `/subpages/item/espier-detail?id=${item.item_id}&dtid=${item.distributor_id}`
    }
    const url = (() => {
      let link = null
      switch (this.state.curTabIdx) {
        case 0:
          link = detailUrl
          break
        case 1:
          link = `/pages/recommend/detail?id=${item.item_id}`
          break
        case 2:
          link = `/subpages/store/index?id=${item.distributor_id}`
          break
        default:
          link = ''
      }
      return link
    })()
    Taro.navigateTo({
      url
    })
  }

  handleFavRemoved = () => {
    this.resetPage()
    this.setState(
      {
        list: []
      },
      () => {
        this.nextPage()
      }
    )
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

  render() {
    const { list, showBackToTop, scrollTop, page, curTabIdx } = this.state
    const tabList = this.getTabList()
    console.log('ItemFav:list', list)
    return (
      <View className='page-goods-fav'>
        <SpNavBar title={$t('ee4c0c5d.ae336c')} leftIconType='chevron-left' fixed='true' />
        <AtTabs
          className={`trade-list__tabs ${hasNavbar && 'navbar_padtop'}`}
          current={curTabIdx}
          tabList={tabList}
          onClick={this.handleClickTab}
        >
          {tabList.map((panes, pIdx) => (
            <AtTabsPane current={curTabIdx} key={panes.status} index={pIdx}></AtTabsPane>
          ))}
        </AtTabs>
        <ScrollView
          className={`goods-list__scroll ${isWxWeb && 'goods_scroll_top'} `}
          scrollY
          scrollTop={scrollTop}
          scrollWithAnimation
          onScroll={this.handleScroll}
          onScrollToLower={this.nextPage}
        >
          {curTabIdx === 0 && (
            <View className='goods-list goods-list__type-grid'>
              {list.map((item) => {
                return (
                  <View className='goods-list__item' key={item.item_id}>
                    <GoodsItem
                      key={item.item_id}
                      info={item}
                      onClick={() => this.handleClickItem(item)}
                      isPointitem={item.item_type === 'pointsmall'}
                    />
                  </View>
                )
              })}
            </View>
          )}
          {curTabIdx === 1 && (
            <View className='goods-list goods-list__type-grid'>
              {list.map((item) => {
                return (
                  <View className='goods-list__item' key={item.item_id}>
                    <SpRecommendItem
                      key={item.item_id}
                      info={item}
                      onClick={() => this.handleClickItem(item)}
                    />
                  </View>
                )
              })}
            </View>
          )}
          {curTabIdx === 2 && (
            <View className='goods-list'>
              {list.map((item) => {
                return (
                  <View className='goods-list__item' key={item.distributor_id}>
                    <StoreFavItem
                      key={item.distributor_id}
                      info={item}
                      onClick={() => this.handleClickItem(item)}
                      onCancel={this.handleFavRemoved}
                    />
                  </View>
                )
              })}
            </View>
          )}
          {page.isLoading ? <Loading>{$t('ee4c0c5d.bd0271')}</Loading> : null}
          {!page.isLoading && !page.hasNext && !list.length && (
            <SpNote img='trades_empty.png'>{$t('ee4c0c5d.ba1de9')}</SpNote>
          )}
        </ScrollView>

        <BackToTop show={showBackToTop} onClick={this.scrollBackToTop} />
      </View>
    )
  }
}
