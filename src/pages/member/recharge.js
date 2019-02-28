
import Taro, { Component } from '@tarojs/taro'
import {View, Text, ScrollView} from '@tarojs/components'
import { AtTabs, AtTabsPane} from 'taro-ui'
import { Loading, SpNote } from '@/components'
import { withPager } from '@/hocs'
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
        {title: '全部', status: 'All'},
        {title: '收入', status: 'INCOME'},
        {title: '支出', status: 'EXPEND'}
      ],
      list: [],
      isLoading: false,
      testIncome: false,
    }
  }

  componentDidMount () {
    const status = 'All'
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
      status: tabList[curTabIdx].status
    }
    const { list, total_count: total } = await api.trade.list(params)
    const nList = this.state.list.concat(list)

    this.setState({
      list: nList,
      isLoading: false
    })

    return { total }
  }

  handleClickTab = (idx) => {
    if (this.state.isLoading || this.state.page.isLoading) return

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
    const { curTabIdx, tabList, list, page, testIncome } = this.state

    return (
      <View className='page-member-integral'>
        <View className='member-integral__hd'>
          <View className='integral-info'>
            <View className='integral-number'>图标<Text className='integral-number__text'>1888</Text></View>
            <View className='integral-text'>账户可用余额</View>
          </View>
        </View>

        <View className='member-integral__bd'>
          <View className='integral-sec integral-info__status'>
            <Text className='integral-sec__horn'>喇叭</Text>
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
                          <Text className='integral-item__title-name'>支付</Text>
                          {
                            testIncome
                              ? <Text className='integral-item__title-income'>+1000</Text>
                              : <Text className='integral-item__title-pay'>-100</Text>
                          }
                        </View>
                        <View className='integral-item__data'>2018.11.11 12:00</View>
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
                && (<SpNote img='trades_empty.png'>赶快去充值吧~</SpNote>)
              }
            </ScrollView>
          </View>
        </View>
      </View>
    )
  }
}
