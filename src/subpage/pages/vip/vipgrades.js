/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Image, Text, ScrollView } from '@tarojs/components'
import { SpPrice, SpNavBar, SpCell, SpPage, SpCouponPackage } from '@/components'
import { CouponModal } from '@/subpages/components'
import { connect } from 'react-redux'
import { AtTabs, AtTabsPane } from 'taro-ui'
import api from '@/api'
import S from '@/spx'
import {
  pickBy,
  classNames,
  hideLoading,
  isAlipay,
  isNavbar,
  redirectUrl,
  requestAlipayminiPayment
} from '@/utils'
import CompPaymentPicker from '@/pages/cart/comps/comp-paymentpicker'
import { $t, ti, i18n } from '@/i18n'
import userIcon from '@/assets/imgs/user-icon.png'
// import { useDispatch } from 'react-redux'
import './vipgrades.scss'
// import { updateUserInfo } from '@/store/slices/user'
// const dispatch = useDispatch()

@connect(
  ({ colors, sys }) => ({
    colors: colors.current,
    pointName: sys.pointName
  }),
  (dispatch) => ({
    onFetchUser: (favs) => dispatch({ type: 'user', payload: favs })
  })
)
export default class VipIndex extends Component {
  $instance = getCurrentInstance() || {}
  constructor(props) {
    super(props)

    this.state = {
      userInfo: {},
      userVipInfo: {},
      curTabIdx: 0,
      curCellIdx: 0,
      tabList: [],
      list: [],
      cur: null,
      payType: '',
      payChannel: '',
      isPaymentOpend: false,
      visible: false,
      total_count: 0,
      couponList: [], // 待领取券包列表
      all_card_list: [] // 放入券包弹框列表
    }
  }

  syncVipNavTitle = () => {
    Taro.setNavigationBarTitle({ title: $t('39e52289.9f0635') })
  }

  componentDidMount() {
    this.syncVipNavTitle()
    i18n.on('languageChanged', this.syncVipNavTitle)
    console.log(S.getAuthToken())
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

  componentWillUnmount() {
    i18n.off('languageChanged', this.syncVipNavTitle)
  }

  async fetchInfo() {
    const { cur, list } = await api.vip.getList()
    const { grade_name: name } = this.$instance?.router?.params

    const tabList = pickBy(list, {
      title: ({ grade_name }) => grade_name,
      is_default: ({ is_default }) => is_default
    })
    console.log('==============', tabList)
    let curTabIdx
    if (name) {
      curTabIdx = tabList.findIndex((item) => item.title === name)
    } else {
      curTabIdx = tabList.findIndex((item) => item.is_default)
    }
    //

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
      .getBindCardList({
        type: 'vip_grade',
        grade_id: item[curTabIdx]?.vip_grade_id
      })
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
        url: `/subpages/marketing/coupon`
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

  handleCharge = async () => {
    if (!S.getAuthToken()) {
      Taro.showToast({
        title: $t('20d574cd.d9b8b5'),
        icon: 'none'
      })

      setTimeout(() => {
        S?.login(this)
      }, 2000)

      return
    }

    const { list, curTabIdx, curCellIdx, payType, payChannel } = this.state

    const vip_grade = list[curTabIdx]

    const env = process.env.TARO_ENV

    const params = {
      vip_grade_id: vip_grade?.vip_grade_id,
      card_type: vip_grade.price_list[curCellIdx].name,
      distributor_id: Taro.getStorageSync('trackIdentity').distributor_id || '',
      pay_type: env === 'h5' ? 'wxpayh5' : payType,
      pay_channel: payChannel
    }

    Taro.showLoading({ title: '' })

    const data = await api.vip.charge(params)

    console.log('===data', data)

    Taro.hideLoading()

    const order_id = data.trade_info.order_id
    if (env === 'h5') {
      redirectUrl(
        api,
        `/subpage/pages/cashier/index?order_id=${order_id}&isMember=true`,
        'navigateTo'
      )
      return
    }

    // 支付宝支付
    if (isAlipay) {
      try {
        const { memo } = await requestAlipayminiPayment(data.trade_no)
        if (memo) {
          Taro.showToast({
            title: memo,
            icon: 'none'
          })
        }
        S?.getMemberInfo()
        this.setState({ visible: true })
      } catch (e) {
        Taro.showToast({
          title: $t('16726e8e.4548cc'),
          icon: 'none'
        })
        console.log('error==>', e)
      }
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
      success: function (res) {
        wx.showModal({
          content: $t('16726e8e.eb5dc9'),
          showCancel: false,
          success: function (res) {
            console.log('success')
            S?.getMemberInfo()
            // that.fetchCouponCardList()
            that.setState({ visible: true })
            // Taro.navigateBack()
          }
        })
      },
      fail: function (res) {
        wx.showModal({
          content: $t('16726e8e.4548cc'),
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

  handlePaymentChange = async (payType, payChannel) => {
    this.setState(
      {
        payType,
        payChannel,
        isPaymentOpend: false
      },
      () => {}
    )
  }

  initDefaultPaytype = (payType, payChannel) => {
    this.setState({
      payChannel,
      payType
    })
  }

  handleCouponBox = () => {
    Taro.showToast({
      title: $t('a1dacd5f.528424'),
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
      total_count
    } = this.state
    const payTypeText = {
      point: ti('349e8d9f.717604', [this.props.pointName]),
      wxpay: process.env.TARO_ENV === 'weapp' ? $t('175b20c3.bffe28') : $t('36c99ee5.330ef6'),
      deposit: $t('349e8d9f.89ac23'),
      delivery: $t('349e8d9f.2d2ccd'),
      hfpay: $t('175b20c3.bffe28'),
      adapay: $t('175b20c3.bffe28'),
      alipaymini: $t('36c99ee5.e3b206')
    }
    return (
      <SpPage>
        <View
          className={classNames('page-vip-vipgrades', 'vipgrades', {
            'has-navbar': isNavbar()
          })}
        >
          <SpNavBar title={$t('39e52289.9f0635')} leftIconType='chevron-left' fixed='true' />
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
                    ? ti('a1dacd5f.90bf57', [userVipInfo.grade_name, userVipInfo.end_time || ''])
                    : $t('a1dacd5f.3e8bdd')}
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
                <text className='icon-info'></text> {ti('a1dacd5f.6d6eee', [cur.title, cur.rate])}
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
                            {item.name === 'monthly'
                              ? $t('a1dacd5f.fcafce')
                              : item.name === 'quarter'
                              ? $t('a1dacd5f.dcace5')
                              : item.name === 'year'
                              ? $t('a1dacd5f.1858b5')
                              : ''}
                          </View>
                          <View className='desc'>{item.desc}</View>
                          <View className='amount'>
                            <SpPrice primary value={Number(item.price)} />
                          </View>
                        </View>
                      </View>
                    )
                  )
                })}
            </ScrollView>

            <CompPaymentPicker
              isOpened={isPaymentOpend}
              type={payType}
              title={$t('250b375e.0c9d2b')}
              isPointitemGood={false}
              isShowBalance={false}
              isShowDelivery={false}
              // disabledPayment={disabledPayment}
              onClose={this.handleLayoutClose}
              onChange={this.handlePaymentChange}
              onInitDefaultPayType={this.initDefaultPaytype}
            />

            <SpCell
              isLink
              border={false}
              title={$t('250b375e.0c9d2b')}
              onClick={this.handlePaymentShow}
              className='cus-sp-cell'
            >
              <Text>{payTypeText[payType]}</Text>
            </SpCell>

            <View className='pay-btn' onClick={this.handleCharge}>
              {$t('16726e8e.747349')}
            </View>
          </View>
          {couponList && couponList.length > 0 && (
            <View className='coupon-box' style={{ boxShadow: '0rpx 2rpx 16rpx 0rpx #DDDDDD' }}>
              <Text className='content-v-padded'>{$t('a1dacd5f.0bf734')}</Text>
              <Text className='content-v-subtitle'>{ti('a1dacd5f.efa668', [total_count])}</Text>
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
                          <SpPrice primary value={items.reduce_cost / 100} noDecimal />
                        </View>
                        <View className='coupon-desc'>
                          {ti('d9bcdef5.47e317', [
                            items.least_cost > 0 ? items.least_cost / 100 : 0.01
                          ])}
                        </View>
                        <View className='coupon-quan'>{$t('a1dacd5f.607c87')}</View>
                        <View className='coupon-mark'>
                          {items.give_num > 0 ? `x${items.give_num}` : null}
                        </View>
                      </View>
                    )}
                    {(items.card_type === 'gift' || items.card_type === 'new_gift') && (
                      <View>
                        <View className='coupon-price'>
                          <View className='coupon-font'>{$t('d9bcdef5.8bc752')}</View>
                        </View>
                        <View className='coupon-desc'>{items.description}</View>
                        <View className='coupon-quan'>{$t('d9bcdef5.8bc752')}</View>
                        <View className='coupon-mark'>
                          {items.give_num > 0 ? `x${items.give_num}` : null}
                        </View>
                      </View>
                    )}
                    {items.card_type === 'discount' && (
                      <View>
                        <View className='coupon-price'>
                          <Text className='coupon-font'>{(100 - items.discount) / 10}</Text>
                          <Text className='coupon-size'>{$t('d9bcdef5.96c015')}</Text>
                        </View>
                        <View className='coupon-desc'>
                          {ti('a1dacd5f.1b4266', [
                            items.least_cost > 0 ? items.least_cost / 100 : 0.01
                          ])}
                        </View>
                        <View className='coupon-quan'>{$t('d9bcdef5.9268f9')}</View>
                        <View className='coupon-mark'>
                          {items.give_num > 0 ? `x${items.give_num}` : null}
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
              <View className='content-v-padded'>{$t('2d951fb0.de4753')}</View>
              <View className='text-muted'>
                {list[curTabIdx] &&
                  list[curTabIdx].description &&
                  list[curTabIdx].description.split('\n').map((item, index) => {
                    return <View key={`${index}1`}>{item}</View>
                  })}
              </View>
            </View>
          </View>
          {/* <CouponModal visible={visible} list={all_card_list} onChange={this.handleCouponChange} /> */}
        </View>

        {/* 优惠券包 */}
        {visible && (
          <SpCouponPackage
            onClose={() => {
              this.setState({ visible: false })
            }}
          />
        )}
      </SpPage>
    )
  }
}
