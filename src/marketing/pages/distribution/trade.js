/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { withTranslation } from 'react-i18next'
import { Loading, SpNote, SpPage } from '@/components'
import { $t } from '@/i18n'
import api from '@/api'
import { pickBy } from '@/utils'
import { withPager, withBackToTop } from '@/hocs'
import './trade.scss'

@withPager
@withBackToTop
class DistributionTrade extends Component {
  $instance = getCurrentInstance() || {}
  constructor(props) {
    super(props)

    this.state = {
      ...this.state,
      curTabIdx: 0,
      tabList: [
        { title: '', num: '0' },
        { title: '', num: '0' }
      ],
      list: []
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
    Taro.setNavigationBarTitle({ title: $t('9696edd5.4c117f') })
  }

  async fetch(params) {
    const { curTabIdx } = this.state
    const { type } = this.$instance?.router?.params
    const { page_no: page, page_size: pageSize } = params
    const query = {
      brokerage_source: type,
      page,
      pageSize,
      isSalesmanPage: 1
    }

    const { close, noClose } = await api.distribution.commission(query)
    const total = curTabIdx == 0 ? noClose.total_count : close.total_count

    const nList = pickBy(curTabIdx == 0 ? noClose.list : close.list, {
      order_id: 'order_id',
      rebate: 'rebate',
      created_date: 'created_date',
      headimgurl: 'headimgurl',
      username: 'username',
      mobile: 'mobile',
      commission_type: 'commission_type',
      rebate_point: 'rebate_point'
    })

    this.setState({
      list: [...this.state.list, ...nList]
    })

    return {
      total
    }
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
    const { list, page, tabList, scrollTop, curTabIdx } = this.state
    const tabListForUi = tabList.map((tab, index) => ({
      ...tab,
      title: index === 0 ? $t('9696edd5.fc8ee8') : $t('9696edd5.4113e7')
    }))

    return (
      <SpPage className='page-distribution-trade'>
        <AtTabs
          className='trade-list__tabs'
          current={curTabIdx}
          tabList={tabListForUi}
          onClick={this.handleClickTab}
        >
          {tabListForUi.map((panes, pIdx) => (
            <AtTabsPane current={curTabIdx} key={panes.title} index={pIdx}></AtTabsPane>
          ))}
        </AtTabs>
        <ScrollView
          className='trade-list__scroll'
          scrollY
          scrollTop={scrollTop}
          onScrollToLower={this.nextPage}
        >
          <View className='section list'>
            {list.map((item, index) => {
              return (
                <View className='list-item' key={item.order_id || index}>
                  <View className='list-item-txt'>
                    <View className='order-no'>
                      <Text className='key'>{$t('9696edd5.b93075')}</Text>
                      {item.order_id}
                    </View>
                    <View className='order-no'>
                      <Text className='key'>{$t('9696edd5.ed7c5b')}</Text>
                      <Text className='mark'>
                        {item.commission_type === 'money' ? (
                          <Text className='cur'>
                            ￥<Text className='commission'>{item.rebate / 100}</Text>
                          </Text>
                        ) : (
                          <Text className='cur'>
                            {' '}
                            <Text className='commission'>
                              {item.rebate_point}
                              {$t('9696edd5.9f68a8')}
                            </Text>
                          </Text>
                        )}
                      </Text>
                    </View>
                    <View className='order-date'>{item.created_date}</View>
                  </View>
                  <View className='content-center'>
                    <Image className='customer-logo' src={item.headimgurl} />
                    <View className='customer-name'>{item.username}</View>
                    <View className='customer-phone'>{item.mobile}</View>
                  </View>
                </View>
              )
            })}
          </View>
          {page.isLoading ? <Loading>{$t('9696edd5.bd0271')}</Loading> : null}
          {!page.isLoading && !page.hasNext && !list.length && (
            <SpNote img='trades_empty.png'>{$t('9696edd5.ba1de9')}</SpNote>
          )}
        </ScrollView>
      </SpPage>
    )
  }
}

export default withTranslation()(DistributionTrade)
