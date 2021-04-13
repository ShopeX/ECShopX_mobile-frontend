import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtButton } from 'taro-ui'
import api from '@/api'
import S from '@/spx'
import { tokenParse } from "@/utils";
import { Tracker } from "@/service";

import './wxauth.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))

export default class WxAuth extends Component {
  state = {
    isAuthShow: false,
    canIUseGetUserProfile: false
  }

  componentDidMount () {
    if (wx.getUserProfile) {
      this.setState({
        canIUseGetUserProfile: true
      })
    }
    this.autoLogin()
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

  async autoLogin () {
    Taro.showLoading({
      title: '登录中'
    })
    const { code } = await Taro.login()
    try {
      const { token } = await api.wx.login({ code })
      if ( !token ) throw new Error( `token is not defined: ${token}` )
      S.setAuthToken(token);
      if (token) {
        // 通过token解析openid
        const userInfo = tokenParse(token);
        Tracker.setVar({
          user_id: userInfo.user_id,
          open_id: userInfo.openid,
          union_id: userInfo.unionid
        });
      }
      const { source, redirect } = this.$router.params
      if (source || redirect) {
        const memberInfo = await api.member.memberInfo()
        const userObj = {
          username: memberInfo.memberInfo.nickname || memberInfo.memberInfo.username || memberInfo.memberInfo.mobile,
          avatar: memberInfo.memberInfo.avatar,
          userId: memberInfo.memberInfo.user_id,
          isPromoter: memberInfo.is_promoter,
          openid: memberInfo.memberInfo.open_id,
          vip: memberInfo.vipgrade ? memberInfo.vipgrade.vip_type : '',
          mobile: memberInfo.memberInfo.mobile
        }
        Taro.setStorageSync('userinfo', userObj)
      }
      
      let salesperson_id = Taro.getStorageSync('s_smid')
      const gu_user_id = Taro.getStorageSync('gu_user_id')
      if (gu_user_id) {
        api.user.bindSaleperson({
          work_userid: salesperson_id
        })
      }
      if(!salesperson_id){
        return this.redirect()
      }
      let info = await api.member.getUsersalespersonrel({
        salesperson_id
      })
      if(info.is_bind === '1'){
        return this.redirect()
      }
      console.log("------a-----")
      // 绑定导购
      await api.member.setUsersalespersonrel({
        salesperson_id
      })
      return this.redirect()
    } catch (e) {
      Taro.hideLoading()
      if (e.res.data.error.code === 401002) {
        setTimeout(() => {
          Taro.navigateBack()
        }, 1500)
      }
      this.setState({
        isAuthShow: true
      })
    }
  }

  redirect () {
    const redirect = this.$router.params.redirect
    let { source } = this.$router.params
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
    } else if(source === 'other_pay'){
        redirect_url = redirect
        ? decodeURIComponent(redirect)
        : `/pages/cart/espier-checkout?source=${source}`
    }else{
      redirect_url = redirect
        ? decodeURIComponent(redirect)
        : '/pages/member/index'
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

  // getUserProfile 新事件
  handleGetUserProfile = () => {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: data => {
        const res = {
          detail: data
        }
        this.handleGetUserInfo(res)
      }
    })
  }


  handleGetUserInfo = async (res) => {
    const loginParams = res.detail
    const { iv, encryptedData, rawData, signature, userInfo } = loginParams
    if (!iv || !encryptedData) {
      Taro.showModal({
        title: '授权提示',
        content: `需要您的授权才能购物`,
        showCancel: false,
        confirmText: '知道啦'
      })

      return
    }

    const { code } = await Taro.login()

    Taro.showLoading({
      mask: true,
      title: '正在加载...'
    })

    try {
      const uid = Taro.getStorageSync('distribution_shop_id')
      let params = {
        code,
        iv,
        encryptedData,
        rawData,
        signature,
        userInfo
      }
      const trackParams = Taro.getStorageSync('trackParams')
      if (trackParams) {
        Object.assign(params, {source_id: trackParams.source_id, monitor_id: trackParams.monitor_id})
      }
      if (uid) {
        Object.assign(params, {inviter_id: uid})
      }
      const { token, open_id, union_id, user_id } = await api.wx.prelogin(params)

      S.setAuthToken(token)
      // 通过token解析openid
      if ( token ) {
        const userToken = tokenParse(token);
        Tracker.setVar( {
          user_id: userToken.user_id,
          open_id: userToken.openid,
          union_id: userToken.unionid  
        });
      }

      Taro.showModal({
        title: '提示',
        content: '是否订阅注册成功通知？',
        success: async confirmRes => {
          if (confirmRes.confirm) {
            await this.handleNews()
          }
          // 绑定过，跳转会员中心
          if (user_id) {
            await this.autoLogin()
            return
          }
          const { source, redirect } = this.$router.params
          const redirectUrl= encodeURIComponent(redirect)
          // 跳转注册绑定
          Taro.redirectTo({
            url: `/subpage/pages/auth/reg?code=${code}&open_id=${open_id}&union_id=${union_id}&redirect=${redirectUrl}&source=${source}`
          })
        }
      })
    } catch (e) {
      console.info(e)
      Taro.showToast({
        title: '授权失败，请稍后再试',
        icon: 'none'
      })
    }

    Taro.hideLoading()
  }

  handleBackHome = () => {
    Taro.navigateBack()
  }

  render () {
    const { colors } = this.props
    const { isAuthShow, canIUseGetUserProfile } = this.state
    const extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {}
    return (
      <View className='page-wxauth'>
        {isAuthShow && (
          <View className='sec-auth'>
            <View className='auth-title'>用户授权</View>
            <Text className='auth-hint'>{extConfig.wxa_name}申请获得你的公开信息（昵称、头像等）</Text>
            <View className='auth-btns'>
              {
                canIUseGetUserProfile ? <AtButton
                  type='primary'
                  lang='zh_CN'
                  customStyle={`background: ${colors.data[0].primary}; border-color: ${colors.data[0].primary}`}
                  onClick={this.handleGetUserProfile.bind(this)}
                >
                  授权允许
                </AtButton>
                : <AtButton
                  type='primary'
                  lang='zh_CN'
                  customStyle={`background: ${colors.data[0].primary}; border-color: ${colors.data[0].primary}`}
                  openType='getUserInfo'
                  onGetUserInfo={this.handleGetUserInfo}
                >授权允许</AtButton>
              }
              <AtButton className='back-btn' type='default' onClick={this.handleBackHome.bind(this)}>拒绝</AtButton>
            </View>
          </View>
        )}
      </View>
    )
  }
}
