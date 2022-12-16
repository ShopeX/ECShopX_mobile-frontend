import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image, Navigator, Button, Canvas } from '@tarojs/components'
import { connect } from 'react-redux'
import { SpNavBar, Loading, SpPage, SpPoster } from '@/components'
import api from '@/api'
import { pickBy, canvasExp, classNames, isArray, getExtConfigData, isAlipay } from '@/utils'
import req from '@/api/req'
import S from '@/spx'
import './index.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))
export default class DistributionDashboard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      info: null,
      showPoster: false,
      poster: null,
      posterImgs: null,
      adapay_status: null
    }
  }

  componentDidMount() {
    const { colors } = this.props
    Taro.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: colors.data[0].marketing
    })
  }

  componentDidShow() {
    this.getAdapayInfo()
    this.fetch()
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
      taskBrokerageItemTotalFee: 'taskBrokerageItemTotalFee',
      pointTotal: 'pointTotal',
      taskBrokerageItemTotalPoint: 'taskBrokerageItemTotalPoint'
    })

    const promoter = await api.distribution.info()
    const pInfo = pickBy(promoter, {
      shop_name: 'shop_name',
      shop_pic: 'shop_pic',
      is_open_promoter_grade: 'is_open_promoter_grade',
      promoter_grade_name: 'promoter_grade_name',
      isOpenShop: 'isOpenShop',
      shop_status: 'shop_status',
      reason: 'reason',
      qrcode_bg_img: 'qrcode_bg_img',
      disabled: 'disabled'
    })
    const res2 = await api.member.hfpayUserApply()
    const userInfo = pickBy(res2, {
      applyStatus: 'status'
    })
    const res3 = await api.member.getIsHf()
    let isHf = res3.hfpay_version_status
    const info = { username, avatar, ...base, ...pInfo, ...userInfo, isHf }

    this.setState({ info })
  }

  async getAdapayInfo() {
    const { cert_status } = await api.distribution.adapayCert()
    let adapay_status = null
    if (isArray(cert_status)) {
      adapay_status = '未认证'
    } else if (cert_status.audit_state == 'A') {
      adapay_status = '审核中'
    } else if (
      cert_status.audit_state == 'B' ||
      cert_status.audit_state == 'C' ||
      cert_status.audit_state == 'D'
    ) {
      adapay_status = '认证失败'
    } else if (cert_status.audit_state == 'E') {
      adapay_status = '已认证'
    }
    this.setState({ adapay_status })
  }

  handleOpenApply() {
    Taro.showModal({
      title: '申请开店',
      content: '是否申请开启小店推广',
      cancelText: '取消',
      confirmText: '确定'
    }).then((res) => {
      if (res.confirm) {
        api.distribution.update({ shop_status: 2 }).then((res) => {
          if (res.status) {
            Taro.showToast({
              title: '申请成功等待审核',
              icon: 'none',
              duration: 2000
            }).then((res) => this.fetch())
          }
        })
      }
    })
  }

  onShareAppMessage() {
    const extConfig = wx.getExtConfigSync
      ? wx.getExtConfigSync()
      : { wxa_name: process.env.APP_MAP_NAME }
    const { userId } = Taro.getStorageSync('userinfo')
    const { info } = this.state
    return {
      title: extConfig.wxa_name,
      imageUrl: info.shop_pic,
      path: `/pages/index?uid=${userId}`
    }
  }

  handleClick = async () => {
    this.setState({
      showPoster: true
    })
  }

  render() {
    const { colors } = this.props
    const { info, showPoster, adapay_status } = this.state
    if (!info) {
      return <Loading />
    }
    return (
      <SpPage className='page-distribution-index'>
        <SpNavBar title='推广管理' leftIconType='chevron-left' />
        <View className='header' style={'background: ' + colors.data[0].marketing}>
          <View className='view-flex view-flex-middle'>
            <Image className='header-avatar' src={info.avatar || `${process.env.APP_IMAGE_CDN}/user_icon.png`} mode='aspectFill' />
            <View className='header-info view-flex-item'>
              {info.username}
              {info.is_open_promoter_grade && <Text>（{info.promoter_grade_name}）</Text>}
            </View>
            <Navigator
              className='view-flex view-flex-middle'
              url='/marketing/pages/distribution/setting'
            >
              <Text className='iconfont icon-info'></Text>
            </Navigator>
          </View>
          {info.isOpenShop && info.shop_status === 0 ? (
            <View className='mini-store-apply' onClick={this.handleOpenApply.bind(this)}>
              申请开启我的小店
            </View>
          ) : null}
          {info.isOpenShop && info.shop_status === 4 ? (
            <View>
              <View className='mini-store-apply' onClick={this.handleOpenApply.bind(this)}>
                审核驳回，再次申请开启小店
              </View>
              <View className='mini-store-reason'>驳回理由：{info.reason}</View>
            </View>
          ) : null}
          {info.isOpenShop && info.shop_status === 2 && (
            <View className='mini-store-apply'>申请开店审核中</View>
          )}
        </View>
        {info.applyStatus != 3 && info.isHf ? (
          <View className='bandCardInfo'>
            <View className='iconfont icon-info'></View>
            <View className='info'>
              <View className='title'>您还没实名认证</View>
              <View className='content'>未实名认证账号将无法收到分销佣金，请尽快实名认证</View>
            </View>
          </View>
        ) : null}
        <View className='section achievement'>
          <View className='section-body view-flex'>
            <View className='view-flex-item content-center'>
              <View className='amount'>
                <Text className='count'>{info.itemTotalPrice / 100}</Text>元
              </View>
              <View>营业额</View>
            </View>
            <View className='view-flex-item content-center'>
              <View className='amount'>
                <Text className='count'>{info.cashWithdrawalRebate / 100}</Text>元
              </View>
              <View>可提现</View>
            </View>
          </View>
        </View>
        <View className='section analysis'>
          <View className='section-body view-flex content-center'>
            <Navigator
              className='view-flex-item'
              hover-class='none'
              url='/marketing/pages/distribution/trade?type=order'
            >
              <View className='iconfont icon-list3 icon-fontsize' />
              <View className='label'>提成订单</View>
              <View>{info.promoter_order_count}</View>
            </Navigator>
            <Navigator
              className='view-flex-item'
              hover-class='none'
              url='/marketing/pages/distribution/trade?type=order_team'
            >
              <View className='iconfont icon-list2 icon-fontsize' />
              <View className='label'>津贴订单</View>
              <View>{info.promoter_grade_order_count}</View>
            </Navigator>
            <Navigator
              className='view-flex-item'
              hover-class='none'
              url='/marketing/pages/distribution/statistics'
            >
              <View className='iconfont icon-money icon-fontsize' />
              <View className='label'>推广费</View>
              <View className='mark'>{info.rebateTotal / 100}</View>
            </Navigator>
            <Navigator
              className='view-flex-item'
              hover-class='none'
              url='/marketing/pages/distribution/point-platform'
            >
              <View className='iconfont icon-jifen icon-fontsize' />
              <View className='label'>推广积分</View>
              <View className='mark'>{info.pointTotal || 0}</View>
            </Navigator>
          </View>
        </View>
        <View className='section'>
          <Navigator
            className='section-title with-border view-flex view-flex-middle'
            url={`/marketing/pages/distribution/subordinate?hasBuy=${info.isbuy_promoter}&noBuy=${info.notbuy_promoter}`}
          >
            <View className='view-flex-item'>我的会员</View>
            <View className='iconfont icon-arrowRight icon-right'></View>
          </Navigator>
          <View className='content-padded-b view-flex content-center member'>
            <View className='view-flex-item'>
              已购买会员 <Text className='mark'>{info.isbuy_promoter}</Text> 人
            </View>
            <View className='view-flex-item'>
              未购买会员 <Text className='mark'>{info.notbuy_promoter}</Text> 人
            </View>
          </View>
        </View>
        <View className='section list share'>
          {info.disabled == 0 && (
            <View className='list-item' onClick={this.handleClick}>
              <View className='iconfont icon-qrcode1 icon-fontsize' />
              <View className='list-item-txt'>我的二维码</View>
              <View className='iconfont icon-arrowRight icon-right' />
            </View>
          )}
          <Navigator
            className='list-item'
            open-type='navigateTo'
            url={`/marketing/pages/distribution/goods?status=${info.isOpenShop && info.shop_status === 1
              }`}
          >
            <View className='iconfont icon-weChat icon-fontsize' />
            <View className='list-item-txt'>推广商品</View>
            <View className='iconfont icon-arrowRight icon-right' />
          </Navigator>
          {info.isOpenShop && info.shop_status === 1 && (
            <Navigator
              className='list-item'
              open-type='navigateTo'
              url={`/marketing/pages/distribution/shop?turnover=${info.taskBrokerageItemTotalFee}&point=${info.taskBrokerageItemTotalPoint}&disabled=${info.disabled}`}
            >
              <View className='iconfont icon-shop icon-fontsize' />
              <View className='list-item-txt'>我的小店</View>
              <View className='iconfont icon-arrowRight icon-right' />
            </Navigator>
          )}
          {Taro.getEnv() !== 'WEB' && info.shop_status !== 1 && (
            <Button className='share-btn list-item' open-type='share'>
              <View className='iconfont icon-share1 icon-fontsize' />
              <View className='list-item-txt'>分享给好友</View>
              <View className='iconfont icon-arrowRight icon-right' />
            </Button>
          )}
          {info.isHf && (
            <Navigator
              className='list-item'
              open-type='navigateTo'
              url='/marketing/pages/verified-card/index'
            >
              <View className='iconfont item-icon icon-weChart' />
              <View className='list-item-txt'>实名认证以及绑卡</View>
              <View className='iconfont icon-arrowRight icon-right' />
            </Navigator>
          )}
          <Navigator
            className='list-item'
            open-type='navigateTo'
            url='/subpages/marketing/certification'
          >
            <View className='iconfont item-icon icon-shimingrenzheng' />
            <View className='list-item-txt'>实名认证</View>
            <View
              className={classNames(
                'cicle',
                (adapay_status == '审核中' && 'approve') ||
                (adapay_status == '未认证' && 'NotCertified') ||
                (adapay_status == '认证失败' && 'fail') ||
                (adapay_status == '已认证' && 'success')
              )}
            />
            <View style={{ marginRight: '15rpx' }}>{adapay_status}</View>
            <View className='iconfont icon-arrowRight icon-right' />
          </Navigator>
        </View>

        {/* {showPoster && (
          <View className='poster-modal'>
            <Image className='poster' src={poster} mode='aspectFit' />
            <View
              className='iconfont icon-download poster-save-btn'
              onClick={this.handleSavePoster.bind(this)}
            >
              保存图片
            </View>
            <View
              className='iconfont icon-close poster-close-btn'
              onClick={this.handleHidePoster.bind(this)}
            />
          </View>
        )} */}
        {showPoster && (
          <SpPoster
            info={info}
            type='distribution'
            onClose={() => {
              this.setState({
                showPoster: false
              })
            }}
          />
        )}
        {/* <Canvas className='canvas' canvas-id='myCanvas' width={canvasWidth}
        height={canvasHeight} id='myCanvas'></Canvas> */}
      </SpPage>
    )
  }
}
