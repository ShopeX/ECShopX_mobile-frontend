import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Text, Image, Navigator, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { SpToast, TabBar, SpCell} from '@/components'
import api from '@/api'
import S from '@/spx'

import './index.scss'

@connect(() => ({
}), (dispatch) => ({
  onFetchFavs: (favs) => dispatch({ type: 'member/favs', payload: favs })
}))
export default class MemberIndex extends Component {
  config = {
    navigationBarTitleText: ''
  }

  constructor (props) {
    super(props)
    this.state = {
      info: {
        deposit: '',
        point: '',
        coupon: '',
        luckdraw: '',
        username: '',
        user_card_code: ''
      },
      vipgrade: {
        grade_name: '',
        end_date: '',
        is_vip: '',
        vip_type: '',
        is_open: '',
        background_pic_url: ''
      },
      gradeInfo: {
        user_card_code: '',
        grade_name: '',
        background_pic_url: ''
      },
      orderCount: '',
      memberDiscount: '',
      isOpenPopularize: false
    }
  }

  navigateTo (url) {
    Taro.navigateTo({ url })
  }

  componentDidMount () {
    Taro.setNavigationBarColor({
      backgroundColor: '#2f3030',
      frontColor: '#ffffff'
    })
    this.fetch()
  }

  async fetch () {
    if (!S.getAuthToken()) return

    let resUser = null
    if(Taro.getStorageSync('userinfo')){
      resUser = Taro.getStorageSync('userinfo')
      this.setState({
        info: {
          username: resUser.username,
          avatar: resUser.avatar,
          isPromoter: resUser.isPromoter
        }
      })
    }
    const [res, { list: favs }, orderCount, { list: memberDiscount }, assets] = await Promise.all([api.member.memberInfo(), api.member.favsList(), api.trade.getCount(), api.vip.getList(), api.member.memberAssets()])
    this.props.onFetchFavs(favs)
    this.setState({
      isOpenPopularize: res.is_open_popularize
    })
    const userObj = {
      username: res.memberInfo.username,
      avatar: res.memberInfo.avatar,
      userId: res.memberInfo.user_id,
      isPromoter: res.is_promoter
    }
    if(!resUser || resUser.username !== userObj.username || resUser.avatar !== userObj.avatar) {
      Taro.setStorageSync('userinfo', userObj)
      this.setState({
        info: {
          username: res.memberInfo.username,
          avatar: res.memberInfo.avatar,
          isPromoter: res.is_promoter
        }
      })
    }
    this.setState({
      vipgrade: {
        grade_name: res.vipgrade.grade_name,
        end_date: res.vipgrade.end_time,
        is_vip: res.vipgrade.is_vip,
        vip_type: res.vipgrade.vip_type,
        is_open: res.vipgrade.is_open,
        background_pic_url: res.vipgrade.background_pic_url
      },
      gradeInfo: {
        user_card_code: res.memberInfo.user_card_code,
        grade_name: res.memberInfo.gradeInfo.grade_name,
        background_pic_url: res.memberInfo.gradeInfo.background_pic_url
      },
      orderCount,
      memberDiscount: memberDiscount.length > 0 ? memberDiscount[memberDiscount.length-1].privileges.discount : '',
      memberAssets: assets
    })
  }

  handleClickRecommend = async () => {
    const { info } = this.state
    if (!info.is_open_popularize) {
      S.toast('未开启推广')
      return
    }

    if (info.is_open_popularize && !info.is_promoter) {
      await api.member.promoter()
    }

    Taro.navigateTo({
      url: '/pages/member/recommend'
    })
  }

  handleClick = (url) => {
    if (!S.getAuthToken()) {
      return S.toast('请先登录')
    }
    Taro.navigateTo({url})
  }

  beDistributor = async () => {
    const { info } = this.state
    const { username, avatar, isPromoter } = info
    if ( isPromoter ) {
      Taro.navigateTo({
        url: '/marketing/pages/distribution/index'
      })
      return
    }
    const { confirm } = await Taro.showModal({
      title: '邀请推广',
      content: '确定申请成为推广员？',
      showCancel: true,
      cancel: '取消',
      confirmText: '确认',
      confirmColor: '#0b4137'
    })
    if (!confirm) return

    const res = await api.distribution.become()
    const { status } = res
    if (status) {
      Taro.showModal({
        title: '恭喜',
        content: '已成为推广员',
        showCancel: false,
        confirmText: '好'
      })
      let userinfo = {
        username,
        avatar,
        isPromoter: true
      }
      console.log(userinfo)
      Taro.setStorageSync('userinfo', userinfo)
      this.setState({
        info: userinfo
      })
    }
  }

  handleTradeClick = (type) => {
    if (!S.getAuthToken()) {
      return S.toast('请先登录')
    }
    Taro.navigateTo({
      url: `/pages/trade/list?status=${type}`
    })
  }

  handleTradeDrugClick = () => {
    if (!S.getAuthToken()) {
      return S.toast('请先登录')
    }
    Taro.navigateTo({
      url: '/pages/trade/drug-list'
    })
  }

  handleLoginClick = () => {
    S.login(this, true)
  }

  viewAftersales = () => {
    if (!S.getAuthToken()) {
      return S.toast('请先登录')
    }
    Taro.navigateTo({
      url: `/pages/trade/after-sale`
    })
  }

  handleCodeClick = () => {
    Taro.navigateTo({
      url: `/pages/member/member-code`
    })
  }

  render () {
    const { vipgrade, gradeInfo, orderCount, memberDiscount, memberAssets, info, isOpenPopularize } = this.state

    return (
      <View className='page-member-index'>
        <ScrollView
          className='member__scroll'
          scrollY
        >
          {
            S.getAuthToken()
              ?
                <View className={`page-member-header ${memberDiscount === '' ? 'no-card' : ''}`}>
                  <View className='user-info'>
                    <View className='view-flex view-flex-middle'>
                      <View className='avatar'>
                        <Image className='avatar-img' src={info.avatar} mode='aspectFill' />
                      </View>
                      <View>
                        <View className='nickname'>Hi, {info.username}</View>
                        {
                          !vipgrade.is_vip
                          ? <View className='gradename'>{gradeInfo.grade_name}</View>
                          : <View className='gradename'>{vipgrade.grade_name}</View>
                        }
                      </View>
                    </View>
                    <View className='view-flex'>
                      <View className='icon-qrcode' onClick={this.handleCodeClick.bind(this)}></View>
                      {/*<View className='icon-setting' onClick={this.handleClick.bind(this, '/marketing/pages/member/user-info')}></View>*/}
                    </View>
                  </View>
                  <View className='member-assets view-flex'>
                    <View
                      className='view-flex-item'
                      onClick={this.handleClick.bind(this, '/pages/member/coupon')}
                    >
                      <View className='member-assets__label'>优惠券</View>
                      <View className='member-assets__value'>{memberAssets.discount_total_count}</View>
                    </View>
                    <View className='view-flex-item'>
                      <View className='member-assets__label'>积分</View>
                      <View className='member-assets__value'>{memberAssets.point_total_count}</View>
                    </View>
                    <View
                      className='view-flex-item'
                      onClick={this.handleClick.bind(this, '/pages/member/item-fav')}
                    >
                      <View className='member-assets__label'>收藏</View>
                      <View className='member-assets__value'>{memberAssets.fav_total_count}</View>
                    </View>
                  </View>
                </View>
              : <View className='page-member-header view-flex view-flex-vertical view-flex-middle view-flex-center' onClick={this.handleLoginClick.bind(this)}>
                  <View className='avatar-placeholder icon-member'></View>
                  <View className='unlogin'>请登录</View>
                </View>
            }
          {
            (vipgrade.is_open || !vipgrade.is_open && vipgrade.is_vip) && memberDiscount !== '' &&
              <View
                className='member-card'
                onClick={this.handleClick.bind(this, '/pages/vip/vipgrades')}
              >
                {
                  vipgrade.is_open && !vipgrade.is_vip
                  && <View className='vip-btn'>
                      <View className='vip-btn__title'>开通VIP会员 <Text className='icon-arrowRight'></Text></View>
                      {
                        memberDiscount &&
                          <View className='vip-btn__desc'>即可享受最高{memberDiscount}折会员优惠</View>
                      }
                    </View>
                }
                {
                  vipgrade.is_vip && (
                    <View className='grade-info'>
                        <View className='member-card-title'>
                          <Text className='vip-sign'>
                            {
                              vipgrade.vip_type === 'svip'
                                ? <Text>SVIP</Text>
                                : <Text>VIP</Text>
                            }
                          </Text>
                          会员卡
                        </View>
                        <View className='member-card-no'>NO. {gradeInfo.user_card_code}</View>
                        <View className='member-card-period'>
                          {vipgrade.end_date} 到期
                        </View>
                    </View>
                  )
                }
                {
                  vipgrade.is_vip && (<Image className='member-info-bg' src={vipgrade.background_pic_url} mode='widthFix' />)
                }
                {
                  vipgrade.is_open && !vipgrade.is_vip && (<Image className='member-info-bg' src={gradeInfo.background_pic_url} mode='widthFix' />)
                }
              </View>
          }
          <View className='page-member-section order-box'>
            <View className='section-title view-flex view-flex-middle'>
              <View className='view-flex-item'>订单</View>
              <View class='section-more' onClick={this.handleTradeClick.bind(this)}>全部订单<Text className='forward-icon icon-arrowRight'></Text></View>
            </View>
            {
              <View className="member-trade__ziti" onClick={this.handleTradeDrugClick.bind(this)}>
                <View className="view-flex-item" >
                  <View className='member-trade__ziti-title'>处方单</View>
                  <View className="member-trade__ziti-desc">您有<Text className='mark'>{orderCount.normal_payed_daiziti || 0}</Text>个等待自提的订单</View>
                </View>
                <View className="icon-arrowRight item-icon-go"></View>
              </View>
            }
            <View className='member-trade'>
              <View className='member-trade__item' onClick={this.handleTradeClick.bind(this, 5)}>
                <View className='icon-wallet'>
                  {
                    orderCount.normal_notpay_notdelivery > 0 && (<View className='trade-num' >{orderCount.normal_notpay_notdelivery}</View>)
                  }
                </View>
                <Text>待支付</Text>
              </View>
              <View className='member-trade__item' onClick={this.handleTradeClick.bind(this, 1)}>
                <View className='icon-delivery'>
                  {
                    orderCount.normal_payed_notdelivery > 0 && (<View className='trade-num'>{orderCount.normal_payed_notdelivery}</View>)
                  }
                </View>
                <Text>待收货</Text>
              </View>
              <View className='member-trade__item' onClick={this.handleTradeClick.bind(this, 3)}>
                <View className='icon-office-box'>
                  {
                    orderCount.normal_payed_delivered > 0 && <View className='trade-num'>{orderCount.normal_payed_delivered}</View>
                  }
                </View>
                <Text>已完成</Text>
              </View>
              <View className='member-trade__item' onClick={this.viewAftersales.bind(this)}>
                <View className='icon-repeat'>
                  {
                    orderCount.aftersales > 0 && (<View className='trade-num'>{orderCount.aftersales}</View>)
                  }
                </View>
                <Text>售后</Text>
              </View>
            </View>
          </View>
          {/*<View className="important-box view-flex">
            <View className="view-flex-item view-flex view-flex-vertical view-flex-middle" onClick={this.toPay.bind(this)}>
              <Image className="icon-img" src="/assets/imgs/buy.png" mode="aspectFit" />
              <View>买单</View>
            </View>
          </View>*/}
          <View className='page-member-section'>
            {
              isOpenPopularize &&
                <SpCell
                  title={!info.isPromoter ? '我要推广' : '推广管理'}
                  isLink
                  img='/assets/imgs/store.png'
                  onClick={this.beDistributor.bind(this)}
                >
                </SpCell>
            }
            <SpCell
              title='我的拼团'
              isLink
              img='/assets/imgs/group.png'
              onClick={this.handleClick.bind(this, '/pages/member/group-list')}
            >
            </SpCell>
            <SpCell
              title='活动预约'
              isLink
              img='/assets/imgs/buy.png'
              onClick={this.handleClick.bind(this, '/marketing/pages/member/item-activity')}
            >
            </SpCell>
          </View>
          <View className='page-member-section'>
            <SpCell
              title='我要分享'
              isLink
            >
              <Button className='btn-share' open-type='share'></Button>
            </SpCell>
            <SpCell
              title='地址管理'
              isLink
              onClick={this.handleClick.bind(this, '/pages/member/address')}
            >
            </SpCell>
          </View>
        </ScrollView>

        <SpToast />

        <TabBar />
      </View>
    )
  }
}
