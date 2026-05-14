/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import api from '@/api'
import { withPager } from '@/hocs'
import { pickBy } from '@/utils'
import { withTranslation } from 'react-i18next'
import { $t } from '@/i18n'
import './reservation-list.scss'

class ReservationList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ...this.state,
      curTabIdx: 0,
      list: [],
      curId: null
    }
  }

  componentDidMount() {
    this.nextPage()
  }

  async fetch(params) {
    const { page_no: page, page_size: pageSize } = params
    const { curTabIdx } = this.state
    let vaildStatus
    if (curTabIdx === 0) {
      vaildStatus = true
    } else {
      vaildStatus = false
    }
    params = {
      ...params,
      valid: vaildStatus,
      page,
      pageSize
    }
    const { list, count: total } = await api.member.couponList(params)
    const nList = pickBy(list, {
      id: 'id',
      status: 'status',
      reduce_cost: 'reduce_cost',
      least_cost: 'least_cost',
      begin_date: 'begin_date',
      end_date: 'end_date',
      card_type: 'card_type',
      tagClass: 'tagClass',
      title: 'title',
      discount: 'discount'
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

  /*handleClickChecked = (id) => {
    this.setState({
      curId: id
    })
  }*/
  handleClickDetail = () => {
    Taro.navigateTo({
      url: '/marketing/pages/reservation/reservation-detail'
    })
  }

  render() {
    const { curTabIdx } = this.state
    const tabList = [
      { title: $t('d839699a.3ea1b6'), status: '1' },
      { title: $t('d839699a.4d5ccd'), status: '2' }
    ]

    return (
      <View className='reservation-list'>
        <AtTabs
          className='reservation-list__tabs'
          current={curTabIdx}
          tabList={tabList}
          onClick={this.handleClickTab}
        >
          {tabList.map((panes, pIdx) => (
            <AtTabsPane current={curTabIdx} key={panes.status} index={pIdx}></AtTabsPane>
          ))}
        </AtTabs>

        <ScrollView scrollY className='reservation-list__scroll' onScrollToLower={this.nextPage}>
          <View className='reservation-list__list'>
            <View className='reservation-list__item'>
              <View className='reservation-list__item_title'>
                <Text>{$t('d839699a.652488')}</Text>
                <Text>{$t('d839699a.bb9f29')}</Text>
              </View>
              <View className='reservation-list__item_content'>
                <View className='content_data'>
                  <Text>{$t('d839699a.652e09')}</Text>
                  <Text>{$t('d839699a.4343fa')}</Text>
                </View>
                <View className='content_data'>
                  <Text>{$t('d839699a.97ad14')}</Text>
                  <Text>{$t('d839699a.1b39e3')}</Text>
                </View>
              </View>
              <Text className='reservation-list__item_btn'>{$t('d839699a.5b48db')}</Text>
            </View>
            <View className='reservation-list__item'>
              <View className='reservation-list__item_title'>
                <Text>{$t('d839699a.652488')}</Text>
                <Text>{$t('d839699a.bb9f29')}</Text>
              </View>
              <View className='reservation-list__item_content'>
                <View className='content_data'>
                  <Text>{$t('d839699a.652e09')}</Text>
                  <Text>{$t('d839699a.4343fa')}</Text>
                </View>
                <View className='content_data'>
                  <Text>{$t('d839699a.97ad14')}</Text>
                  <Text>{$t('d839699a.1b39e3')}</Text>
                </View>
              </View>
              <Text
                className='reservation-list__item_btn'
                onClick={this.handleClickDetail.bind(this)}
              >
                {$t('d839699a.5b48db')}
              </Text>
            </View>
            {/* {
              list.map(item => {
                return (
                  <CouponItem
                    info={item}
                    key={item.id}
                  />
                )
              })
            }
            {
              page.isLoading && <Loading>正在加载...</Loading>
            }
            {
              !page.isLoading && !page.hasNext && !list.length
              && (<SpNote img='trades_empty.png'>赶快去添加吧~</SpNote>)
            } */}
          </View>
        </ScrollView>
      </View>
    )
  }
}

export default withPager(withTranslation()(ReservationList))
