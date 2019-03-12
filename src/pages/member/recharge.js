
import Taro, { Component } from '@tarojs/taro'
import {View, Text, ScrollView} from '@tarojs/components'
import { AtTabs, AtTabsPane} from 'taro-ui'
import { Loading, SpNote } from '@/components'
import { withPager } from '@/hocs'
import { pickBy, formatDataTime } from '@/utils'
import api from '@/api'

import './recharge.scss'

@withPager
export default class Recharge extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      curTabIdx: 0,
      tabList: [
        {title: '全部', status: ''},
        {title: '收入', status: 'income'},
        {title: '支出', status: 'outcome'}
      ],
      list: [],
      isLoading: false,
      totalDeposit: 0,
    }
  }

  componentDidMount () {
    const status = ''
    const tabIdx = this.state.tabList.findIndex(tab => tab.status === status)

    if (tabIdx >= 0) {
      this.setState({
        curTabIdx: tabIdx
      }, () => {
        this.nextPage()
      })
    } else {
      this.nextPage()
    }
  }


  async fetch (params) {
    this.setState({ isLoading: true })
    const { tabList, curTabIdx } = this.state
    params = {
      ...params,
      outin_type: tabList[curTabIdx].status
    }
    const { deposit } = await api.member.depositTotal()
    const { list, total_count: total } = await api.member.depositList(params)
    const nList = pickBy(list, {
      tradeType: 'tradeType',
      detail: 'detail',
      timeStart: ({ timeStart }) => (formatDataTime(timeStart * 1000)),
      money: ({ money }) => (money/100).toFixed(2),
    })
    // console.log(point, 65)
    this.setState({
      list: [...this.state.list, ...nList],
      totalDeposit: deposit
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

    this.setState({
      curTabIdx: idx
    }, () => {
      this.nextPage()
    })
  }

  render () {
    const { curTabIdx, tabList, list, page, totalDeposit } = this.state

    return (
      <View className='page-member-integral'>
        <View className='member-integral__hd'>
          <View className='integral-info'>
            <View className='integral-number'>图标<Text className='integral-number__text'>{totalDeposit}</Text></View>
            <View className='integral-text'>账户可用余额</View>
          </View>
        </View>

        <View className='member-integral__bd'>
          <View className='integral-sec integral-info__status'>
            <View className='integral-sec__horn'>
              <Text className='sp-icon sp-icon-laba laba_horn'> </Text>
            </View>
            <Text className='integral-sec__share'>充值可获取积分呦，赶紧行动吧~</Text>
          </View>

          <View className='integral-sec member-integral'>
            <AtTabs
              className='member-integral__tabs'
              current={curTabIdx}
              tabList={tabList}
              onClick={this.handleClickTab}
            >
              {
                tabList.map((panes, pIdx) =>
                  (<AtTabsPane
                    current={curTabIdx}
                    key={pIdx}
                    index={pIdx}
                    className='member-integral__panel'
                  >

                  </AtTabsPane>)
                )
              }
            </AtTabs>

            <ScrollView
              scrollY
              className='member-integral__scroll'
              onScrollToLower={this.nextPage}
            >
              {
                list.map((item, idx) => {
                  return (
                    <View key={idx}>
                      <View className='integral-item'>
                        <View className='integral-item__title'>
                          <Text className='integral-item__title-name'>{item.detail}</Text>
                          <Text className={`integral-item__title-${item.tradeType}`}>{item.tradeType === 'recharge' ? '+' : '-'}{item.money}</Text>
                        </View>
                        <View className='integral-item__data'>{item.timeStart}</View>
                      </View>
                    </View>
                  )
                })
              }
              {
                page.isLoading && <Loading>正在加载...</Loading>
              }
              {
                !page.isLoading && !page.hasNext && !list.length
                && (<SpNote className='integral_empty' img='trades_empty.png'>赶快去充值吧~</SpNote>)
              }
            </ScrollView>
          </View>
        </View>
      </View>
    )
  }
}
