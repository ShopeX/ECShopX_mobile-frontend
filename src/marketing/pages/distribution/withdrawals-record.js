/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Icon, ScrollView } from '@tarojs/components'
import { withTranslation } from 'react-i18next'
import { Loading, SpNote, SpPage } from '@/components'
import { $t, ti } from '@/i18n'
import api from '@/api'
import { withPager, withBackToTop } from '@/hocs'
import { classNames, pickBy } from '@/utils'
import './withdrawals-record.scss'

@withPager
@withBackToTop
class DistributionWithdrawalsRecord extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ...this.state,
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
    Taro.setNavigationBarTitle({ title: $t('f9a10522.103053') })
  }

  async fetch(params) {
    const { page_no: page, page_size: pageSize } = params
    const query = {
      page,
      pageSize
    }

    const { list, total_count } = await api.distribution.withdrawRecord(query)

    const nList = pickBy(list, {
      status: 'status',
      money: 'money',
      created_date: 'created_date',
      remarks: 'remarks',
      isopen: true
    })

    this.setState({
      list: [...this.state.list, ...nList]
    })

    return {
      total: total_count
    }
  }

  handleToggle = (idx) => {
    const { list } = this.state
    const newList = list.map((item, i) => (i === idx ? { ...item, isopen: !item.isopen } : item))
    this.setState({ list: newList })
  }

  render() {
    const { list, page, scrollTop } = this.state

    return (
      <SpPage className='page-distribution-record'>
        <ScrollView
          className='record-list__scroll'
          scrollY
          scrollTop={scrollTop}
          onScrollToLower={this.nextPage}
        >
          <View className='section list'>
            {list.map((item, idx) => {
              return (
                <View
                  className='list-item no-flex'
                  key={idx}
                  onClick={this.handleToggle.bind(this, idx)}
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
      </SpPage>
    )
  }
}

export default withTranslation()(DistributionWithdrawalsRecord)
