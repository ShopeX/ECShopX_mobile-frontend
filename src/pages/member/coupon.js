import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { Loading, SpNote } from '@/components'
import api from '@/api'
import { withPager } from '@/hocs'

import './coupon.scss'

@withPager
export default class Coupon extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      curTabIdx: 0,
      tabList: [
        {title: '可用', status: 'AVAIABLE'},
        {title: '不可用', status: 'NOT_AVAIABLE'}
      ],
      list: []
    }
  }

  componentDidMount () {
    const { status } = this.$router.params
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
    const { tabList, curTabIdx } = this.state
    params = {
      ...params,
      status: tabList[curTabIdx].status
    }
    const { list, total_count: total } = await api.trade.list(params)
    const nList = this.state.list.concat(list)

    this.setState({
      list: nList
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

    this.setState({
      curTabIdx: idx
    }, () => {
      this.nextPage()
    })
  }

  // handleClickItem () {
  //   // console.log(item)
  //   // const { tid } = item
  //   Taro.navigateTo({
  //     url: `/pages/member/coupon-item`
  //   })
  // }

  handleClickItemBtn = (type, trade) => {
    console.log(type, trade)
  }

  render () {
    const { curTabIdx, tabList, list, page } = this.state

    return (
      <View className='coupon-list'>
        <AtTabs
          className='coupon-list__tabs'
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
          className='coupon-list__scroll'
          onScrollToLower={this.nextPage}
        >
          <View className='coupon-list-ticket'>
            {
              list.map((item, idx) => {
                return (
                  <View className='coupon-item' key={idx}>
                    {/*<View className='coupon-item__name'>*/}
                      {/*<View className='coupon-item___number'>￥<Text className='coupon-item___number_text'>200</Text></View>*/}
                      {/*<View className='coupon-item___info'>抵用券</View>*/}
                    {/*</View>*/}
                    {/*<View className='coupon-item__content'>*/}
                      {/*<View className='coupon-item___description'>订单满308元使用（不含邮费）</View>*/}
                      {/*<View className='coupon-item___time'>使用期限 <Text>2017.01.03-2017.02.01 22222</Text></View>*/}
                    {/*</View>*/}
                    {/*{*/}
                      {/*item.card_type === 'cash'*/}
                        {/*? <View className='coupon-item__name coupon-item__name-not'>*/}
                            {/*<View className='coupon-item___number'>￥<Text className='coupon-item___number_text'>{item.reduce_cost/100}</Text></View>*/}
                            {/*<View className='coupon-item___info'>满0.01可用</View>*/}
                          {/*</View>*/}
                        {/*: null*/}
                    {/*}*/}

                    {/*{*/}
                      {/*item.card_type === 'gift'*/}
                        {/*? <View className='coupon-item__name coupon-item__name-not'>*/}
                            {/*<View className='coupon-item___number'>兑换券</View>*/}
                          {/*</View>*/}
                        {/*: null*/}
                    {/*}*/}

                    {/*{*/}
                      {/*item.card_type === 'discount'*/}
                        {/*? */}
                        {/*: null*/}
                    {/*}*/}

                    <View className='coupon-item__name coupon-item__name-not'>
                      <View className='coupon-item___number'><Text className='coupon-item___number_text'>{(100-item.discount)/10}</Text>折</View>
                      <View className='coupon-item___info'>抵用券</View>
                    </View>

                    <View className='coupon-item__content'>
                      <View className='coupon-item___description'>
                        <Text>{item.title}</Text>
                        <View className='coupon-item___used'>已使用</View>
                      </View>
                      <View className='coupon-item___time'>使用期限 <Text>{item.begin_date} ~ {item.end_date}</Text></View>
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
          </View>
        </ScrollView>
      </View>
    )
  }
}
