import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Navigator, Button } from '@tarojs/components'
import { AtBadge, AtIcon, AtAvatar } from 'taro-ui'
import { classNames, formatTime } from '@/utils'
import { connect } from '@tarojs/redux'
import { SpIconMenu, SpToast, TabBar} from '@/components'
import { withLogin } from '@/hocs'
import api from '@/api'
import S from '@/spx'

import './index.scss'

@connect(() => ({
}), (dispatch) => ({
  onFetchFavs: (favs) => dispatch({ type: 'member/favs', payload: favs })
}))
@withLogin()
export default class MemberIndex extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ordersCount: {
        normal_payed_daifahuo: '',
        normal_payed_daishouhuo: ''
      },
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
      isOpenPopularize: false
    }
  }

  navigateTo (url) {
    Taro.navigateTo({ url })
  }

  componentDidMount () {
    this.fetch()
  }

  async fetch () {
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
    const [res, { list: favs }] = await Promise.all([api.member.memberInfo(), api.member.favsList()])
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
      }
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

  handleClickGiftApp = () => {
    Taro.navigateToMiniProgram({
      appId: APP_GIFT_APPID,
      path: '/pages/index/index'
    })
  }

  beDistributor = async () => {
    const { isOpenPopularize, info } = this.state
    const { username, avatar, isPromoter } = info
    if ( isPromoter ) {
      Taro.navigateTo({
        url: '/pages/distribution/index'
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

  viewOrder = (type) => {
    Taro.navigateTo({
      url: `/pages/trade/list?status=${type}`
    })
  }

  viewAftersales = () => {
    Taro.navigateTo({
      url: `/pages/trade/after-sale`
    })
  }

  render () {
    const { ordersCount, info } = this.state
    let isAvatatImg
    if(info.avatar) {
      isAvatatImg = true
    }

    return (
      <View class="page-member-index">
        <ScrollView
          className="member__scroll"
          scrollY
        >
          <View className="user-info view-flex view-flex-middle view-flex-center">
            <View className="avatar">
              <Image className="avatar-img" src={info.avatar} mode="aspectFill"/>
              {
                (vipgrade.vip_type === 'vip' || vipgrade.vip_type === 'svip')
                && <Image className="icon-vip" src="/assets/imgs/svip.png" />
              }
            </View>
            <View>
              <View className="nickname">Hi, {info.username} {/*  <Text className="icon-qrcode"></Text> */}</View>
              {
                !vipgrade.is_vip
                ? <View className="gradename">{gradeInfo.grade_name}</View>
                : <View className="gradename">{vipgrade.grade_name}</View>
              }
            </View>
            {/* <View className="icon-arrowRight"></View> */}
          </View>
          {
            <View className="member-card {{vipgrade.is_open || !vipgrade.is_open && vipgrade.is_vip ? 'opened' : ''}}">
              {
                vipgrade.is_open && !vipgrade.is_vip
                && (
                  <Navigator url="/pages/vip/vipgrades" className="vip-btn">
                    <Text className="icon-crown"></Text> 开通VIP会员
                  </Navigator>
                )
              }
              {
                vipgrade.is_vip && (
                  <View className="view-flex grade-info">
                    <View className="member-no">NO.{gradeInfo.user_card_code}</View>
                    <View className="view-flex view-flex-middle content-v-padded">
                      <View>{vipgrade.end_date} 到期</View>
                      {
                        vipgrade.is_open && <Navigator url="/pages/vip/vipgrades" className="renewals-btn">续费</Navigator>
                      }
                    </View>
                    <View className="view-flex view-flex-middle vip-sign">
                      {
                        vipgrade.vip_type === 'svip' && (<Text className="icon-s"></Text>)
                      }
                      <Text className="icon-v"></Text>
                      <Text className="icon-i"></Text>
                      <Text className="icon-p"></Text>
                    </View>
                  </View>
                )
              }
              {
                vipgrade.is_vip && (<Image className="member-info-bg" src={vipgrade.background_pic_url} />)
              }
              {
                vipgrade.is_open && !vipgrade.is_vip && (<Image className="member-info-bg" src={gradeInfo.background_pic_url} />)
              }
            </View>
          }
          <View className="section section-card order-box">
            <View className="section-title no-foot-padded view-flex view-flex-middle">
              <View className="view-flex-item">我的订单</View>
              <View class="section-more" onClick={this.viewOrder.bind(this)}>全部订单 <Text className="forward-icon icon-arrowRight"></Text></View>
            </View>
            {
              /* <View className="list">
                <View className="list-item" onClick={this.viewOrder.bind(this, 4)}>
                  <View className="list-item-txt">
                    <View>自提订单</View>
                    <View className="text-muted">您有{orderCount.normal_payed_daiziti}个等待自提的订单</View>
                  </View>
                  <View className="icon-ziti"></View>
                  <View className="icon-arrowRight item-icon-go"></View>
                </View>
              </View> */
            }
            <View className="section-body">
              <View className="view-flex view-flex-justify">
                <View className="view-flex-item view-flex view-flex-vertical view-flex-middle" onClick={this.viewOrder.bind(this, 5)}>
                  <View className="icon-wallet">
                    {
                      orderCount.normal_notpay_notdelivery > 0 && (<View className="order-num" >{orderCount.normal_notpay_notdelivery}</View>)
                    }
                  </View>
                  <View>待支付</View>
                </View>
                <View className="order-item view-flex-item view-flex view-flex-vertical view-flex-middle" onClick={this.viewOrder.bind(this, 1)}>
                  <View className="icon-delivery">
                    {
                      orderCount.normal_payed_notdelivery > 0 && (<View className="order-num">{orderCount.normal_payed_notdelivery}</View>)
                    }
                  </View>
                  <View>待收货</View>
                </View>
                <View className="view-flex-item view-flex view-flex-vertical view-flex-middle" onClick={this.viewOrder.bind(this, 3)}>
                  <View className="icon-office-box">
                    {
                      orderCount.normal_payed_delivered > 0 && <View className="order-num">{orderCount.normal_payed_delivered}</View>
                    }
                  </View>
                  <View>已完成</View>
                </View>
                <View className="order-item view-flex-item view-flex view-flex-vertical view-flex-middle" onClick={this.viewAftersales.bind(this)}>
                  <View className="icon-repeat">
                    {
                      orderCount.aftersales > 0 && (<View className="order-num">{orderCount.aftersales}</View>)
                    }
                  </View>
                  <View>售后</View>
                </View>
              </View>
            </View>
          </View>
          <View className="section section-card">
						<View className="list">
  						<Navigator className="list-item" url="/pages/member/coupon">
  							<Image className="item-icon card-img" src="/assets/imgs/coupons.png" mode="aspectFit" />
  							<View className="list-item-txt">优惠券</View>
  							<View className="icon-arrowRight item-icon-go"></View>
  						</Navigator>
  						{
                isOpenPopularize &&
    							<View className="list-item" onClick={this.beDistributor.bind(this)}>
    								<Image className="item-icon card-img" src="/assets/imgs/store.png" mode="aspectFit" />
    								<View className="list-item-txt">{!info.isPromoter ? <Text>我要推广</Text> : <Text>推广管理</Text> }</View>
    								<View className="icon-arrowRight item-icon-go"></View>
    							</View>
              }
              <Navigator className="list-item" url="/pages/member/group-list">
  							<Image className="item-icon card-img" src="/assets/imgs/group.png" mode="aspectFit" />
  							<View className="list-item-txt">我的拼团</View>
  							<View className="icon-arrowRight item-icon-go"></View>
  						</Navigator>
              <Navigator className="list-item" url="/pages/member/item-fav">
                <View className="item-icon icon-faverite"></View>
                <View className="list-item-txt">我的收藏</View>
                <View className="icon-arrowRight item-icon-go"></View>
              </Navigator>
              <View className="list-item">
                <Button className="btn-share" open-type="share"></Button>
                <View className="item-icon icon-share"></View>
                <View className="list-item-txt">我要分享</View>
                <View className="icon-arrowRight item-icon-go"></View>
              </View>
              <Navigator className="list-item" url="/pages/member/address">
                <View className="item-icon icon-periscope"></View>
                <View className="list-item-txt">地址管理</View>
                <View className="icon-arrowRight item-icon-go"></View>
              </Navigator>
            </View>
          </View>
        </ScrollView>
        <TabBar
          current={5}
        />
      </View>
    )
  }
}
