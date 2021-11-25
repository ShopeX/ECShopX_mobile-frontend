import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, ScrollView } from '@tarojs/components'
import { Price, SpNavBar, SpCell, CouponModal } from '@/components'
import { connect } from '@tarojs/redux'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { getPaymentList } from '@/utils/payment'
import api from '@/api'
import S from '@/spx'
import {
  pickBy,
  classNames, showLoading,
  hideLoading,
  isAlipay,
  getPointName,
  isNavbar,
  redirectUrl
} from '@/utils'
import PaymentPicker from '@/pages/cart/comps/payment-picker'  
import userIcon from '@/assets/imgs/user-icon.png'

import './vipgrades.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))
export default class VipIndex extends Component {
  static config = {
    navigationBarTitleText: '会员购买',
    backgroundColor: '#2f3030',
    backgroundTextStyle: 'light'
  }
  constructor(props) {
    super(props)

    this.state = {
      typeList:[],
      userInfo: {},
      userVipInfo: {},
      curTabIdx: 0,
      curCellIdx: 0,
      tabList: [],
      list: [],
      cur: null,
      payType: '',
      isPaymentOpend: false,
      visible: false,
      total_count: 0,
      couponList: [], // 待领取券包列表
      all_card_list: [] // 放入券包弹框列表
    }
  }

  componentDidMount() {
    const { colors } = this.props
    Taro.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: colors.data[0].marketing
    })
    const userInfo = Taro.getStorageSync('userinfo')
    this.setState(
      {
        userInfo
      },
      () => {
        this.fetchInfo()
        this.fetchUserVipInfo()
      }
    )
  }
  // 获取支付方式
  async getPayList(){
    const { list }= await getPaymentList();  
    const res = list; 
    this.setState({
      typeList: res,
    })
  }
  async fetchInfo() {
    this.getPayList();
    const { cur, list } = await api.vip.getList()
    const { grade_name: name } = this.$router.params

    const tabList = pickBy(list, {
      title: ({ grade_name }) => grade_name,
      is_default: ({ is_default }) => is_default
    })

    const curTabIdx = tabList.findIndex((item) => item.title === name)

    this.setState(
      {
        tabList,
        cur,
        list,
        curTabIdx: curTabIdx === -1 ? 0 : curTabIdx
      },
      () => {
        this.onGetsBindCardList(list)
      }
    )
  }

  onGetsBindCardList(item) {
    const { curTabIdx } = this.state
    api.vip
      .getBindCardList({ type: 'vip_grade', grade_id: item[curTabIdx].vip_grade_id })
      .then((res) => {
        const { list, total_count } = res
        this.setState({ couponList: list, total_count })
      })
  }

  fetchCouponCardList() {
    api.vip.getShowCardPackage({ receive_type: 'vip_grade' }).then(({ all_card_list }) => {
      if (all_card_list && all_card_list.length > 0) {
        this.setState({ visible: true })
      }
      this.setState({ all_card_list })
    })
  }

  handleCouponChange = (visible, type) => {
    if (type === 'jump') {
      Taro.navigateTo({
        url: `/marketing/pages/member/coupon`
      })
    }
    this.setState({ visible })
  }

  handleClickTab = (idx) => {
    const { list } = this.state
    this.setState(
      {
        curTabIdx: idx
      },
      () => {
        this.onGetsBindCardList(list)
      }
    )
  }

  checkHandle = (index) => {
    this.setState({
      curCellIdx: index
    })
  }

  handleCharge=async ()=>{
  
    if (!S.getAuthToken()) {
      Taro.showToast({
        title: '请先登录再购买',
        icon: 'none'
      })

      setTimeout(() => {
        S.login(this)
      }, 2000)

      return
    }
    
    const { list, curTabIdx, curCellIdx, payType } = this.state
    
    const vip_grade = list[curTabIdx];

    const env = process.env.TARO_ENV;

    const params = {
      vip_grade_id: vip_grade.vip_grade_id,
      card_type: vip_grade.price_list[curCellIdx].name,
      distributor_id: Taro.getStorageSync('trackIdentity').distributor_id || '',
      pay_type: env==='h5'?'wxpayh5':payType
    } 
  
    showLoading({ mask: true })

    const data = await api.vip.charge(params)

    console.log("===data",data)

    hideLoading()  

    const order_id=data.trade_info.order_id;
 
    if (env === "h5") { 
      redirectUrl(api,`/subpage/pages/cashier/index?order_id=${order_id}&isMember=true`, 'navigateTo')
      return
		} 
 
    var config = data
    var that = this
    wx.requestPayment({
      timeStamp: '' + config.timeStamp,
      nonceStr: config.nonceStr,
      package: config.package,
      signType: config.signType,
      paySign: config.paySign,
      success: function(res) {
        wx.showModal({
          content: '支付成功',
          showCancel: false,
          success: function(res) {
            console.log('success')
            S.getMemberInfo()
            that.fetchCouponCardList()
          }
        })
      },
      fail: function(res) {
        wx.showModal({
          content: '支付失败',
          showCancel: false
        })
      }
    })
  }

  async fetchUserVipInfo() {
    const userVipInfo = await api.vip.getUserVipInfo()
    this.setState({
      userVipInfo
    })
  }

  handlePaymentShow = () => {
    this.setState({
      isPaymentOpend: true
    })
  }

  handleLayoutClose = () => {
    this.setState({
      isPaymentOpend: false
    })
  }

  handlePaymentChange = async (payType) => {
    this.setState(
      {
        payType,
        isPaymentOpend: false
      },
      () => {}
    )
  }

  handleCouponBox = () => {
    Taro.showToast({
      title: '开通会员，立享优惠',
      icon: 'none'
    })
  }

  render() {
    const { colors } = this.props
    let {
      userInfo,
      list,
      cur,
      curTabIdx,
      userVipInfo,
      tabList,
      curCellIdx,
      payType,
      isPaymentOpend,
      visible,
      couponList,
      all_card_list,
      total_count,
      typeList
    } = this.state
    console.log('typeList',typeList);
    // const payTypeText = {
    //   point: `${getPointName()}支付`,
    //   wxpay: process.env.TARO_ENV === 'weapp' ? '微信支付' : '现金支付',
    //   deposit: '余额支付',
    //   delivery: '货到付款',
    //   hfpay: '微信支付'
    // }
    return (
      <View
        className={classNames('page-vip-vipgrades', 'vipgrades', {
          'has-navbar': isNavbar()
        })}
      >
        <SpNavBar title='会员购买' leftIconType='chevron-left' fixed='true' />
        <View className='header' style={'background: ' + colors.data[0].marketing}>
          <View className='header-isauth'>
            <Image
              className='header-isauth__avatar'
              src={userInfo.avatar || userIcon}
              mode='aspectFill'
            />
            <View className='header-isauth__info'>
              <View className='nickname'>
                {userInfo.username}
                <Image className='icon-vip' src='/assets/imgs/svip.png' />
              </View>
              <View className='mcode'>
                {userVipInfo.grade_name
                  ? userVipInfo.grade_name + ' : 有效期至' + (userVipInfo.end_time || '')
                  : '暂未开通'}
              </View>
            </View>
          </View>
          <AtTabs
            className='header-tab'
            current={curTabIdx}
            tabList={tabList}
            onClick={this.handleClickTab}
          >
            {/* {tabList.map((panes, pIdx) => (
              <AtTabsPane current={curTabIdx} key={panes.title} index={pIdx}></AtTabsPane>
            ))} */}
          </AtTabs>
        </View>
        <View className='pay-box'>
          {cur && cur.rate && cur.rate != 1 && (
            <View className='text-muted'>
              <text className='icon-info'></text> 货币汇率：1{cur.title} = {cur.rate}RMB
            </View>
          )}
          <ScrollView scrollX className='grade-list'>
            {list[curTabIdx] &&
              list[curTabIdx].price_list.map((item, index) => {
                return (
                  item.price != 0 &&
                  item.price != null && (
                    <View
                      className={`grade-item ${index == curCellIdx && 'active'}`}
                      key={`${index}1`}
                      onClick={this.checkHandle.bind(this, index)}
                    >
                      <View className='item-content'>
                        <View className='desc weight'>
                          {(item.name === 'monthly' && '连续包月') ||
                            (item.name === 'quarter' && '连续包季') ||
                            (item.name === 'year' && '连续包年')}
                        </View>
                        <View className='desc'>{item.desc}</View>
                        <View className='amount'>
                          <Price primary value={Number(item.price)} />
                        </View>
                      </View>
                    </View>
                  )
                )
              })}
          </ScrollView>

          <PaymentPicker
            isOpened={isPaymentOpend}
            type={payType}
            isShowPoint={false}
            isShowBalance={false}
            isShowDelivery={false}
            // disabledPayment={disabledPayment}
            onClose={this.handleLayoutClose}
            onChange={this.handlePaymentChange}
          ></PaymentPicker>
          {!isAlipay && (
            <SpCell
              isLink
              border={false}
              title='支付方式'
              onClick={this.handlePaymentShow}
              className='cus-sp-cell'
            >
              {
                typeList.length > 0 && <Text>{typeList[0].pay_type_name}</Text>
              }
            </SpCell>
          )}
          <View className='pay-btn' onClick={this.handleCharge}>
            立即支付
          </View>
        </View>
        {couponList && couponList.length > 0 && (
          <View className='coupon-box' style={{ boxShadow: '0rpx 2rpx 16rpx 0rpx #DDDDDD' }}>
            <Text className='content-v-padded'>会员专享券包</Text>
            <Text className='content-v-subtitle'>优惠券共计{total_count}张</Text>
            <ScrollView scrollX className='scroll-box'>
              {couponList.map((items) => (
                <View
                  className='coupon'
                  key={items.card_id}
                  onClick={this.handleCouponBox.bind(this)}
                >
                  <Image className='img' src={`${process.env.APP_IMAGE_CDN}/coupon_bck.png`} />
                  {items.card_type === 'cash' && (
                    <View>
                      <View className='coupon-price'>
                        <Price primary value={items.reduce_cost / 100} noDecimal />
                      </View>
                      <View className='coupon-desc'>
                        满{items.least_cost > 0 ? items.least_cost / 100 : 0.01}可用
                      </View>
                      <View className='coupon-quan'>代金券</View>
                      <View className='coupon-mark'>
                        {items.get_num > 0 ? `x${items.get_num}` : null}
                      </View>
                    </View>
                  )}
                  {(items.card_type === 'gift' || items.card_type === 'new_gift') && (
                    <View>
                      <View className='coupon-price'>
                        <View className='coupon-font'>兑换券</View>
                      </View>
                      <View className='coupon-desc'>{items.description}</View>
                      <View className='coupon-quan'>兑换券</View>
                      <View className='coupon-mark'>
                        {items.get_num > 0 ? `x${items.get_num}` : null}
                      </View>
                    </View>
                  )}
                  {items.card_type === 'discount' && (
                    <View>
                      <View className='coupon-price'>
                        <Text className='coupon-font'>{(100 - items.discount) / 10}</Text>
                        <Text className='coupon-size'>折</Text>
                      </View>
                      <View className='coupon-desc'>
                        满{items.least_cost > 0 ? items.least_cost / 100 : 0.01}使用
                      </View>
                      <View className='coupon-quan'>折扣券</View>
                      <View className='coupon-mark'>
                        {items.get_num > 0 ? `x${items.get_num}` : null}
                      </View>
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        )}
        <View className='section' style={{ boxShadow: '0rpx 2rpx 16rpx 0rpx #DDDDDD' }}>
          <View className='section-body'>
            <View className='content-v-padded'>会员权益</View>
            <View className='text-muted'>
              {list[curTabIdx] &&
                list[curTabIdx].description &&
                list[curTabIdx].description.split('\n').map((item, index) => {
                  return <View key={`${index}1`}>{item}</View>
                })}
            </View>
          </View>
        </View>
        <CouponModal visible={visible} list={all_card_list} onChange={this.handleCouponChange} />
      </View>
    )
  }
}
