import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Navigator, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { NavBar } from '@/components'
import api from '@/api'
import { pickBy } from '@/utils'
import { Tracker } from "@/service";
import './index.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))

export default class DistributionDashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      info: {},
      
    }
  }
  config = {
    navigationBarTitleText: '推广管理'
  }
  componentDidMount () {   
    const { colors } = this.props
    Taro.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: colors.data[0].marketing
    })
    this.fetch()
  }

  handleOpenApply() {
    Taro.showModal({
      title: '申请开店',
      content: '是否申请开启小店推广',
      cancelText: '取消',
      confirmText: '确定'
    })
      .then(res => {
        if (res.confirm) {
          api.distribution.update({ shop_status: 2 }).then(res => {
            if (res.status) {
              Taro.showToast({
                title: '申请成功等待审核',
                icon: 'success',
                duration: 2000
              })
                .then(res => this.fetch())
            }
          })
        }
      })

  }

  onShareAppMessage() {
    const extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {}
    const { username, userId } = Taro.getStorageSync('userinfo')
    const { info } = this.state

    Tracker.dispatch("GOODS_SHARE_TO_CHANNEL_CLICK", {
      ...info,
      shareType: "分享给好友"
    });
    return {
      title: extConfig.wxa_name,
      imageUrl: info.shop_pic,
      path: `/pages/index?uid=${userId}`
    }
  }

  // onShareTimeline () {
  //   const extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {}
  //   const { userId } = Taro.getStorageSync('userinfo')
  //   const { info } = this.state

  //   return {
  //     title: extConfig.wxa_name,
  //     imageUrl: info.shop_pic,
  //     query: {
  //       uid: userId
  //     }
  //   }
  // }

  handleClick = () => {
    let { isOpenShop, shop_status } = this.state.info
    Taro.navigateTo({
      url: `/marketing/pages/distribution/qrcode?isOpenShop=${isOpenShop}&status=${shop_status === 1}`
    })
  }

  async fetch() {
    const resUser = Taro.getStorageSync('userinfo')
    const { username, avatar } = resUser

    const res = await api.distribution.dashboard()
    const base = pickBy(res, {
      itemTotalPrice: 'itemTotalPrice',
      cashWithdrawalRebate: 'cashWithdrawalRebate',
      promoter_order_count: 'promoter_order_count',
      promoter_grade_order_count: 'promoter_grade_order_count',
      rebateTotal: 'rebateTotal',
      isbuy_promoter: 'isbuy_promoter',
      notbuy_promoter: 'notbuy_promoter',
      taskBrokerageItemTotalFee: 'taskBrokerageItemTotalFee'
    })

    const promoter = await api.distribution.info()
    const pInfo = pickBy(promoter, {
      shop_name: 'shop_name',
      shop_pic: 'shop_pic',
      is_open_promoter_grade: 'is_open_promoter_grade',
      promoter_grade_name: 'promoter_grade_name',
      isOpenShop: 'isOpenShop',
      shop_status: 'shop_status',
      reason: 'reason'
    })
    const res2 = await api.member.hfpayUserApply()
        const userInfo = pickBy(res2, {
          applyStatus: 'status',
        })
    const info = {username, avatar, ...base, ...pInfo,...userInfo}

    this.setState({
      info
    })
  }

  render() {
    const { colors } = this.props
    const { info } = this.state

    return (
      <View className='page-distribution-index'>
        <NavBar
          title='推广管理'
          leftIconType='chevron-left'
        />	        
        <View className='header' style={'background: ' + colors.data[0].marketing}>
          <View className='view-flex view-flex-middle'>
            <Image
              className='header-avatar'
              src={info.avatar}
              mode='aspectFill'
            />
            <View className='header-info view-flex-item'>
              {info.username}
              {
                info.is_open_promoter_grade &&
                <Text>（{info.promoter_grade_name}）</Text>
              }
            </View>
            <Navigator className='view-flex view-flex-middle' url='/marketing/pages/distribution/setting'>
              <Text className='icon-info'></Text>
            </Navigator>
          </View>
          {
            info.isOpenShop === 'true' && info.shop_status === 0
              ? <View className='mini-store-apply' onClick={this.handleOpenApply.bind(this)}>申请开启我的小店</View>
              : null
          }
          {
            info.isOpenShop === 'true' && info.shop_status === 4
              ? <View>
                <View className='mini-store-apply' onClick={this.handleOpenApply.bind(this)}>审核驳回，再次申请开启小店</View>
                <View className='mini-store-reason'>驳回理由：{info.reason}</View>
              </View>
              : null
          }
          {
            info.isOpenShop === 'true' && info.shop_status === 2 &&
            <View className='mini-store-apply'>申请开店审核中</View>
          }
        </View>
        {info.applyStatus!=3?<View className='bandCardInfo'>
          <View className='iconfont icon-info'></View>
          <View className='info'>
            <View className='title'>您还没实名认证</View>
            <View className='content'>未实名认证账号将无法收到分销佣金，请尽快实名认证</View>
          </View>
        </View>:null}
        <View className='section achievement'>
          <View className='section-body view-flex'>
            <View className='view-flex-item content-center'>
              <View className='amount'><Text className='count'>{info.itemTotalPrice/100}</Text>元</View>
              <View>营业额</View>
            </View>
            <View className='view-flex-item content-center'>
              <View className='amount'><Text className='count'>{info.cashWithdrawalRebate/100}</Text>元</View>
              <View>可提现</View>
            </View>
          </View>
        </View>
        <View className='section analysis'>
          <View className='section-body view-flex content-center'>
            <Navigator className='view-flex-item' hover-class='none' url='/marketing/pages/distribution/trade?type=order'>
              <View className='icon-list3'></View>
              <View className='label'>提成订单</View>
              <View>{info.promoter_order_count}</View>
            </Navigator>
            <Navigator className='view-flex-item' hover-class='none' url='/marketing/pages/distribution/trade?type=order_team'>
              <View className='icon-list2'></View>
              <View className='label'>津贴订单</View>
              <View>{info.promoter_grade_order_count}</View>
            </Navigator>
            <Navigator className='view-flex-item' hover-class='none' url='/marketing/pages/distribution/statistics'>
              <View className='icon-money'></View>
              <View className='label'>推广费</View>
              <View className='mark'>{info.rebateTotal/100}</View>
            </Navigator>
          </View>
        </View>
        <View className='section'>
          <Navigator
            className='section-title with-border view-flex view-flex-middle'
            url={`/marketing/pages/distribution/subordinate?hasBuy=${info.isbuy_promoter}&noBuy=${info.notbuy_promoter}`}
          >
            <View className='view-flex-item'>我的会员</View>
            <View className='section-more icon-arrowRight'></View>
          </Navigator>
          <View className='content-padded-b view-flex content-center member'>
            <View className='view-flex-item'>已购买会员 <Text className='mark'>{info.isbuy_promoter}</Text> 人</View>
            <View className='view-flex-item'>未购买会员 <Text className='mark'>{info.notbuy_promoter}</Text> 人</View>
          </View>
        </View>
        <View className='section list share'>
          <View className='list-item' onClick={this.handleClick}>
            <View className='item-icon icon-qrcode1'></View>
            <View className='list-item-txt'>我的二维码</View>
            <View className='icon-arrowRight item-icon-go'></View>
          </View>
          <Navigator className='list-item' open-type='navigateTo' url={`/marketing/pages/distribution/goods?status=${info.isOpenShop === 'true' && info.shop_status === 1}`}>
            <View className='item-icon icon-weChart'></View>
            <View className='list-item-txt'>推广商品</View>
            <View className='icon-arrowRight item-icon-go'></View>
          </Navigator>
          {
            info.isOpenShop === 'true' && info.shop_status === 1 &&
              <Navigator className='list-item' open-type='navigateTo' url={`/marketing/pages/distribution/shop?turnover=${info.taskBrokerageItemTotalFee}`}>
                <View className='item-icon icon-shop'></View>
                <View className='list-item-txt'>我的小店</View>
                <View className='icon-arrowRight item-icon-go'></View>
              </Navigator>
          }
          {
            Taro.getEnv() !== 'WEB' && info.shop_status !== 1 &&
              <Button className='share-btn list-item' open-type='share'>
                <View className='item-icon icon-share1'></View>
                <View className='list-item-txt'>分享给好友</View>
                <View className='icon-arrowRight item-icon-go'></View>
              </Button>
          }
          <Navigator className='list-item' open-type='navigateTo' url={`/marketing/pages/verified-card/index`}>
            <View className='item-icon icon-weChart'></View>
            <View className='list-item-txt'>实名认证以及绑卡</View>
            <View className='icon-arrowRight item-icon-go'></View>
          </Navigator>
        </View>
      </View>
    )
  }
}
