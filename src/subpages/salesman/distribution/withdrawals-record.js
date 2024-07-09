import React, { Component } from 'react'
import { View, Text, Icon, ScrollView } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { BackToTop, Loading, SpNote, SpSearchInput } from '@/components'
import api from '@/api'
import { withPager, withBackToTop } from '@/hocs'
import { classNames, pickBy } from '@/utils'

import './withdrawals-record.scss'

@withPager
@withBackToTop
export default class DistributionWithdrawalsRecord extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ...this.state,
      curIdx: -1,
      list: [],
      searchConditionList: [{ label: '全部店铺', value: '' }],
      parameter: {
        distributor_id: '',
        keywords: ''
      }
    }
  }

  componentDidMount() {
    this.nextPage()
    this.distributor()
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
      label: '全部店铺'
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
            placeholder='输入内容'
            isShowSearchCondition
            searchConditionList={searchConditionList}
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
                      申请提现 {item.money / 100} 元
                    </View>
                    <View className='content-right muted'>{item.created_date}</View>
                  </View>
                  <View className={classNames('status-body', item.isopen && 'open')}>
                    {item.status === 'success' && (
                      <View className={classNames('status-content', item.isopen && 'open')}>
                        申请成功
                      </View>
                    )}
                    {(item.status === 'apply' || item.status === 'process') && (
                      <View className={classNames('status-content', item.isopen && 'open')}>
                        审核中
                      </View>
                    )}
                    {item.status === 'reject' && (
                      <View className={classNames('status-content', item.isopen && 'open')}>
                        申请驳回：{item.remarks}
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
          {page.isLoading ? <Loading>正在加载...</Loading> : null}
          {!page.isLoading && !page.hasNext && !list.length && (
            <SpNote img='trades_empty.png'>暂无数据~</SpNote>
          )}
        </ScrollView>
      </View>
    )
  }
}
