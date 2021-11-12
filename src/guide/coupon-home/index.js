import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { Loading, SpNote, SpToast, CouponItem } from '@/components'
import { connect } from '@tarojs/redux'
import api from '@/api'
import S from '@/spx'
import { withPager } from '@/hocs'
import { pickBy, formatTime, styleNames, classNames, normalizeQuerys } from '@/utils'
import { Tracker } from '@/service'
import { BaTabBar, BaNavBar } from '@/guide/components'
import './coupon.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))
@withPager
export default class CouponHome extends Component {
  config = {
    navigationStyle: 'custom'
  }
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      list: [],
      shareInfo: {}
    }
  }

  async componentDidMount () {
    await S.autoLogin(this)
    this.nextPage()
    api.wx.shareSetting({ shareindex: 'coupon' }).then((res) => {
      this.setState({
        shareInfo: res
      })
    })
  }

  componentDidShow () {
    Taro.hideShareMenu({
      //禁用胶囊分享
      menus: ['shareAppMessage', 'shareTimeline']
    })
  }

  onShareAppMessage (item) {
    const { info = {} } = item.target.dataset
    const res = this.state.shareInfo
    // console.log('item.target.dataset',item)
    // console.log('info',info)
    // console.log('onShareAppMessage-item',res,info)
    // const { userId } = Taro.getStorageSync("userinfo");
    const params = this.$router.params

    const { salesperson_id, distributor_id, work_userid, shop_code } = S.get('GUIDE_INFO', true)
    const gu = `${work_userid}_${shop_code}`
    // const gu_user_id = Taro.getStorageSync("work_userid");
    const query = `?smid=${salesperson_id}&card_id=${
      info.card_id
    }&distributor_id=${distributor_id}&subtask_id=${params.subtask_id || ''}&gu=${gu}`
    console.log(`/others/pages/home/coupon-home${query}`)
    return {
      title: info.title + '优惠券',
      imageUrl: res.imageUrl,
      path: `/others/pages/home/coupon-home${query}`
    }
  }

  onShareTimeline () {
    const res = this.state.shareInfo
    const { userId } = Taro.getStorageSync('userinfo')
    const query = userId ? `uid=${userId}` : ''
    return {
      title: res.title,
      imageUrl: res.imageUrl,
      query: query
    }
  }

  async fetch (params) {
    let { distributor_id } = S.get('GUIDE_INFO', true)
    let { card_id = '' } = await normalizeQuerys(this.$router.params)
    params = {
      ...params,
      end_date: 1,
      distributor_id,
      card_id,
      item_id: this.$router.params
        ? this.$router.params.item_id
          ? this.$router.params.item_id
          : ''
        : ''
    }
    const {
      list,
      pagers: { total: total }
    } = await api.member.homeCouponList(params)
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
      card_id: 'card_id',
      description: 'description',
      use_bound: 'use_bound'
    })
    nList.map((item) => {
      if (item.get_limit - item.user_get_num <= 0) {
        item.getted = 1
      } else if (item.quantity - item.get_num <= 0) {
        item.getted = 2
      } else {
        item.getted = 0
      }
    })

    this.setState({
      list: [...this.state.list, ...nList]
    })

    return { total }
  }
  //分享该券
  handleClickNews = (card_item, idx) => {
    // let templeparams = {
    //   'temp_name': 'yykweishop',
    //   'source_type': 'coupon',
    // }
    // let _this = this
    // api.user.newWxaMsgTmpl(templeparams).then(tmlres => {
    //   console.log('templeparams---1', tmlres)
    //   if (tmlres.template_id && tmlres.template_id.length > 0) {
    //     wx.requestSubscribeMessage({
    //       tmplIds: tmlres.template_id,
    //       success() {
    //         _this.handleGetCard(card_item, idx)
    //       },
    //       fail() {
    //         _this.handleGetCard(card_item, idx)
    //       }
    //     })
    //   } else {
    //     _this.handleGetCard(card_item, idx)
    //   }
    // }, () => {
    //   _this.handleGetCard(card_item, idx)
    // })
  }

  handleGetCard = async (card_item, idx) => {
    const { list } = this.state

    if (list[idx].getted === 2 || list[idx].getted === 1) {
      return
    }
    console.log(card_item, 75)
    const query = {
      card_id: card_item.card_id ? card_item.card_id : card_item.$original.card_id
    }
    try {
      const data = await api.member.homeCouponGet(query)

      Tracker.dispatch('GET_COUPON', card_item)

      S.toast('优惠券领取成功')
      if (data.status) {
        if (data.status.total_lastget_num <= 0) {
          list[idx].getted = 2
        } else if (data.status.lastget_num <= 0) {
          list[idx].getted = 1
        }
        this.setState({
          list: list
        })
      }
    } catch (e) {}
  }

  render () {
    const { colors } = this.props
    const { list, page } = this.state
    const n_ht = S.get('navbar_height', true)
    return (
      <View className='coupon-list'>
        <BaNavBar title='优惠券列表' fixed />
        <ScrollView
          style={styleNames({ top: `${n_ht}px` })}
          scrollY
          className='home_coupon-list__scroll'
          onScrollToLower={this.nextPage}
        >
          <View className='coupon-list-ticket'>
            {list.map((item, idx) => {
              let count = `剩余${parseInt(item.quantity) - item.get_num}张`
              return (
                <CouponItem
                  info={item}
                  className='home_coupon-list_item'
                  key={item.card_id}
                  count={count}
                >
                  <View className='home_coupon-list_item__quantity'>
                    {/* 剩余{parseInt(item.quantity) - item.get_num}张 */}
                  </View>
                  {/* <Text
                      className={`coupon-btn ${(item.getted === 2 || item.getted === 1) ? 'coupon-btn__done' : ''}`}
                      onClick={this.handleGetCard.bind(this, item, idx)}
                    >
                      {item.getted === 1 ? '已领取' : ''}
                      {item.getted === 2 ? '已领完' : ''}
                      {(item.getted !== 2 && item.getted !== 1) ? '立即领取' : ''}
                    </Text> */}
                  {item.quantity * 1 > 0 && (
                    <View
                      className={`coupon-btn ${
                        item.getted === 2 || item.getted === 1 ? 'coupon-btn__done' : ''
                      }`}
                      // style={`background: ${colors.data[0].primary}`}
                      onClick={this.handleClickNews.bind(this, item, idx)}
                    >
                      <View className='recommend-detail__bar'>
                        <Button
                          openType='share'
                          dataInfo={item}
                          // style={"background: " + colors.data[0].primary}
                          className={classNames('shareCSS', {
                            disabled: parseInt(item.quantity) - item.get_num <= 0
                          })}
                          disabled={parseInt(item.quantity) - item.get_num <= 0}
                        >
                          分享给顾客
                        </Button>
                      </View>
                    </View>
                  )}
                </CouponItem>
              )
            })}
            {page.isLoading && <Loading>正在加载...</Loading>}
            {!page.isLoading && !page.hasNext && !list.length && (
              <SpNote img='trades_empty.png'>赶快去添加吧~</SpNote>
            )}
          </View>
        </ScrollView>
        <SpToast />
        <BaTabBar />
      </View>
    )
  }
}
