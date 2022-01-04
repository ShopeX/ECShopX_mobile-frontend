import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, ScrollView, Picker } from '@tarojs/components'
import { SpToast, Loading, SpNote } from '@/components'
// import S from '@/spx'
import api from '@/api'
import { withPager, withBackToTop } from '@/hocs'
import { pickBy } from '@/utils'
// import entry from '@/utils/entry'

import './shop-achievement.scss'

@withPager
@withBackToTop
export default class DistributionShopAchievement extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      info: {},
      query: null,
      date: '',
      list: []
    }
  }

  async componentDidMount () {
    this.nextPage()
  }

  async fetch (params) {
    const { date } = this.state
    const { page_no: page, page_size: pageSize } = params
    const query = {
      ...this.state.query,
      plan_date: date,
      page,
      pageSize
    }

    const { list, total_count: total } = await api.distribution.shopAchievement(query)
    const nList = pickBy(list, {
      title: 'item_name',
      limit_desc: 'limit_desc',
      total_fee: ({ total_fee }) => (total_fee / 100).toFixed(2),
      close_num: 'close_num',
      finish_num: 'finish_num',
      wait_num: 'wait_num',
      rebate_type: 'rebate_type',
      status: 'status'
    })

    this.setState({
      list: [...this.state.list, ...nList],
      showDrawer: false,
      query
    })

    return {
      total
    }
  }

  handleDateChange = (val) => {
    console.log(11111111)
    this.setState(
      {
        date: val.detail.value
      },
      () => {
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
    )
  }

  render () {
    const { list, page, date, scrollTop } = this.state

    return (
      <View className='page-distribution-shop'>
        <View class='page-header'>
          <Picker mode='date' fields='month' onChange={this.handleDateChange}>
            {date ? (
              <View className='picker'>业绩周期：{this.state.date}</View>
            ) : (
              <View>
                查看历史业绩请选择日期 <Text className='icon-arrowDown' />
              </View>
            )}
          </Picker>
        </View>
        <ScrollView
          className='achievement-list__scroll'
          scrollY
          scrollTop={scrollTop}
          scrollWithAnimation
          onScroll={this.handleScroll}
          onScrollToLower={this.nextPage}
        >
          <View className='achievement-list'>
            {list.map((item, index) => (
              <View className='section achievement-list__item'>
                <View className='section-title'>
                  <View className='achievement-list__item-label'>任务商品：</View>
                  <View className='achievement-list__item-title'>{item.title}</View>
                </View>
                {item.limit_desc && (
                  <View className='achievement-list__item-target'>{item.limit_desc}</View>
                )}
                {!item.limit_desc && item.status === 1 && (
                  <View className='achievement-list__item-target'>已达标</View>
                )}
                <View className='section-body view-flex content-center achievement-list__item-status'>
                  {item.rebate_type == 'total_num' && (
                    <View className='view-flex-item'>
                      <View className='status-label'>已完成订单</View>
                      <View className='status-value'>{item.finish_num}</View>
                    </View>
                  )}
                  {item.rebate_type == 'total_money' && (
                    <View className='view-flex-item'>
                      <View className='status-label'>已完成金额</View>
                      <View className='status-value price'>
                        <Text className='cur'>¥</Text>
                        {item.total_fee}
                      </View>
                    </View>
                  )}
                  <View className='view-flex-item'>
                    <View className='status-label'>已关闭订单</View>
                    <View className='status-value'>{item.close_num}</View>
                  </View>
                  <View className='view-flex-item'>
                    <View className='status-label'>待确认订单</View>
                    <View className='status-value'>{item.wait_num}</View>
                  </View>
                </View>
              </View>
            ))}
          </View>
          {page.isLoading ? <Loading>正在加载...</Loading> : null}
          {!page.isLoading && !page.hasNext && !list.length && (
            <SpNote img='trades_empty.png'>暂无数据~</SpNote>
          )}
        </ScrollView>
        <SpToast />
      </View>
    )
  }
}
