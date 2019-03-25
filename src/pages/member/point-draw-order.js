import Taro, { Component } from '@tarojs/taro'
import {View, ScrollView, Text, Image} from '@tarojs/components'
import { withPager, withBackToTop } from '@/hocs'
import { BackToTop, Loading, Price, NavBar, SpNote } from '@/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import api from '@/api'
import { pickBy } from '@/utils'

import './point-draw-order.scss'

@withPager
@withBackToTop
export default class PointDraw extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      curTabIdx: 0,
      tabList: [
        {title: '已参与', status: ''},
        {title: '已中奖', status: 'lucky'}
      ],
      list: [],
      listType: ''
    }
  }

  componentDidMount () {
    const tabIdx = this.state.tabList.findIndex(tab => tab.status === '')

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
    // const { page_no: page, page_size: pageSize } = params
    const { tabList, curTabIdx } = this.state
    params = {
      ...params,
      lucky_status: tabList[curTabIdx].status,
    }

    const { list, total_count: total } = await api.member.pointDrawPayList(params)

    const nList = pickBy(list, {
      img: 'item_pic',
      luckydraw_trade_id: 'luckydraw_trade_id',
      title: 'item_name',
      price: 'luckydraw_point',
      payment_status: 'payment_status',
      lucky_status: 'lucky_status',
    })
    nList.map(item => {
      if(item.payment_status === 'unpay') {
        item.payment_status = '未支付'
      } else if(item.payment_status === 'payed'){
        item.payment_status = '已支付'
      }else if(item.payment_status === 'readyrefund'){
        item.payment_status = '等待退款'
      } else {
        item.payment_status = '已退款'
      }
      if(item.lucky_status === 'lucky') {
        item.lucky_status = '中奖'
      }else if(item.lucky_status === 'unlukcy'){
        item.lucky_status = '未中奖'
      } else {
        item.lucky_status = '尚未开奖'
      }
    })
    this.setState({
      list: [...this.state.list, ...nList],
    })

    return {
      total
    }
  }

  handleClickItem = (item) => {
    console.log(item.luckydraw_trade_id)
    const url = `/pages/member/point-order-detail?id=${item.luckydraw_trade_id}`
    Taro.navigateTo({
      url
    })
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
    const { list, listType, showBackToTop, scrollTop, page, curTabIdx, tabList } = this.state

    return (
      <View className='page-draworeder-list'>
        <NavBar
          title='抽奖信息'
          leftIconType='chevron-left'
          fixed='true'
        />
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
          className='goods-order__scroll'
          scrollY
          scrollTop={scrollTop}
          scrollWithAnimation
          onScroll={this.handleScroll}
          onScrollToLower={this.nextPage}
        >
          <View className={`goods-list goods-list__type-${listType}`}>
            {
              list.map((item, index) => {
                return (
                  <View className='goods-item' key={index} onClick={this.handleClickItem.bind(this, item)}>
                    <View className='goods-item__bd'>
                      <View className='goods-item__img-wrap'>
                        <Image className='goods-item__img' mode='aspectFill' src={item.img} />
                      </View>
                      <View className='goods-item__cont'>
                        <Text className='goods-item__title'>{item.title}</Text>
                        <Text className='goods-item__desc'>{item.payment_status}</Text>
                        <View className='goods-item__prices'>
                          <Price
                            primary
                            classes='goods-item__price'
                            className='goods-item__price'
                            noSymbol
                            noDecimal
                            appendText='积分'
                            value={item.price}
                          />
                          <View className='lucky-info'>{item.lucky_status}</View>
                        </View>
                      </View>
                    </View>
                  </View>
                )
              })
            }
          </View>
          {
            page.isLoading
              ? <Loading>正在加载...</Loading>
              : null
          }
          {
            !page.isLoading && !page.hasNext && !list.length
            && (<SpNote img='trades_empty.png'>赶快去参与抽奖吧~</SpNote>)
          }
        </ScrollView>

        <BackToTop
          show={showBackToTop}
          onClick={this.scrollBackToTop}
        />
      </View>
    )
  }
}
