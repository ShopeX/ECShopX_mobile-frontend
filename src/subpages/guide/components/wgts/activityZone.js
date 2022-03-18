import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
// import { SpTabList, AvitivityGoodsItem } from '@/components'
import api from '@/api'
import { pickBy, navigateTo } from '@/utils'

import './activityZone.scss'

export default class activityZone extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null,
    autoPlay: true,
    curIdx: 0
  }

  constructor(props) {
    super(props)

    this.state = {
      tabCurrentIndex: 0,
      nList: null,
      tabList: []
    }
  }
  async componentDidMount() {
    const { info } = this.props
    const { data } = info

    let list = await api.item.promotionCategory({ marketing_id: data[0].id })

    let tabList = []
    list.forEach((c_item) => {
      let nList = pickBy(c_item.items, {
        img: 'pics[0]',
        item_id: 'item_id',
        title: 'itemName',
        desc: 'brief',
        item_name: 'item_name',
        item_category_main: 'item_category_main',
        price: 'price',
        market_price: 'market_price',
        activity_type: 'activity_type',
        act_price: 'act_price',
        activity: 'activity',
        self_price: 'self_price',
        is_show_green: 'is_show_green',
        point_change: 'point_change',
        nospec: 'nospec',
        price_type: 'price_type',
        marketing_type: 'marketing_type',
        min_market_price: 'min_market_price',
        max_market_price: 'max_market_price',
        min_price: 'min_price',
        max_price: 'max_price',
        min_activity_price: 'min_activity_price',
        max_activity_price: 'max_activity_price'
      })
      let nList_f = nList && nList.splice(0, 4)
      let nList_s = nList && nList.splice(0, 4)
      tabList.push({
        title: c_item.category.category_name,
        nList_f,
        nList_s
      })
    })

    this.setState({
      nList: [],
      tabList
    })
  }
  handleTabClick = (item, index) => {
    this.setState({
      tabCurrentIndex: index
    })
  }

  handleClickItem = (item, index) => {
    navigateTo(`/subpages/guide/item/espier-detail?id=${item.item_id}`)
  }

  handleSwiperChange = (e) => {
    const { current } = e.detail
    this.props.onChangeSwiper(current)
  }

  handleClickActivity = (activity_id) => {
    navigateTo(`/subpages/guide/item/list?activity_id=${activity_id}`)
  }

  render() {
    const { info, curIdx } = this.props
    const { tabList, tabCurrentIndex, nList } = this.state
    if (!(info && tabList.length)) {
      return null
    }

    let nList_f = tabList[tabCurrentIndex].nList_f
    let nList_s = tabList[tabCurrentIndex].nList_s
    // if(nList_s.length){}

    const { config, base, data } = info

    return (
      <View className='activity-zone'>
        <View className='activity-zone__title'>
          <View className='activity-zone__btitle'>{base.title}</View>
          <View
            className='activity-zone__subtitle'
            onClick={this.handleClickActivity.bind(this, data[0].id)}
          >
            {base.subtitle}
          </View>
          <View className='in-icon in-icon-sanjiaoxing02'></View>
        </View>
        <View className='category-tab'>
          {/* <SpTabList current={tabCurrentIndex} tabList={tabList} onClick={this.handleTabClick} /> */}
        </View>
        <View className='scroll-list'>
          <ScrollView scrollX className='list'>
            {nList_f &&
              nList_f.map((item, index) => {
                return (
                  <View className='list-item slider-item__mr'>
                    {/* <AvitivityGoodsItem
                      showVipCard
                      isshowcart
                      isshowprice
                      info={item}
                      subtitle={base.subtitle}
                      onClick={() => this.handleClickItem(item, index)}
                    /> */}
                  </View>
                )
              })}
          </ScrollView>
          <ScrollView scrollX className='list'>
            {nList_s &&
              nList_s.map((item, index) => {
                return (
                  <View className='list-item slider-item__mr'>
                    {/* <AvitivityGoodsItem
                      showVipCard
                      info={item}
                      subtitle={base.subtitle}
                      onClick={() => this.handleClickItem(item, 4 + index)}
                    /> */}
                  </View>
                )
              })}
          </ScrollView>
          {data[0] && data[0].goodslist.length > 8 && (
            <View className='ac_btn'>
              <View className='more' onClick={this.handleClickActivity.bind(this, data[0].id)}>
                查看更多
                <View className='in-icon in-icon-youjiantou'></View>
              </View>
            </View>
          )}
        </View>
      </View>
    )
  }
}
