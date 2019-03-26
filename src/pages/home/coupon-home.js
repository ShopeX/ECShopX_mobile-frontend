import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { Loading, SpNote, NavBar, SpToast } from '@/components'
import api from '@/api'
import S from '@/spx'
import { withPager } from '@/hocs'
import { classNames, pickBy, formatTime } from '@/utils'

import './coupon-home.scss'

@withPager
export default class CouponHome extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      list: []
    }
  }

  componentDidMount () {
    this.nextPage()
  }

  async fetch (params) {
    params = {
      ...params,
      end_date: 1
    }
    const { list, pagers: { total: total } } = await api.member.homeCouponList(params)
    const nList = pickBy(list, {
      status: 'status',
      reduce_cost: 'reduce_cost',
      least_cost: 'least_cost',
      begin_date: 'begin_date',
      end_date: ({ end_date }) => formatTime(end_date * 1000, 'YYYY-MM-DD HH:mm:ss'),
      fixed_term: 'fixed_term',
      card_type: 'card_type',
      tagClass: 'tagClass',
      title: 'title',
      discount: 'discount',
      get_limit: 'get_limit',
      user_get_num: 'user_get_num',
      quantity: 'quantity',
      get_num: 'get_num',
      card_id: 'card_id'
    })
    nList.map(item => {
      if(item.get_limit - item.user_get_num <= 0) {
        item.getted = 1
      } else if(item.quantity - item.get_num <= 0) {
        item.getted = 2
      }
    })

    this.setState({
      list: [...this.state.list, ...nList],
    })

    return { total }
  }

  handleGetCard = async (cardId, idx) => {
    const { list } = this.state
    const query = {
      card_id: cardId
    }
    try {
      const data = await api.member.homeCouponGet(query)
      S.toast('优惠券领取成功')
      if (data.status) {
        console.log(74 ,222)
        if (data.status.total_lastget_num <= 0 ) {
          list[idx].getted = 2
        } else if (data.status.lastget_num <= 0 ) {
          list[idx].getted = 1
        }
        this.setState({
          list
        })
      }
    } catch (e) {

    }

  }

  render () {
    const { list, page } = this.state

    return (
      <View className='coupon-list'>
        <NavBar
          title='优惠券列表'
          leftIconType='chevron-left'
          fixed='true'
        />

        <ScrollView
          scrollY
          className='home_coupon-list__scroll'
          onScrollToLower={this.nextPage}
        >
          <View className='coupon-list-ticket'>
            {
              list.map((item, idx) => {
                return (
                  <View className='coupon-item' key={idx}>
                    {
                      item.card_type === 'cash'
                        ? <View className={classNames('coupon-item__name', item.status === '2' ? 'coupon-item__name-not' : null)}>
                          <View className='coupon-item___number'>￥<Text className='coupon-item___number_text'>{item.reduce_cost/100}</Text></View>
                          <View className='coupon-item___info'>满{item.least_cost > 0 ? item.least_cost/100 : 0.01}可用</View>
                        </View>
                        : null
                    }
                    {
                      item.card_type === 'gift'
                        ? <View className={classNames('coupon-item__name', item.status === '2' ? 'coupon-item__name-not' : null)}>
                          <View className='coupon-item___number'>兑换券</View>
                        </View>
                        : null
                    }
                    {
                      item.card_type === 'discount'
                        ? <View className={classNames('coupon-item__name', item.status === '2' ? 'coupon-item__name-not' : null)}>
                          <View className='coupon-item___number'><Text className='coupon-item___number_text'>{(100-item.discount)/10}</Text>折</View>
                          <View className='coupon-item___info'>满{item.least_cost > 0 ? item.least_cost/100 : 0.01}可用</View>
                        </View>
                        : null
                    }
                    <View className='coupon-item__content'>
                      <View className='coupon-item___description'>
                        <Text>{item.title}</Text>
                        <View className='coupon-item___used'>
                          {
                            item.getted !== 1 && item.getted !== 2
                              ? <Text className='btn-receive' onClick={this.handleGetCard.bind(this, item.card_id, idx)}>立即领取</Text>
                              : null
                          }
                          {
                            item.getted === 1
                              ? <Text>已领取</Text>
                              : null
                          }
                          {
                            item.getted === 2
                              ? <Text>领完了</Text>
                              : null
                          }
                        </View>
                      </View>
                      {
                        item.end_date
                          ? <View className='coupon-item___time'>有效期至 <Text> {item.end_date}</Text></View>
                          : <View className='coupon-item___time'>有效期: 领取后<Text> {item.fixed_term}</Text>天有效 </View>
                      }
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
        <SpToast />
      </View>
    )
  }
}
