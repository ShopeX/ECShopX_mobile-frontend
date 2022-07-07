import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import req from '@/api/req'
import { SpPage, SpCell, SpNavBar } from '@/components'
import S from '@/spx'
import { goToPage, isWeb, VERSION_IN_PURCHASE } from '@/utils'
import { connect } from 'react-redux'
import DestoryConfirm from './comps/destory-comfirm-modal'

import './member-setting.scss'

@connect(
  () => ({}),
  (dispatch) => ({
    onUpdateCart: (list) => dispatch({ type: 'cart/update', payload: list }),
    onUpdateCartCount: (count) => dispatch({ type: 'cart/updateCartNum', payload: count }),
    onFetchFavs: (favs) => dispatch({ type: 'member/favs', payload: favs })
  })
)
@connect(({ colors }) => ({
  colors: colors.current
}))
export default class SettingIndex extends Component {
  constructor (props) {
    super(props)
    this.state = {
      redirectInfo: {},
      visible: false,
      title: '',
      content: '',
      confirmBtnContent: ''
    }
  }

  componentDidShow () {
    this.fetchRedirect()
  }

  // 获取积分个人信息跳转
  async fetchRedirect () {
    const url = `/pageparams/setting?template_name=yykweishop&version=v1.0.1&page_name=member_center_redirect_setting`
    const { list = [] } = await req.get(url)
    if (list[0] && list[0].params) {
      this.setState({
        redirectInfo: list[0].params
      })
    }
    // this.setState({
    //   memberBanner:list
    // })
  }
  handleClickLogout = async () => {
    S.logout()
    this.props.onFetchFavs([])
    this.props.onUpdateCart([])
    this.props.onUpdateCartCount(0)
    console.log(process.env.TARO_ENV, '=======process.env.TARO_ENV ')
    console.log(Taro.getEnv(), '======= Taro.getEnv() ')
    console.log(process.env.APP_HOME_PAGE)
    if (process.env.TARO_ENV === 'h5' && Taro.getEnv() !== 'SAPP') {
      // eslint-disable-next-line
      Taro.showToast({
        title: '退出登录成功',
        icon: 'none'
      })
      goToPage(process.env.APP_HOME_PAGE)
    } else {
      Taro.showToast({
        title: '退出登录成功',
        icon: 'none'
      })
      Taro.redirectTo({
        url: process.env.APP_HOME_PAGE
      })
    }
  }

  handleClickWxOAuth = (url, isLogin = false) => {
    if (!S.getAuthToken() && isLogin) {
      Taro.showToast({
        title: '请登录',
        icon: 'none'
      })
      return false
    }
    Taro.navigateTo({ url })
  }

  handleClickInfo = () => {
    const { redirectInfo } = this.state
    if (!S.getAuthToken()) {
      Taro.showToast({
        title: '请登录',
        icon: 'none'
      })
      return false
    }
    // if (redirectInfo.data && redirectInfo.data.info_url_is_open) {
    //   Taro.navigateToMiniProgram({
    //     appId: redirectInfo.data.info_app_id,
    //     path: redirectInfo.data.info_page
    //   })
    // } else {
    this.handleClickWxOAuth('/marketing/pages/member/userinfo', true)
    // }
  }

  async handleCancelMenber () {
    req.delete('/member', { is_delete: '0' }).then((res) => {
      if (!res.status) {
        this.setState({
          visible: true,
          title: '注销账号',
          content: res.msg,
          confirmBtnContent: '我知道了'
        })
      } else {
        this.handleClickWxOAuth(`/marketing/pages/member/destroy-member?phone=${res.msg}`, true)
      }
    })
  }

  handCancel = () => {
    // if (parmas === 'confirm') {
    //   // 我知道了
    //   this.handleClickWxOAuth("/marketing/pages/member/destroy-member", true)
    // }
    this.setState({ visible: false })
  }

  render () {
    const { visible, content, title, confirmBtnContent } = this.state
    const { colors } = this.props
    return (
      <SpPage className='member-setting'>
        <SpNavBar title='设置' />
        <View className='member-setting-section'>
          <SpCell title='个人信息' isLink onClick={this.handleClickInfo.bind(this)}></SpCell>
          <SpCell
            title='地址管理'
            isLink
            onClick={this.handleClickWxOAuth.bind(this, '/marketing/pages/member/address', true)}
          ></SpCell>
          {S.getAuthToken() && !VERSION_IN_PURCHASE && (
            <View className='btn'>
              {isWeb && (
                <Button
                  className='button'
                  style={`color: ${colors.data[0].primary}; border: 1px solid ${colors.data[0].primary}`}
                  onClick={this.handleClickLogout}
                >
                  退出登录
                </Button>
              )}

              <Button
                className='button'
                style={`color: ${colors.data[0].primary}; border: 1px solid ${colors.data[0].primary}`}
                onClick={this.handleCancelMenber.bind(this)}
              >
                注销账号
              </Button>
            </View>
          )}
        </View>
        <DestoryConfirm
          visible={visible}
          content={content}
          title={title}
          confirmBtn={confirmBtnContent}
          onCancel={this.handCancel}
        />
      </SpPage>
    )
  }
}
