import Taro, { Component } from '@tarojs/taro'
import { View, Image, Button, Radio, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import api from '@/api'
import S from '@/spx'
import { tokenParse } from "@/utils"
import { Tracker } from "@/service"

import './wxauth.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))

export default class WxAuth extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isAgree: false
    }
  }

  componentDidMount () {
  }
  componentDidShow (){
    this.checkWhite()
  }

  async checkWhite () {
    const { status } = await api.wx.getWhiteList()
    if(status == true){
      setTimeout(() => {
        Taro.hideHomeButton()
      }, 1000)
    }
  }

  redirect () {
    const redirect = this.$router.params.redirect
    const { source } = this.$router.params
    Taro.hideLoading()
    let redirect_url = ''
    if (Taro.getStorageSync('isqrcode') === 'true') {
      redirect_url = redirect
        ? decodeURIComponent(redirect)
        : '/subpage/pages/qrcode-buy'
    } else if (Taro.getStorageSync('isShoppingGuideCard') === 'true') {
      redirect_url = redirect
        ? decodeURIComponent(redirect)
        : '/marketing/pages/member/shopping-guide-card'
    } else if (source === 'other_pay') {
        redirect_url = redirect
        ? decodeURIComponent(redirect)
        : `/pages/cart/espier-checkout?source=${source}`
    } else if (source === 'loginout') {
      Taro.navigateBack()
      return
    } else {
      redirect_url = redirect ? decodeURIComponent(redirect) : '/pages/member/index'
    }
    Taro.redirectTo({
      url: redirect_url
    })
  }

  handleNews = async () =>{
    let templeparams = {
      'temp_name': 'yykweishop',
      'source_type': 'member',
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
    const { code } = await Taro.login()
    Taro.showLoading({
      mask: true,
      title: '正在加载...'
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

      const { token } = await api.wx.login_reg(params)
      if (token) {
        S.setAuthToken(token)
        Taro.showToast({
          title: '登录成功',
          icon: 'none',
          mask: true,
          duration: 2000
        })
        setTimeout(() => {
          this.redirect()
        }, 2000)
        // 通过token解析openid
        const userInfo = tokenParse(token)
        Tracker.setVar({
          user_id: userInfo.user_id,
          open_id: userInfo.openid,
          union_id: userInfo.unionid
        })
      }
    } catch (e) {
      Taro.showToast({
        title: '授权失败，请稍后再试',
        icon: 'none'
      })
    }
    Taro.hideLoading()
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
    const { encryptedData, iv } = res.detail
    if (!encryptedData || !iv) {
      Taro.showModal({
        title: '授权提示',
        content: `需要您的授权才能购物`,
        showCancel: false,
        confirmText: '知道啦'
      })
    }
    this.login_reg({encryptedData, iv})
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
    console.log(e)
    e.stopPropagation()
    Taro.navigateTo({
      url: `/subpage/pages/auth/reg-rule?type=${type}`
    })
  }

  render () {
    const { colors } = this.props
    const { isAgree } = this.state
    // const setCheckColor = isAgree ? colors.data[0].primary : '#fff'
    return (
      <View className='page-wxauth'>
        <View className='logo'>
          <Image
            className='img'
            src='https://store-images.s-microsoft.com/image/apps.1081.13510798886607585.e5e9691e-c9bf-4ee0-ae21-cc7601c0cee5.03207cec-5f89-409c-aec9-3253099cfced?mode=scale&q=90&h=270&w=270&background=%230078D7'
            mode='aspectFill'
          />
        </View>
        <View className='bottom'>
          {
            isAgree ? <Button
              className='btn'
              openType='getPhoneNumber'
              onGetPhoneNumber={this.getPhoneNumber.bind(this)}
            >
              微信授权手机号一键登录
            </Button> : <Button
              className='btn disabled'
              onClick={this.getPhoneNumber.bind(this)}
            >
              微信授权手机号一键登录
            </Button>
          }
          <View 
            className='rule'
            onClick={this.changeAgreeRule.bind(this)}
          >
            <Radio
              checked={isAgree}
            >
            </Radio>
            <View className='content' >
              若微信号未注册则将进入注册流程，注册即为同意<Text onClick={this.jumpRule.bind(this, '')} style={`color: ${colors.data[0].primary}`} className='ruleName' >《用户注册协议》</Text>、<Text onClick={this.jumpRule.bind(this, 2)} style={`color: ${colors.data[0].primary}`} className='ruleName'>《隐私政策》</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
