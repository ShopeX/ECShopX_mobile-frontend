/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Icon, ScrollView } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { BackToTop, Loading, SpNote, SpSearchInput } from '@/components'
import api from '@/api'
import { withTranslation } from 'react-i18next'
import { withPager, withBackToTop } from '@/hocs'
import { $t, ti } from '@/i18n'
import { classNames, pickBy } from '@/utils'
import './withdrawals-record.scss'

@withPager
@withBackToTop
class DistributionWithdrawalsRecord extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ...this.state,
      curIdx: -1,
      list: [],
      searchConditionList: [{ label: '', value: '' }],
      parameter: {
        distributor_id: '',
        keywords: ''
      }
    }
  }

  componentDidMount() {
    this.syncNavTitle()
    this.nextPage()
    this.distributor()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.i18n?.language !== this.props.i18n?.language) {
      this.syncNavTitle()
    }
  }

  syncNavTitle = () => {
    Taro.setNavigationBarTitle({ title: $t('f9a10522.103053') })
  }

  async fetch(params) {
    const { curIdx } = this.state
    const { page_no: page, page_size: pageSize } = params
    const query = {
      page,
      pageSize,
      ...this.state.parameter
    }

    const { list, total_count } = await api.salesman.salesmanGetCashWithdrawalList(query)

    const nList = pickBy(list, {
      status: 'status',
      money: 'money',
      created_date: 'created_date',
      remarks: 'remarks',
      distributor_name: 'distributor_name',
      isopen: true
    })

    this.setState({
      list: [...this.state.list, ...nList]
    })

    return {
      total: total_count
    }
  }

  // 重新获取
  resetGet = () => {
    this.resetPage(() => {
      this.setState(
        {
          list: []
        },
        () => {
          this.nextPage()
        }
      )
    })
  }

  handleConfirm(val) {
    this.setState(
      {
        parameter: {
          keywords: val.keywords,
          distributor_id: val.key
        }
      },
      () => {
        this.resetGet()
      }
    )
  }

  handSearch = (val) => {
    this.setState(
      {
        parameter: {
          ...this.state.parameter,
          distributor_id: val.distributor_id
        }
      },
      () => {
        this.resetGet()
      }
    )
  }

  distributor = async () => {
    const { list } = await api.salesman.getSalespersonSalemanShopList({
      page: 1,
      page_size: 1000
    })
    list.forEach((element) => {
      element.value = element.distributor_id
      element.label = element.name
    })
    list.unshift({
      value: '',
      label: ''
    })
    this.setState({
      searchConditionList: list
    })
  }

  handleToggle = (idx) => {
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
    const { list, page, scrollTop, searchConditionList } = this.state
    return (
      <View className='page-distribution-record'>
        <ScrollView
          className='record-list__scroll'
          scrollY
          scrollTop={scrollTop}
          onScrollToLower={this.nextPage}
        >
          <SpSearchInput
            placeholder={$t('a2608142.ec47d2')}
            isShowSearchCondition
            searchConditionList={searchConditionList.map((row) =>
              row.value === '' ? { ...row, label: row.label || $t('a2608142.77678b') } : row
            )}
            onConfirm={this.handleConfirm.bind(this)}
            onHandleSearch={this.handSearch.bind(this)}
          />
          <View className='section list'>
            {list.map((item, idx) => {
              return (
                <View
                  className='list-item no-flex'
                  onClick={this.handleToggle.bind(this, idx)}
                  key={idx}
                >
                  <View
                    className={classNames(
                      'view-flex-item',
                      'view-flex',
                      'view-flex-middle',
                      'status-header',
                      item.isopen && 'open'
                    )}
                  >
                    {item.status === 'success' && <Icon type='success' size='20'></Icon>}
                    {(item.status === 'apply' || item.status === 'process') && (
                      <Icon type='waiting' size='20'></Icon>
                    )}
                    {item.status === 'reject' && <Icon type='warn' size='20'></Icon>}
                    <View className='view-flex-item content-h-padded'>
                      {ti('a2608142.05546c', [item.money / 100])}
                    </View>
                    <View className='content-right muted'>{item.created_date}</View>
                  </View>
                  <View className={classNames('status-body', item.isopen && 'open')}>
                    {item.status === 'success' && (
                      <View className={classNames('status-content', item.isopen && 'open')}>
                        {$t('a2608142.17b7df')}
                      </View>
                    )}
                    {(item.status === 'apply' || item.status === 'process') && (
                      <View className={classNames('status-content', item.isopen && 'open')}>
                        {$t('a2608142.b720a6')}
                      </View>
                    )}
                    {item.status === 'reject' && (
                      <View className={classNames('status-content', item.isopen && 'open')}>
                        {ti('a2608142.973378', [item.remarks || ''])}
                      </View>
                    )}
                    <View className={classNames('status-content', item.isopen && 'open')}>
                      {item.distributor_name}
                    </View>
                  </View>
                </View>
              )
            })}
          </View>
          {page.isLoading ? <Loading>{$t('a2608142.bd0271')}</Loading> : null}
          {!page.isLoading && !page.hasNext && !list.length && (
            <SpNote img='trades_empty.png'>{$t('a2608142.ba1de9')}</SpNote>
          )}
        </ScrollView>
      </View>
    )
  }
}

export default withTranslation()(DistributionWithdrawalsRecord)
