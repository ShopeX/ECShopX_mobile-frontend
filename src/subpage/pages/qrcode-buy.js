import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { connect } from 'react-redux'
import { withPager, withBackToTop } from '@/hocs'
import { AtFloatLayout } from 'taro-ui'
import { SpToast, CouponItem, SpCheckbox, SpHtmlContent } from '@/components'
import api from '@/api'
import { pickBy, normalizeQuerys } from '@/utils'
import S from '@/spx'
import entry from '@/utils/entry'
import '../../pages/member/qrcode-buy.scss'

@connect(({ colors, sys }) => ({
  colors: colors.current,
  pointName: sys.pointName
}))
@withPager
@withBackToTop
export default class QrcodeBuy extends Component {
  $instance = getCurrentInstance()
  constructor (props) {
    super(props)

    this.state = {
      isLogin: false,
      userInfo: '',
      couponData: '',
      banner_img: '',
      isCkeckTips: true,
      tipsInfo: null,
      tipsInfoShow: false
    }
  }

  async componentDidMount () {
    const options = this.$instance.router.params
    const query = await normalizeQuerys(this.$instance.router.params)
    console.log(query, 38)
    Taro.setStorageSync('isqrcode', query.qrcode)
    Taro.setStorageSync('odtid', query.odtid)
    await entry.entryLaunch(options, true)
    const { banner } = await Taro.getStorageSync('curStore')
    this.setState({
      banner_img: banner
    })
    this.fetchTips()
  }

  async componentDidShow () {
    this.fetch()
  }

  async fetch () {
    if (!S.getAuthToken()) {
      this.setState({
        isLogin: false
      })
    } else {
      const { memberInfo } = await api.member.memberInfo()
      console.log(memberInfo, 30)
      this.setState(
        {
          isLogin: true,
          userInfo: memberInfo
        },
        () => {
          this.couponData()
        }
      )
    }
  }
  async fetchTips () {
    const { content } = await api.user.regRule()
    this.setState({
      tipsInfo: content
    })
  }

  couponData = async () => {
    let params = {
      page_no: 1,
      page_size: 10,
      valid: false
    }
    const { list } = await api.member.couponList(params)
    const nList = pickBy(list, {
      id: 'id',
      status: 'status',
      reduce_cost: 'reduce_cost',
      least_cost: 'least_cost',
      begin_date: 'begin_date',
      end_date: 'end_date',
      card_type: 'card_type',
      tagClass: 'tagClass',
      title: 'title',
      discount: 'discount'
    })
    const firstData = nList[0]
    this.setState({
      couponData: firstData
    })
  }

  handleLoginClick = () => {
    if (this.state.isCkeckTips === false) {
      return S.toast('请先同意用户协议')
    }
    Taro.navigateTo({
      url: '/subpage/pages/auth/wxauth'
    })
    // S.login(this, true)
  }

  handleCamera = async () => {
    if (!S.getAuthToken()) {
      return S.toast('请先授权')
    }
    // const distributor = Taro.getStorageSync('curStore')
    const odtid = Taro.getStorageSync('odtid')
    // console.log(116,Taro.getStorageSync('odtid'))
    console.log(116, odtid)
    Taro.scanCode({
      async success (res) {
        let query = {
          barcode: res.result,
          distributor_id: odtid ? odtid : 0
        }
        try {
          const result = await api.user.scancodeAddcart(query)
          S.toast(result.msg)
        } catch (e) {
          Taro.showToast({
            icon: 'none',
            title: e.message
          })
        }
      }
    })
  }

  handleTips = () => {
    this.setState({
      tipsInfoShow: true
    })
  }

  handleTrade = () => {
    Taro.navigateTo({
      url: '/subpage/pages/trade/list'
    })
  }

  handleCart = () => {
    Taro.navigateTo({
      url: '/pages/cart/espier-index?path=qrcode'
    })
  }

  handleHome = () => {
    Taro.navigateTo({
      url: '/pages/index'
    })
  }

  handleClose = () => {}

  render () {
    const { colors } = this.props
    const { isLogin, userInfo, couponData, banner_img, isCkeckTips, tipsInfo, tipsInfoShow } =
      this.state

    console.log(isLogin, 86)
    let bg_img = ''
    if (userInfo.gradeInfo) {
      bg_img = userInfo.gradeInfo.background_pic_url
    }

    return (
      <View className='qrcode-buy'>
        <View className='qrcode-buy__top'>
          {isLogin === true ? (
            <View className='islogin_user'>
              <View className='islogin_user__content'>
                <Image src={bg_img} mode='widthFix' className='qrcode-buy__bgimg'></Image>
                <View className='islogin_user_info'>
                  <View className='islogin_user_left'>
                    <View>{userInfo.username}</View>
                    <View>{userInfo.user_card_code}</View>
                  </View>
                  <View className='islogin_user_right'>{this.props.pointName}</View>
                </View>
              </View>
            </View>
          ) : (
            <Image src={banner_img} mode='widthFix' className='qrcode-buy__img'></Image>
          )}
          <CouponItem info={couponData} />
          <View className='scancode-view' onClick={this.handleCamera.bind(this)}>
            <Image
              src='/assets/imgs/bt_scanning.png'
              mode='widthFix'
              className='qrcode-buy__scanning'
            ></Image>
            <View>扫描商品条码</View>
          </View>
        </View>

        {isLogin === false ? (
          <View className='wauth-btn'>
            <View
              className='wauth-btn__btn'
              onClick={this.handleLoginClick.bind(this)}
              style={`background: ${colors.data[0].primary}`}
            >
              立即授权
            </View>
            <View className='wauth-btn__tips'>
              <SpCheckbox checked={isCkeckTips} />
              <Text className='wauth-btn__text' onClick={this.handleTips.bind(this)}>
                用户协议
              </Text>
            </View>
          </View>
        ) : (
          <View className='auth-btns'>
            <View className='auth-btns__item' onClick={this.handleHome.bind(this)}>
              <View className='iconfont iconfont-home'></View>
              <View>商城首页</View>
            </View>
            <View className='auth-btns__item' onClick={this.handleCart.bind(this)}>
              <View className='iconfont icon-cart'></View>
              <View>购物车</View>
            </View>
            <View className='auth-btns__item' onClick={this.handleTrade.bind(this)}>
              <View className='iconfont-home'></View>
              <View>我的订单</View>
            </View>
          </View>
        )}

        <AtFloatLayout
          isOpened={tipsInfoShow}
          title='用户协议'
          onClose={this.handleClose.bind(this)}
        >
          {tipsInfo && <SpHtmlContent className='pay-rule-style' content={tipsInfo} />}
        </AtFloatLayout>
        <SpToast />
      </View>
    )
  }
}
