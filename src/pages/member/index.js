import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Text, Image, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { SpToast, TabBar, SpCell,AccountOfficial} from '@/components'
// import ExclusiveCustomerService from './comps/exclusive-customer-service'
import api from '@/api'
import S from '@/spx'
import req from '@/api/req'
import MemberBanner from './comps/member-banner'

import './index.scss'

@connect(({ colors }) => ({
  colors: colors.current
}), (dispatch) => ({
  onFetchFavs: (favs) => dispatch({ type: 'member/favs', payload: favs })
}))
export default class MemberIndex extends Component {

  constructor (props) {
    super(props)
    this.state = {
      turntable_open: 0,
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
      memberBanner:[],
      redirectInfo:{},
      orderCount: '',
      memberDiscount: '',
      isOpenPopularize: false,
      salespersonData: null,
      memberAssets: {},
      // 是否开启储值
      rechargeStatus: true,
      // 菜单配置
      menuSetting: {
        activity: false,
        offline_order: false,
        boost_activity: false,
        boost_order: false,
        complaint: false,
        community_order: false,
        ext_info: false,
        group: false,
        member_code: false,
        recharge: false,
        ziti_order: false
      },
      imgUrl:''
    }
  }

  componentDidMount () {
    const { colors } = this.props
    Taro.setNavigationBarColor({
      backgroundColor: colors.data[0].marketing,
      frontColor: '#ffffff'
    })
    this.fetch()
    this.getWheel()
    this.fetchBanner()
    this.fetchRedirect()
    this.getDefaultImg()
  }

  componentDidShow () {
    if (S.getAuthToken()) {
      this.getSalesperson()
    }
    this.getSettingCenter()
  }

  async getDefaultImg(){
    const url = `/distributor/getDistributorInfo?distributor_id=0`
    const { logo }= await req.get(url)   
    this.setState({
      imgUrl:logo
    }) 
  }
  
  config = {
    navigationBarTitleText: ''
  }

  navigateTo (url) {
    Taro.navigateTo({ url })
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
          isPromoter: resUser.isPromoter,
          mobile: resUser.mobile,
          vip: resUser.vipgrade ? resUser.vipgrade.vip_type : ''
        }
      })
    }
    const [res, { list: favs }, orderCount, { list: memberDiscount }, assets] = await Promise.all([api.member.memberInfo(), api.member.favsList(), api.trade.getCount(), api.vip.getList(), api.member.memberAssets()])
    this.props.onFetchFavs(favs)
    this.setState({
      isOpenPopularize: res.is_open_popularize
    })
    const userObj = {
      username: res.memberInfo.nickname,
      avatar: res.memberInfo.avatar,
      userId: res.memberInfo.user_id,
      isPromoter: res.is_promoter,
      mobile: res.memberInfo.mobile,
      openid: res.memberInfo.open_id,
      vip: res.vipgrade ? res.vipgrade.vip_type : ''
    }
    if(!resUser || resUser.username !== userObj.username || resUser.avatar !== userObj.avatar) {
      Taro.setStorageSync('userinfo', userObj)
      this.setState({
        info: {
          username: res.memberInfo.nickname,
          avatar: res.memberInfo.avatar,
          mobile: res.memberInfo.mobile,
          isPromoter: res.is_promoter,
          openid: res.memberInfo.open_id,
          vip: res.vipgrade ? res.vipgrade.vip_type : ''
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
      rechargeStatus: res.is_recharge_status,
      orderCount,
      memberDiscount: memberDiscount.length > 0 ? memberDiscount[memberDiscount.length-1].privileges.discount_desc : '',
      memberAssets: {...assets, deposit: res.deposit}
    })
  }

// 获取banner
  async fetchBanner(){
    const url = `/pageparams/setting?template_name=yykweishop&version=v1.0.1&page_name=member_center_setting`
    const { list } = await req.get(url)
    this.setState({
      memberBanner:list
    })
  }

  // 获取积分个人信息跳转
  async fetchRedirect(){
    const url = `/pageparams/setting?template_name=yykweishop&version=v1.0.1&page_name=member_center_redirect_setting`
    const {list = []} = await req.get(url)
    if(list[0].params){
      this.setState({
        redirectInfo:list[0].params
      })
    }
    // this.setState({
    //   memberBanner:list
    // })
  }
    /**
   * 获取导购信息
   * */
  async getSalesperson() {
    let data = await api.member.getSalesperson()
    this.setState({
      salespersonData: Array.isArray(data) ? false : data
    })
  }

  // 转盘抽奖
  async getWheel() {
    if (!S.getAuthToken()) return false
    const data = await api.wheel.getTurntableconfig()
    this.setState({
      turntable_open: data.turntable_open
    })
    console.log('大转盘', data.turntable_open)
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
    // if (!S.getAuthToken()) {
    //   return S.toast('请先登录')
    // }
    Taro.navigateTo({url})
  }
  handleListClick =(e)=>{
    e.stopPropagation()
    Taro.navigateTo({
      url:'/pages/cart/espier-index?type=drug'
    })

  }
  handleTradePickClick = () => {
    if (!S.getAuthToken()) {
      return S.toast('请先登录')
    }
    Taro.navigateTo({
      url: '/subpage/pages/trade/customer-pickup-list'
    })

  }


  beDistributor = async () => {
    const { info } = this.state
    const { username, avatar, isPromoter, mobile, openid } = info
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
        mobile,
        isPromoter: true,
        openid,
        vip: info.vipgrade ? info.vipgrade.vip_type : '',
      }
      // console.log(userinfo)
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
      url: `/subpage/pages/trade/list?status=${type}`
    })
  }

  handleTradeDrugClick = () => {
    if (!S.getAuthToken()) {
      return S.toast('请先登录')
    }
    Taro.navigateTo({
      url: '/subpage/pages/trade/drug-list'
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
      url: `/subpage/pages/trade/after-sale`
    })
  }

  handleCodeClick = () => {
    Taro.navigateTo({
      url: `/marketing/pages/member/member-code`
    })
  }
  handleOfficialError=()=>{
    
  }
  handleOfficialClose =()=>{
  }
  handleClickPoint=()=>{
    const { redirectInfo } = this.state
    if(redirectInfo.data && redirectInfo.data.point_url_is_open){
      Taro.navigateToMiniProgram({
        appId: redirectInfo.data.point_app_id,
        path: redirectInfo.data.point_page,
      })
    }
  }
  handleClickInfo=()=>{
    const { redirectInfo } = this.state
    if(redirectInfo.data && redirectInfo.data.info_url_is_open){
      Taro.navigateToMiniProgram({
        appId: redirectInfo.data.info_app_id,
        path: redirectInfo.data.info_page,
      })
    } else {
      this.handleClick('/marketing/pages/member/userinfo')
    }
  }

  // 获取个人中心配置
  getSettingCenter = async () => {
    const { list = [] } = await api.member.getSettingCenter()
    if (list[0] && list[0].params && list[0].params.data) {      
      this.setState({
        menuSetting: list[0].params.data
      })
    }
  }

  async onShareAppMessage () { 

    const url = `/memberCenterShare/getInfo`
    const {share_title,share_pic_wechatapp,share_description}= await req.get(url) 
 
    return {
      title: share_title?share_title:'震惊！这店绝了！',
      imageUrl: share_pic_wechatapp?share_pic_wechatapp:this.state.imgUrl,
      path:'/pages/index'
    }    
  }

  render () {
    const { colors } = this.props
    const { vipgrade, gradeInfo, orderCount, memberDiscount, memberAssets, info, isOpenPopularize, salespersonData, turntable_open,memberBanner, menuSetting, rechargeStatus } = this.state
    const is_open_official_account = Taro.getStorageSync('isOpenOfficial')
    const bannerInfo = memberBanner.length ? memberBanner[0].params : null
    return (
      <View className='page-member-index'>
        <ScrollView
          className='member__scroll'
          scrollY
        >
          {
            S.getAuthToken()
              ?
                <View className={`page-member-header ${memberDiscount === '' ? 'no-card' : ''}`} style={'background: ' + colors.data[0].marketing}>
                  <View className='user-info'>
                    <View className='view-flex view-flex-middle' onClick={this.handleClickInfo}>
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
                    {
                      menuSetting.member_code && <View className='view-flex'>
                        <View className='icon-qrcode' onClick={this.handleCodeClick.bind(this)}></View>
                        {/*<View className='icon-setting' onClick={this.handleClick.bind(this, '/marketing/pages/member/user-info')}></View>*/}
                      </View>
                    }
                  </View>
                  <View className='member-assets view-flex'>
                    <View
                      className='view-flex-item'
                      onClick={this.handleClick.bind(this, '/marketing/pages/member/coupon')}
                    >
                      <View className='member-assets__label'>优惠券</View>
                      <View className='member-assets__value'>{memberAssets.discount_total_count}</View>
                    </View>
                    <View className='view-flex-item' onClick={this.handleClickPoint}>
                      <View className='member-assets__label'>积分</View>
                      <View className='member-assets__value'>{memberAssets.point_total_count}</View>
                    </View>
                    {
                      rechargeStatus && <View
                        className='view-flex-item'
                        onClick={this.handleClick.bind(this, `/others/pages/recharge/index`)}
                      >
                        <View className='member-assets__label'>储值</View>
                        <View className='member-assets__value'>{(memberAssets.deposit || 0) / 100}</View>
                      </View>
                    }               
                    <View
                      className='view-flex-item'
                      onClick={this.handleClick.bind(this, '/pages/member/item-fav')}
                    >
                      <View className='member-assets__label'>收藏</View>
                      <View className='member-assets__value'>{memberAssets.fav_total_count}</View>
                    </View>
                  </View>
                </View>
                : <View
                  className='page-member-header view-flex view-flex-vertical view-flex-middle view-flex-center'
                  style={'background: ' + colors.data[0].marketing}
                  onClick={this.handleLoginClick.bind(this)}
                >
                  <View className='avatar-placeholder icon-member'></View>
                  <View className='unlogin' style={'background: ' + colors.data[0].primary}>请登录</View>
                </View>
            }
          {
            (vipgrade.is_open || !vipgrade.is_open && vipgrade.is_vip) && memberDiscount !== '' &&
              <View
                className='member-card'
                onClick={this.handleClick.bind(this, '/subpage/pages/vip/vipgrades')}
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
          {
            is_open_official_account === 1 && (
              <View className='page-member-section'>
              <AccountOfficial
                  onHandleError={this.handleOfficialError.bind(this)}
                  onClick={this.handleOfficialClose.bind(this)}
                  isClose={false}
              />
            </View>
            )
          }
        
          <View className='page-member-section order-box'>
            <View className='section-title view-flex view-flex-middle'>
              <View className='view-flex-item'>订单</View>
              <View class='section-more' onClick={this.handleTradeClick.bind(this)}>全部订单<Text className='forward-icon icon-arrowRight'></Text></View>
            </View>
            {/* <View className="member-trade__ziti" onClick={this.handleTradeDrugClick.bind(this)}>
              <View className="view-flex-item" >
                <View className='member-trade__ziti-title'>处方单</View>
              </View>
              <View className="icon-arrowRight item-icon-go"></View>
            </View>
            <View className="member-trade__ziti" onClick={this.handleListClick.bind(this)}>
              <View className="view-flex-item" >
                <View className='member-trade__ziti-title'>药品清单</View>
              </View>
              <View className="icon-arrowRight item-icon-go"></View>
            </View> */}
            {
              menuSetting.ziti_order && <View className='member-trade__ziti' onClick={this.handleTradePickClick.bind(this)}>
                <View className='view-flex-item'>
                  <View className='member-trade__ziti-title'>自提订单</View>
                  <View className='member-trade__ziti-desc'>您有<Text className='mark'>{orderCount.normal_payed_daiziti || 0}</Text>个等待自提的订单</View>
                </View>
                <View className='icon-arrowRight item-icon-go'></View>
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
              {
                orderCount.rate_status && <View className='member-trade__item' onClick={this.handleTradeClick.bind(this, 3)}>
                  <View className='icon-message'></View>
                  <Text className='trade-status'>待评价</Text>
                </View>
              }
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
          {/*
            salespersonData && salespersonData.is_show == 1 ?
              <ExclusiveCustomerService info={salespersonData} />
              : null
          */}
          {
            bannerInfo && bannerInfo.data.is_show && (
              <View className="page-member-section">
                <MemberBanner
                  info={bannerInfo.data}
                />
              </View>
            )
          }

          <View className='page-member-section'>
            {
              isOpenPopularize &&
                <SpCell
                  title={!info.isPromoter ? '我要推广' : '推广管理'}
                  isLink
                  img={require('../../assets/imgs/store.png')}
                  onClick={this.beDistributor.bind(this)}
                >
                </SpCell>
            }
            {
              Taro.getEnv() !== 'WEB' && <View>
                {
                  menuSetting.group && <SpCell
                    title='我的拼团'
                    isLink
                    img={require('../../assets/imgs/group.png')}
                    onClick={this.handleClick.bind(this, '/marketing/pages/member/group-list')}
                  >
                  </SpCell>
                }
                {
                  menuSetting.community_order && <SpCell
                    title='我的社区团购'
                    isLink
                    img={require('../../assets/imgs/group.png')}
                    onClick={this.handleClick.bind(this, '/groupBy/pages/orderList/index')}
                  >
                  </SpCell>
                }
              </View>
              
            }
            {
              Taro.getEnv() !== 'WEB' && <View>
                {
                  menuSetting.boost_activity && <SpCell
                    title='助力活动'
                    isLink
                    img={require('../../assets/imgs/group.png')}
                    onClick={this.handleClick.bind(this, '/boost/pages/home/index')}
                  >
                  </SpCell>
                }
                {
                  menuSetting.boost_order && <SpCell
                    title='助力订单'
                    isLink
                    img={require('../../assets/imgs/group.png')}
                    onClick={this.handleClick.bind(this, '/boost/pages/order/index')}
                  >
                  </SpCell>
                }
              </View>
            }
            {
              menuSetting.offline_order && <SpCell
                title='线下订单关联'
                isLink
                img={require('../../assets/imgs/group.png')}
                onClick={this.handleClick.bind(this, '/others/pages/bindOrder/index')}
              >
              </SpCell>
            }            
            {
              (menuSetting.complaint && salespersonData && salespersonData.distributor )&& <SpCell
                title='投诉记录'
                isLink
                img={require('../../assets/imgs/group.png')}
                onClick={this.handleClick.bind(this, '/marketing/pages/member/complaint-record')}
              >
              </SpCell>
            }
            {
              menuSetting.activity && <SpCell
                title='活动预约'
                isLink
                img={require('../../assets/imgs/buy.png')}
                onClick={this.handleClick.bind(this, '/marketing/pages/member/item-activity')}
              >
              </SpCell>
            } 
            {/* {
              menuSetting.activity && <SpCell
                title='活动预约'
                isLink
                img={require('../../assets/imgs/buy.png')}
                onClick={this.handleClick.bind(this, '/marketing/pages/member/coupon')}
              >
              </SpCell>
            }  */}
            {/* <SpCell
              title='入驻申请'
              isLink
              img='/assets/imgs/buy.png'
              onClick={this.handleClick.bind(this, '/subpage/pages/auth/store-reg')}
            >
            </SpCell>*/}

          </View>
          <View className='page-member-section'>
            {
              Taro.getEnv() !== 'WEB' && <SpCell
                title='我要分享'
                isLink
              >
              <Button className='btn-share' open-type='share'></Button>
            </SpCell>
            }
            <SpCell
              title='地址管理'
              isLink
              onClick={this.handleClick.bind(this, '/marketing/pages/member/address')}
            >
            </SpCell>
            <SpCell
              title='个人信息'
              isLink
              onClick={this.handleClickInfo.bind(this)}
            >
            </SpCell>
            {
              process.env.TARO_ENV === 'h5' &&
              <SpCell
                title='设置'
                isLink
                onClick={this.handleClick.bind(this, '/marketing/pages/member/setting')}
              >
              </SpCell>
            }            
          </View>
          {
            turntable_open === '1' ?
              <View className='wheel-to' onClick={this.handleClick.bind(this, '/marketing/pages/wheel/index')} >
                <Image src='/assets/imgs/wheel_modal_icon.png' />
              </View> : null
          }
        </ScrollView>
        <SpToast />

        <TabBar />
      </View>
    )
  }
}
