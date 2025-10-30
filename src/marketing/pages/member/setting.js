// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpCell, SpNavBar } from '@/components'
import { goToPage } from '@/utils'
import { connect } from 'react-redux'
import { withLogin } from '@/hocs'
import S from '@/spx'

@connect(
  () => ({}),
  (dispatch) => ({
    onUpdateCart: (list) => dispatch({ type: 'cart/update', payload: list }),
    onUpdateCartCount: (count) => dispatch({ type: 'cart/updateCartNum', payload: count }),
    onFetchFavs: (favs) => dispatch({ type: 'member/favs', payload: favs })
  })
)
@withLogin()
export default class MemberSetting extends Component {
  handleClickSetting = () => {
    Taro.navigateTo({
      url: '/marketing/pages/member/userinfo'
    })
  }

  handleClickLogout = async () => {
    S.logout()
    this.props.onFetchFavs([])
    this.props.onUpdateCart([])
    this.props.onUpdateCartCount(0)
    if (process.env.TARO_ENV === 'h5' && Taro.getEnv() !== 'SAPP') {
      // eslint-disable-next-line
      goToPage(process.env.APP_HOME_PAGE)
    } else {
      Taro.redirectTo({
        url: process.env.APP_HOME_PAGE
      })
    }
  }

  render() {
    return (
      <View className='page-member-setting'>
        <SpNavBar title='设置' fixed={false} />

        <View className='sec'>
          {/* <SpCell title='用户设置' isLink onClick={this.handleClickSetting}> </SpCell> */}
          <SpCell title='版本' value={process.env.APP_VERSION}>
            {' '}
          </SpCell>
        </View>

        <View className='btns'>
          <AtButton type='primary' onClick={this.handleClickLogout}>
            退出登录
          </AtButton>
        </View>
      </View>
    )
  }
}
