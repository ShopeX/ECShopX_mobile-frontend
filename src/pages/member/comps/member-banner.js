import React, { Component } from 'react';
 import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Image } from '@tarojs/components'
// import { SpImg } from '@/components'
import S from '@/spx'

import './member-banner.scss'

export default class MemberBanner extends Component {
  static defaultProps = {}

  constructor(props) {
    super(props)

    this.state = {}
  }
  handleGoUrl = (isOpen, page, appid) => {
    if (isOpen) {
      Taro.navigateToMiniProgram({
        appId: appid,
        path: page
      })
    } else {
      return false
    }
  }

  render() {
    const { info } = this.props
    if (!info) {
      return null
    }

    return (
      <View onClick={this.handleGoUrl.bind(this, info.url_is_open, info.page, info.app_id)}>
        {S.getAuthToken() ? (
          <SpImg
            img-class='bannerInfo__img'
            src={info.login_banner}
            mode='widthFix'
            width='750'
            lazyLoad
          />
        ) : (
          <SpImg
            img-class='bannerInfo__img'
            src={info.no_login_banner}
            mode='widthFix'
            width='750'
            lazyLoad
          />
        )}
      </View>
    )
  }
}
