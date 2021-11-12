import Taro, { Component } from '@tarojs/taro'
import { View, Text, Icon, ScrollView } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { BackToTop, Loading, SpNote } from '@/components'
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
      list: []
    }
  }

  componentDidMount() {
    this.nextPage()
  }

  async fetch(params) {
    const { curIdx } = this.state
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
      total_count
    }
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
    const { list, page, scrollTop } = this.state

    return (
      <View className='page-distribution-record'>
        <ScrollView
          className='record-list__scroll'
          scrollY
          scrollTop={scrollTop}
          onScrollToLower={this.nextPage}
        >
          <View className='section list'>
            {list.map((item, idx) => {
              return (
                <View className='list-item no-flex' onClick={this.handleToggle.bind(this, idx)}>
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
