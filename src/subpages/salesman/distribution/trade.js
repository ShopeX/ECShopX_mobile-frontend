/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { Loading, SpNote, SpNavBar, SpTabs, SpSearchInput, SpPage } from '@/components'
import api from '@/api'
import { hasNavbar, pickBy } from '@/utils'
import { withTranslation } from 'react-i18next'
import { withPager, withBackToTop } from '@/hocs'
import { $t } from '@/i18n'
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
      list: [],
      searchConditionList: [
        { label: '', value: 'order_id' },
        { label: '', value: 'shopName' },
        { label: '', value: 'mobile' }
      ],
      parameter: {}
    }
  }

  componentDidMount() {
    this.nextPage()
  }

  async fetch(params) {
    const { curTabIdx, parameter } = this.state
    const { type } = this.$instance?.router?.params
    const { page_no: page, page_size: pageSize } = params
    const query = {
      brokerage_source: type,
      page,
      pageSize,
      isSalesmanPage: 1
    }
    query[parameter.key] = parameter.keywords

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
      rebate_point: 'rebate_point',
      store_name: 'store_name',
      promote_type: 'promote_type'
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

  handleConfirm(val) {
    this.resetPage()
    this.setState(
      {
        parameter: val,
        list: []
      },
      () => {
        this.nextPage()
      }
    )
  }

  render() {
    const { list, page, tabList, curFilterIdx, scrollTop, curTabIdx, searchConditionList } =
      this.state

    const displayTabList = tabList.map((tab, index) => ({
      ...tab,
      title: index === 0 ? $t('9696edd5.fc8ee8') : $t('9696edd5.4113e7')
    }))
    const displaySearchConditionList = searchConditionList.map((row, index) => ({
      ...row,
      label:
        [$t('9696edd5.1e8dc2'), $t('9696edd5.0d4934'), $t('9696edd5.8098e2')][index] || row.label
    }))

    return (
      <SpPage scrollToTopBtn>
        <View className='page-distribution-trade'>
          <SpNavBar title={$t('9696edd5.4c117f')} leftIconType='chevron-left' />
          <SpSearchInput
            placeholder={$t('9696edd5.ec47d2')}
            isShowSearchCondition
            searchConditionList={displaySearchConditionList}
            onConfirm={this.handleConfirm.bind(this)}
          />
          <SpTabs
            current={curTabIdx}
            tablist={displayTabList}
            onChange={(e) => {
              this.handleClickTab(e)
            }}
          />
          {/* <AtTabs
          className={`trade-list__tabs ${hasNavbar && 'trade-list__tabs_web'}`}
          current={curTabIdx}
          tabList={tabList}
          onClick={this.handleClickTab}
        >
          {tabList.map((panes, pIdx) => (
            <AtTabsPane current={curTabIdx} key={pIdx.title} index={pIdx}></AtTabsPane>
          ))}
        </AtTabs> */}
          <ScrollView
            className={`trade-list__scroll ${hasNavbar && 'trade-list__scroll_web'}`}
            scrollY
            scrollTop={scrollTop}
            onScrollToLower={this.nextPage}
          >
            <View className='section list'>
              {list.map((item, index) => {
                return (
                  <View className='list-item' key={index}>
                    <View className='list-item-txt'>
                      <View className='order-no'>
                        <Text className='key'>{$t('9696edd5.b93075')}</Text>
                        {item.order_id}
                      </View>
                      <View className='order-no'>
                        <Text className='key'>{$t('9696edd5.a35c80')}</Text>
                        {item.store_name}
                      </View>
                      <View className='order-no'>
                        <Text className='key'>{$t('9696edd5.49b875')}</Text>
                        {item.promote_type}
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
        </View>
      </SpPage>
    )
  }
}

export default withTranslation()(DistributionTrade)
