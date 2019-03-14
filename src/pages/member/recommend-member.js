import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { Loading, SpNote } from '@/components'
import api from '@/api'
import { withPager } from '@/hocs'
import { pickBy } from '@/utils'


import './recommend-member.scss'

@withPager
export default class RecommendOrder extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      curTabIdx: 0,
      tabList: [
        {title: '已购买', status: 'buy'},
        {title: '未购买', status: 'not_buy'}
      ],
      list: []
    }
  }

  componentDidMount () {
    const tabIdx = this.state.tabList.findIndex(tab => tab.status === 'buy')

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
    const { tabList, curTabIdx } = this.state
    params = {
      ...params,
      buy_type: tabList[curTabIdx].status,
    }
    const { list, total_count: total} = await api.member.recommendMember(params)
    const nList = pickBy(list, {
      username: 'username',
      bind_date: 'bind_date',
      promoter_grade_name: 'promoter_grade_name',
      mobile: 'mobile'
    })
    this.setState({
      list: [...this.state.list, ...nList],
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
    const { curTabIdx, tabList, list, page } = this.state

    return (
      <View className='trade-list'>
        <AtTabs
          className='trade-list__tabs'
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
              >
              </AtTabsPane>)
            )
          }
        </AtTabs>

        <ScrollView
          scrollY
          className='trade-list__scroll'
          onScrollToLower={this.nextPage}
        >
          {
            list.map((item, idx) => {
              return (
                <View key={idx}>
                  <View className='order-item'>
                    <View className='order-item__title'>
                      <Text className='order-item__title-name'>{item.username}<Text className='small-text'>({item.promoter_grade_name})</Text></Text>
                      <Text className='small-text'>绑定时间</Text>
                    </View>
                    <View className='order-item__title'>
                      <Text className='small-text'>{item.mobile}</Text>
                      <Text className='small-text'>{item.bind_date}</Text>
                    </View>
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
            && (<SpNote img='trades_empty.png'>赶快去添加吧~</SpNote>)
          }
        </ScrollView>
      </View>
    )
  }
}
