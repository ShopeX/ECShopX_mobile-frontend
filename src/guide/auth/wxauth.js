import Taro, { Component } from '@tarojs/taro'
import { View, Image,Text } from '@tarojs/components'
import {BaNavBar} from '../components'
import { AtButton } from 'taro-ui'
import api from '@/api'
import S from '@/spx'
import { connect } from '@tarojs/redux'
import { tokenParse} from '@/utils'
import { Tracker } from "@/service";

import './wxauth.scss'
@connect(()=>({}),(dispatch)=>({
  dispatch
}))
export default class WxAuth extends Component {
  config = {
    navigationStyle:'custom'
  }
  state = {
    isAuthShow: false,
    emp:null,
    qw_session:null

  }

  componentDidMount () {
    this.setState({
      qw_session:S.get('qw_session', true)
    })
  }

  // async autoLogin () {
  //   const { code } = await Taro.login()
  //   const qw_session = await S.setQwSession()
  //   let params={
  //     code,
  //     wechat_user_id:qw_session.userid 
  //   }
  //   this.setState({
  //     qw_session
  //   })
 
    
  // }

  // api获取用户信息
  async getUserInfo () {
    return Taro.getUserInfo({lang:'zh_CN'}).then(res=>{
     
      return res.userInfo
    })
  }

  //异步设置storage用户信息
  async setUserInfoStorage (userInfo) {
      await api.user.updateUserInfo(userInfo)
     let res= await api.member.memberInfo()
     Taro.setStorageSync('userinfo',  {
      username: res.memberInfo.username,
      avatar: res.memberInfo.avatar,
      user_id: res.memberInfo.user_id,
      mobile: res.memberInfo.mobile,
      ...userInfo
     
    })

}

 


  redirect () {
 
    const redirect = this.$router.params.redirect
    let redirect_url = redirect
      ? decodeURIComponent(redirect)
      : '/guide/index'
    
    // Taro.removeStorageSync('redirectPage')
    Taro.redirectTo({
      url: redirect_url
    })
  }

  handleGetUserInfo = async (res) => {
    const loginParams = res.detail
    const { iv, encryptedData, rawData, signature, userInfo } = loginParams

    if (!iv || !encryptedData) {
      Taro.showModal({
        title: '授权提示',
        content: `${APP_NAME}需要您的授权才能正常运行`,
        showCancel: false,
        confirmText: '知道啦'
      })
 
      return
    }
   
    const { code } = await Taro.login()
    const qw_session=this.state.qw_session
    //  console.log('qw_session-----===',qw_session)
    Taro.showLoading({
      mask: true,
      title: '正在加载...'
    })

    try {
      const track = Taro.getStorageSync('trackParams')
      let source_id = 0, monitor_id = 0
      if (track) {
        source_id = track.source_id
        monitor_id = track.monitor_id
      }
   
      let preloginParams={
        code,
        iv,
        encryptedData,
        rawData,
        signature,
        userInfo,
        source_id,
        monitor_id,
        wechat_user_id:qw_session.userid 
      
      }
      const redirect = this.$router.params.redirect
      
      const { token, open_id, union_id, user_id } = await api.wx.prelogin(preloginParams)
      S.setAuthToken(token)
     
     
    
      const app_id = await api.user.getAppId()
      console.log('app_id-----888---1',app_id)
  
    
      // 绑定过，跳转会员中心
      if (user_id) {
        await this.autoLogin()
        return
      }
      let regurl=`/guide/auth/reg?code=${code}&open_id=${open_id}&union_id=${union_id}`
      if(redirect){
        regurl=`/guide/auth/reg?code=${code}&open_id=${open_id}&union_id=${union_id}&redirect=${encodeURIComponent(redirect)}`
     
      }
  
      // 跳转注册绑定
      Taro.navigateTo({
        url:regurl
      })
    } catch (e) {
      // console.info(e)
      console.log('授权失败----1',e)
      Taro.showToast({
        title: '授权失败，请稍后再试',
        icon: 'none'
      })
    }

    Taro.hideLoading()
	}

	handleClickHome(){
   
		Taro.redirectTo({
			url: BA_APP_HOME_PAGE
		})
  }

  render () {
    const { isAuthShow } = this.state

    return (
      <View className='page-wxauth'>
         <BaNavBar title='innisfree 导购商城' fixed jumpType='home'  icon='in-icon in-icon-backhome'/>
        {isAuthShow && (
          <View className='sec-auth'>
            <Text className='auth-hint__title'>用户授权</Text>
            <Text className='auth-hint__text'>innisfree悦诗风吟申请获得\n你的公开信息（昵称、头像等）</Text>
            <Image
              className='login-bg_img'
              mode='widthFix'
              src='https://bbc-espier-images.amorepacific.com.cn/image/2/2020/09/23/5cf2e2c5fc314da0b6da761538a831caNLsh1ummYfyPca0vj09eRMwNukEHgwz7'
            />
            <AtButton
              className='auth-hint__btn'
              lang='zh_CN'
              openType='getUserInfo'
              onGetUserInfo={this.handleGetUserInfo}
						>立即授权</AtButton>
						<Text className='auth-more' onClick={this.handleClickHome}>再逛逛</Text>
          </View>
        )}
      </View>
    )
  }
}
