/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { withTranslation } from 'react-i18next'
import { $t } from '@/i18n'
import { SpCell, SpNavBar } from '@/components'
import { goToPage } from '@/utils'
import { connect } from 'react-redux'
import { withLogin } from '@/hocs'
import S from '@/spx'

class MemberSetting extends Component {
  componentDidMount() {
    this.syncNavTitle()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.i18n?.language !== this.props.i18n?.language) {
      this.syncNavTitle()
    }
  }

  syncNavTitle = () => {
    Taro.setNavigationBarTitle({ title: $t('162d72a5.e366cc') })
  }

  handleClickSetting = () => {
    Taro.navigateTo({
      url: '/marketing/pages/member/userinfo'
    })
  }

  handleClickLogout = async () => {
    S?.logout()
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
        <SpNavBar title={$t('162d72a5.e366cc')} fixed={false} />

        <View className='sec'>
          {/* <SpCell title='用户设置' isLink onClick={this.handleClickSetting}> </SpCell> */}
          <SpCell title={$t('99461d70.fe2df0')} value={process.env.APP_VERSION}>
            {' '}
          </SpCell>
        </View>

        <View className='btns'>
          <AtButton type='primary' onClick={this.handleClickLogout}>
            {$t('20b64b82.44efd1')}
          </AtButton>
        </View>
      </View>
    )
  }
}

export default connect(
  () => ({}),
  (dispatch) => ({
    onUpdateCart: (list) => dispatch({ type: 'cart/update', payload: list }),
    onUpdateCartCount: (count) => dispatch({ type: 'cart/updateCartNum', payload: count }),
    onFetchFavs: (favs) => dispatch({ type: 'member/favs', payload: favs })
  })
)(withLogin()(withTranslation()(MemberSetting)))
