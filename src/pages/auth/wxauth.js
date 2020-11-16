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
    isAuthShow: false
  }

  componentDidMount () {
    this.autoLogin()
  }

  async autoLogin () {
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
      if (this.$router.params.redirect) {
        const memberInfo = await api.member.memberInfo()
        const userObj = {
          username: memberInfo.memberInfo.username,
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
      if(!salesperson_id){
        return this.redirect()
      }

      let info = await api.member.getUsersalespersonrel({
        salesperson_id
      })
      if(info.is_bind === '1'){
        return this.redirect()
      }
      // 绑定导购
      await api.member.setUsersalespersonrel({
        salesperson_id
      })
      return this.redirect()
    } catch (e) {
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
    let redirect_url = ''
    if (Taro.getStorageSync('isqrcode') === 'true') {
      redirect_url = redirect
        ? decodeURIComponent(redirect)
        : '/pages/qrcode-buy'
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

  handleNews = () =>{
    let templeparams = {
      'temp_name': 'yykweishop',
      'source_type': 'member',
    }
    let _this = this

    api.user.newWxaMsgTmpl(templeparams).then(tmlres => {
      console.log('templeparams---1', tmlres)
      if (tmlres.template_id && tmlres.template_id.length > 0) {
        wx.requestSubscribeMessage({
          tmplIds: tmlres.template_id,
          complete() {
            _this.handleGetUserInfo()
          }
        })
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
        const userInfo = tokenParse( token );
        Tracker.setVar( {
          user_id: userInfo.user_id,
          open_id: userInfo.openid,
          union_id: userInfo.unionid  
        } );
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
        url: `/pages/auth/reg?code=${code}&open_id=${open_id}&union_id=${union_id}&redirect=${redirectUrl}&source=${source}`
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
    const { isAuthShow } = this.state
    const extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {}

    return (
      <View className='page-wxauth'>
        {isAuthShow && (
          <View className='sec-auth'>
            <View className='auth-title'>用户授权</View>
            <Text className='auth-hint'>{extConfig.wxa_name}申请获得你的公开信息（昵称、头像等）</Text>
            <View className='auth-btns'>
              <AtButton
                type='primary'
                lang='zh_CN'
                customStyle={`background: ${colors.data[0].primary}; border-color: ${colors.data[0].primary}`}
                openType='getUserInfo'
                onClick={this.handleNews.bind(this)}
                onGetUserInfo={this.handleGetUserInfo}
              >授权允许</AtButton>
              <AtButton className='back-btn' type='default' onClick={this.handleBackHome.bind(this)}>拒绝</AtButton>
            </View>
          </View>
        )}
      </View>
    )
  }
}
