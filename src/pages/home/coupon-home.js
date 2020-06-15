import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { Loading, SpNote, NavBar, SpToast, CouponItem } from '@/components'
import { connect } from '@tarojs/redux'
import api from '@/api'
import S from '@/spx'
import { withPager } from '@/hocs'
import { classNames, pickBy, formatTime } from '@/utils'

import '../home/coupon-home.scss'
@connect(({ colors }) => ({
  colors: colors.current
}))

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
    let { distributor_id } = this.$router.params

    params = {
      ...params,
      end_date: 1,
      distributor_id,
      item_id: this.$router.params ? (this.$router.params.item_id ? this.$router.params.item_id : '') : ''
    }
    const { list, pagers: { total: total } } = await api.member.homeCouponList(params)
    const nList = pickBy(list, {
      status: 'status',
      reduce_cost: 'reduce_cost',
      least_cost: 'least_cost',
      begin_date: ({ begin_date }) => formatTime(begin_date * 1000),
      end_date: ({ end_date }) => formatTime(end_date * 1000),
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
      } else {
        item.getted = 0
      }

    })

    this.setState({
      list: [...this.state.list, ...nList],
    })


    return { total }
  }

  handleClickNews = (card_item, idx) => {
    let templeparams = {
      'temp_name': 'yykweishop',
      'source_type': 'coupon',
    }
    let _this=this
    api.user.newWxaMsgTmpl(templeparams).then(tmlres => {
      console.log('templeparams---1', tmlres)
      if (tmlres.template_id && tmlres.template_id.length > 0) {
        wx.requestSubscribeMessage({
          tmplIds: tmlres.template_id,
          success() {
            _this.handleGetCard(card_item, idx)
          },
          fail(){
            _this.handleGetCard(card_item, idx)
          }
        })
      } else {
        _this.handleGetCard(card_item, idx)
      }
    },()=>{
      _this.handleGetCard(card_item, idx)
    })
  }


  handleGetCard = async (card_item, idx) => {
    const { list } = this.state

    if(list[idx].getted === 2 || list[idx].getted === 1) {
      return
    }
    console.log(card_item, 75)
    const query = {
      card_id: card_item.card_id ? card_item.card_id : card_item.$original.card_id
    }
    try {
      const data = await api.member.homeCouponGet(query)
      S.toast('优惠券领取成功')
      if (data.status) {
        if (data.status.total_lastget_num <= 0 ) {
          list[idx].getted = 2
        } else if (data.status.lastget_num <= 0 ) {
          list[idx].getted = 1
        }
        this.setState({
          list: list
        })
      }
    } catch (e) {

    }

  }

  render () {
    const { colors } = this.props
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
                  <CouponItem
                    info={item}
                    key={item.card_id}
                  >
                    {/* <Text
                      className={`coupon-btn ${(item.getted === 2 || item.getted === 1) ? 'coupon-btn__done' : ''}`}
                      onClick={this.handleGetCard.bind(this, item, idx)}
                    >
                      {item.getted === 1 ? '已领取' : ''}
                      {item.getted === 2 ? '已领完' : ''}
                      {(item.getted !== 2 && item.getted !== 1) ? '立即领取' : ''}
                    </Text> */}
                     <View
                       className={`coupon-btn ${(item.getted === 2 || item.getted === 1) ? 'coupon-btn__done' : ''}`}
                       style={`background: ${colors.data[0].primary}`}
                       onClick={this.handleClickNews.bind(this, item, idx)}
                     >
                      {item.getted === 1 ? '已领取' : ''}
                      {item.getted === 2 ? '已领完' : ''}
                      {(item.getted !== 2 && item.getted !== 1) ? '立即领取' : ''}
                    </View>
                  </CouponItem>
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
