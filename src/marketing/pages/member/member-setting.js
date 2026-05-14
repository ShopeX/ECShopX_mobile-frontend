/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { withTranslation } from 'react-i18next'
import { $t } from '@/i18n'
import req from '@/api/req'
import { SpPage, SpCell, SpNavBar } from '@/components'
import S from '@/spx'
import { goToPage, isWeb, VERSION_IN_PURCHASE } from '@/utils'
import { connect } from 'react-redux'
import DestoryConfirm from './comps/destory-comfirm-modal'
import './member-setting.scss'

class SettingIndex extends Component {
  constructor(props) {
    super(props)
    this.state = {
      redirectInfo: {},
      visible: false,
      title: '',
      content: '',
      confirmBtnContent: ''
    }
  }

  componentDidMount() {
    this.syncNavTitle()
  }

  componentDidShow() {
    this.fetchRedirect()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.i18n?.language !== this.props.i18n?.language) {
      this.syncNavTitle()
    }
  }

  syncNavTitle = () => {
    Taro.setNavigationBarTitle({ title: $t('162d72a5.e366cc') })
  }

  // 获取积分个人信息跳转
  async fetchRedirect() {
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
    S?.logout()
    this.props.onFetchFavs([])
    this.props.onUpdateCart([])
    this.props.onUpdateCartCount(0)
    if (process.env.TARO_ENV === 'h5' && Taro.getEnv() !== 'SAPP') {
      // eslint-disable-next-line
      Taro.showToast({
        title: $t('20b64b82.499f05'),
        icon: 'none'
      })
      goToPage(process.env.APP_HOME_PAGE)
    } else {
      Taro.showToast({
        title: $t('20b64b82.499f05'),
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
        title: $t('ab76db66.7d1eb0'),
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
        title: $t('ab76db66.7d1eb0'),
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

  async handleCancelMenber() {
    req.delete('/member', { is_delete: '0' }).then((res) => {
      if (!res.status) {
        this.setState({
          visible: true,
          title: $t('20b64b82.ec41af'),
          content: res.msg,
          confirmBtnContent: $t('20b64b82.fe0337')
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

  render() {
    const { visible, content, title, confirmBtnContent } = this.state
    const { colors } = this.props
    return (
      <SpPage className='member-setting'>
        <SpNavBar title={$t('162d72a5.e366cc')} />
        <View className='member-setting-section'>
          <SpCell
            title={$t('3c569e24.eab129')}
            isLink
            onClick={this.handleClickInfo.bind(this)}
          ></SpCell>
          <SpCell
            title={$t('cb93ea29.bca1ea')}
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
                  {$t('20b64b82.44efd1')}
                </Button>
              )}

              <Button
                className='button'
                style={`color: ${colors.data[0].primary}; border: 1px solid ${colors.data[0].primary}`}
                onClick={this.handleCancelMenber.bind(this)}
              >
                {$t('20b64b82.ec41af')}
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

export default connect(({ colors }) => ({
  colors: colors.current
}))(
  connect(
    () => ({}),
    (dispatch) => ({
      onUpdateCart: (list) => dispatch({ type: 'cart/update', payload: list }),
      onUpdateCartCount: (count) => dispatch({ type: 'cart/updateCartNum', payload: count }),
      onFetchFavs: (favs) => dispatch({ type: 'member/favs', payload: favs })
    })
  )(withTranslation()(SettingIndex))
)
