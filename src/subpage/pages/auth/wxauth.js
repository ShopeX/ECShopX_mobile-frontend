import React, { Component } from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Image, Button, Radio, Text } from '@tarojs/components'
import { connect } from 'react-redux'
import api from '@/api'
import S from '@/spx'
import { tokenParse, isAlipay } from '@/utils'
import { SpLogin } from '@/components'
import entry from '@/utils/entry'
// import { Tracker } from '@/service'

import './wxauth.scss'

let codeSetTime = 1000 * 10

@connect(({ colors }) => ({
  colors: colors.current
}))
export default class WxAuth extends Component {
  $instance = getCurrentInstance();
  constructor(props) {
    super(props)

    this.state = {
      isAgree: true,
      isMustOauth: false,
      isNewOpen: true,
      baseInfo: {
        protocol: {}
      },
      code: ''
    }
  }

  componentDidMount () {
    this.getStoreSettingInfo()
    this.getIsMustOauth()
    this.setCode(true)
    this.handleCodeTime()
  }

  setCode = async (init) => {
    let code
    let res = await Taro.login()
    code = res.code
    this.setState({
      code
    })
  }

  //处理code定时器
  handleCodeTime = () => {
    // this.timer = setInterval(
    //   () => {
    //     this.setCode()
    //   },
    //   codeSetTime
    // );
  }

  componentWillUnmount() {
    this.timer && clearInterval(this.timer)
  }

  componentDidShow(option) {
    this.checkWhite()
    if (!this.state.isNewOpen) {
      this.redirect()
    }
  }

  // 获取总店配置信息
  async getStoreSettingInfo() {
    const data = await api.shop.getStoreBaseInfo()
    this.setState({
      baseInfo: data
    })
  }

  async checkWhite() {
    const { status } = await api.wx.getWhiteList()
    if (status == true) {
      setTimeout(() => {
        Taro.hideHomeButton()
      }, 1000)
    }
  }

  async getIsMustOauth() {
    const { switch_first_auth_force_validation } = await api.user.getIsMustOauth({ module_type: 1 })
    if (switch_first_auth_force_validation == 1) {
      this.setState({ isMustOauth: true })
    }
  }

  redirect() {
    const redirect = this.$instance.router.params.redirect
    const { source } = this.$instance.router.params
    Taro.hideLoading()
    let redirect_url = ''
    if (Taro.getStorageSync('isqrcode') === 'true') {
      redirect_url = redirect ? decodeURIComponent(redirect) : '/subpage/pages/qrcode-buy'
    } else if (Taro.getStorageSync('isShoppingGuideCard') === 'true') {
      redirect_url = redirect
        ? decodeURIComponent(redirect)
        : '/marketing/pages/member/shopping-guide-card'
    } else if (source === 'other_pay') {
      redirect_url = redirect
        ? decodeURIComponent(redirect)
        : `/pages/cart/espier-checkout?source=${source}`
    } else if (source === 'loginout') {
      redirect_url = '/marketing/pages/member/userinfo'
    } else {
      redirect_url = redirect ? decodeURIComponent(redirect) : '/pages/member/index'
    }
    if (redirect_url === '/pages/member/index') {
      Taro.navigateBack()
    } else {
      Taro.redirectTo({
        url: redirect_url
      })
    }
  }

  handleNews = async () => {
    let templeparams = {
      'temp_name': 'yykweishop',
      'source_type': 'member'
    }
    const tmlres = await api.user.newWxaMsgTmpl(templeparams)
    if (tmlres.template_id && tmlres.template_id.length > 0) {
      await Taro.requestSubscribeMessage({
        tmplIds: tmlres.template_id
      })
    }
  }

  // 登录注册事件
  login_reg = async (getParams) => {
    const { code } = this.state
    Taro.showLoading({
      mask: true,
      title: '正在登录...'
    })
    try {
      const uid = Taro.getStorageSync('distribution_shop_id')
      const trackParams = Taro.getStorageSync('trackParams')
      // 导购id
      const salesperson_id = Taro.getStorageSync('s_smid')
      // 新导购信息处理
      const work_userid = Taro.getStorageSync('work_userid')
      const params = {
        code,
        user_type: 'wechat',
        auth_type: 'wxapp',
        ...getParams
      }

      if (salesperson_id) {
        params.distributor_id = Taro.getStorageSync('s_dtid')
        params.salesperson_id = salesperson_id
      }

      if (work_userid) {
        params.channel = 1
        params.work_userid = work_userid
      }

      if (trackParams) {
        params.source_id = trackParams.source_id
        params.monitor_id = trackParams.monitor_id
      }
      if (uid) {
        params.inviter_id = uid
        params.uid = uid
      }

      const { token, is_new } = await api.wx.newlogin(params)

      if (is_new) {
        await entry.logScene({ register: true })
      }

      if (token) {
        S.setAuthToken(token)
        Taro.hideLoading()
        Taro.showToast({
          title: '登录成功',
          icon: 'none',
          mask: true,
          duration: 2000
        })

        if (work_userid) {
          api.user.uniquevisito({
            work_userid: work_userid
          })
          const gu_user_id = Taro.getStorageSync('gu_user_id')
          if (gu_user_id) {
            api.user.bindSaleperson({
              work_userid: work_userid
            })
          }
        }

        setTimeout(() => {
          if (this.state.isMustOauth && is_new) {
            this.setState({
              isNewOpen: false
            }, () => {
              Taro.navigateTo({
                url: '/marketing/pages/member/userinfo'
              })
            })
          } else {
            this.redirect()
          }
        }, 800)
        // 通过token解析openid
        const userInfo = tokenParse(token)
        Tracker.setVar({
          user_id: userInfo.user_id,
          open_id: userInfo.openid,
          union_id: userInfo.unionid
        })
      }
    } catch (e) {
      console.log(e, 'e')
      Taro.showToast({
        title: '授权失败，请稍后再试',
        icon: 'none'
      })
    }
    setTimeout(() => {
      Taro.hideLoading()
    }, 1000)
  }

  // 获取手机号登录注册
  getPhoneNumber = async (res) => {
    const { isAgree } = this.state
    if (!isAgree) {
      Taro.showToast({
        title: '请勾选协议',
        icon: 'none'
      })
      return
    }
    const { encryptedData, iv, cloudID } = res.detail
    if (!encryptedData || !iv) {
      Taro.showModal({
        title: '授权提示',
        content: `需要您的授权才能购物`,
        showCancel: false,
        confirmText: '知道啦'
      })
      return false
    }
    this.login_reg({ encryptedData, iv, cloudID })
  }

  // 点击回到首页
  handleBackHome = () => {
    Taro.navigateBack()
  }

  // radio切换事件
  changeAgreeRule = () => {
    const { isAgree } = this.state
    this.setState({
      isAgree: !isAgree
    })
  }

  jumpRule = async (type = '', e) => {
    e.stopPropagation()
    Taro.navigateTo({
      url: `/subpage/pages/auth/reg-rule?type=${type}`
    })
  }

  getAuthCode = () => {
    console.log('getAuthCode')
    my.getAuthCode({
      scopes: ['auth_user'],
      success: (res) => {
        my.alert({
          content: res.authCode
        })
      }
    })
  }

  onChangeLoginSuccess = () => {
    const { source, scene } = this.$router.params
    Taro.redirectTo({ url: `/pages/cart/espier-checkout?source=${source}&scene=${scene}` })
  }

  render() {
    const { colors } = this.props
    const { isAgree, baseInfo } = this.state
    // const setCheckColor = isAgree ? colors.data[0].primary : '#fff'
    return (
      <View className='page-wxauth'>
        <View className='logo'>
          <Image className='img' src={baseInfo.logo} mode='aspectFill' />
        </View>
        <View className='bottom'>
          {isAgree ? (
            isAlipay ? <Button
                className='btn'
                onClick={this.getAuthCode}
                // openType='getPhoneNumber'
                // onGetPhoneNumber={this.getPhoneNumber.bind(this)}
              >
                微信授权手机号一键登录
              </Button>
             : <SpLogin onChange={this.onChangeLoginSuccess.bind(this)}>
                <Button className='btn' >微信授权手机号一键登录</Button>
              </SpLogin>
            )
            : <Button
              className='btn disabled'
              // onClick={this.getPhoneNumber.bind(this)}
            >
              微信授权手机号一键登录
            </Button>
          }
          <View className='rule' onClick={this.changeAgreeRule.bind(this)}>
            <Radio checked={isAgree}></Radio>
            <View className='content'>
              若微信号未注册则将进入注册流程，注册即为同意
              <Text
                onClick={this.jumpRule.bind(this, 'member_register')}
                style={`color: ${colors.data[0].primary}`}
                className='ruleName'
              >
                《{baseInfo.protocol.member_register}》
              </Text>
              、
              <Text
                onClick={this.jumpRule.bind(this, 'privacy')}
                style={`color: ${colors.data[0].primary}`}
                className='ruleName'
              >
                《{baseInfo.protocol.privacy}》
              </Text>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
