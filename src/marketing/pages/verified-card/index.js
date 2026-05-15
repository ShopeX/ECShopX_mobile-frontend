/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image, Navigator } from '@tarojs/components'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { $t, ti } from '@/i18n'
import { SpNavBar } from '@/components'
import api from '@/api'
import { pickBy } from '@/utils'
import './index.scss'

class VerifiedCardIndex extends Component {
  constructor(props) {
    super(props)
    this.state = {
      info: {}
    }
  }
  componentDidMount() {
    const { colors } = this.props
    Taro.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: colors.data[0].marketing
    })
    this.syncNavTitle()
    this.fetch()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.i18n?.language !== this.props.i18n?.language) {
      this.syncNavTitle()
    }
  }

  syncNavTitle = () => {
    Taro.setNavigationBarTitle({ title: $t('ed048328.3a5bf1') })
  }

  handleClick = () => {
    let { status } = this.state.info
    if (status == 3) {
      Taro.navigateTo({
        url: `/marketing/pages/verified-card/card`
      })
    } else {
      Taro.showToast({
        title: $t('ed048328.ed231b'),
        icon: 'none',
        duration: 2000
      })
    }
  }

  async fetch() {
    const resUser = Taro.getStorageSync('userinfo')
    const { username, avatar } = resUser
    const promoter = await api.distribution.info()
    const pInfo = pickBy(promoter, {
      shop_name: 'shop_name',
      shop_pic: 'shop_pic',
      is_open_promoter_grade: 'is_open_promoter_grade',
      promoter_grade_name: 'promoter_grade_name',
      isOpenShop: 'isOpenShop',
      shop_status: 'shop_status',
      reason: 'reason'
    })
    const res = await api.member.hfpayUserApply()
    const userInfo = pickBy(res, {
      user_name: 'user_name',
      id_card: 'id_card',
      user_mobile: 'user_mobile',
      status: 'status'
    })
    const res2 = await api.member.hfpayBankInfo()
    const bankInfo = pickBy(res2, {
      card_num: 'card_num',
      bank_id: 'bank_id',
      bank_name: 'bank_name'
    })

    let info = { username, avatar, ...pInfo }
    if (userInfo.status == 3) {
      info = { ...info, ...userInfo }
    }
    if (info.card_num) {
      info = { ...info, ...bankInfo }
    }
    this.setState({
      info
    })
  }

  render() {
    const { colors } = this.props
    const { info } = this.state
    const cardTail = String(info.card_num || '').slice(-4)

    return (
      <View className='page-distribution-index'>
        <SpNavBar title={$t('ed048328.3a5bf1')} leftIconType='chevron-left' />
        <View className='header' style={'background: ' + colors.data[0].marketing}>
          <View className='view-flex view-flex-middle'>
            <Image className='header-avatar' src={info.avatar} mode='aspectFill' />
            <View className='header-info view-flex-item'>
              {info.username}
              {info.is_open_promoter_grade && <Text>（{info.promoter_grade_name}）</Text>}
            </View>
            <Navigator
              className='view-flex view-flex-middle'
              url='/marketing/pages/distribution/setting'
            >
              <Text className='icon-info'></Text>
            </Navigator>
          </View>
        </View>
        <View className='section list share'>
          <Navigator
            className='list-item'
            open-type='navigateTo'
            url='/marketing/pages/verified-card/verified'
          >
            <View className='list-item-txt'>
              {$t('ed048328.5197d0')}
              <View className='text-primary'>
                {info.user_name ? ti('ed048328.a518d2', [info.user_name]) : ''}
              </View>
            </View>
            <View className='icon-arrowRight item-icon-go'></View>
          </Navigator>
          <View className='list-item' onClick={this.handleClick}>
            <View className='list-item-txt'>
              {$t('ed048328.005e9c')}
              <View className='text-primary'>
                {info.bank_name ? ti('ed048328.4bf185', [info.bank_name, cardTail]) : ''}
              </View>
            </View>
            <View className='icon-arrowRight item-icon-go'></View>
          </View>
        </View>
      </View>
    )
  }
}

export default connect(({ colors }) => ({
  colors: colors.current
}))(withTranslation()(VerifiedCardIndex))
