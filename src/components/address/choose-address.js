/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { $t } from '@/i18n'
import { isObjectsValue } from '@/utils'

import './address.scss'

class AddressChoose extends Component {
  static defaultProps = {
    onClickBack: () => {},
    salesman: false
  }

  constructor(props) {
    super(props)

    this.state = {}
  }

  static options = {
    addGlobalClass: true
  }

  clickTo = (choose) => {
    if (this.props.onCustomChosse) {
      this.props.onCustomChosse(choose)
    } else {
      if (this.props.salesman) {
        Taro.navigateTo({
          url: `/subpages/salesman/address?isPicker=${choose}`
        })
      } else {
        Taro.navigateTo({
          url: `/marketing/pages/member/address?isPicker=${choose}`
        })
      }
    }
  }

  render() {
    const { isAddress, isPurchase = false } = this.props
    const addressLineClass = isPurchase ? 'address-area' : 'address-detail'

    return (
      <View className='address-picker'>
        <View className='address' onClick={this.clickTo.bind(this, 'choose')}>
          {isObjectsValue(isAddress) ? (
            <View className='address-picker__bd'>
              <View className='address-receive'>
                <View className='info-trade'>
                  <View className='address-detail'>
                    {isAddress.is_def && <View className='def'>{$t('73700ece.18c634')}</View>}
                    {isAddress.province}
                    {isAddress.city}
                    {isAddress.county}
                    {isAddress.adrdetail}
                  </View>
                  <View className='user-info-trade'>
                    <Text className='name'>{isAddress.username}</Text>
                    <Text>{isAddress.telephone}</Text>
                  </View>
                </View>
              </View>
              <View className='sp-cell__ft-icon iconfont icon-arrowRight'></View>
            </View>
          ) : (
            <View className='address-info__bd'>{$t('73700ece.2b35be')}</View>
          )}
        </View>
      </View>
    )
  }
}

export default connect(
  ({ user }) => ({
    address: user.address
  }),
  (dispatch) => ({
    updateChooseAddress: (address) =>
      dispatch({ type: 'user/updateChooseAddress', payload: address })
  })
)(withTranslation()(AddressChoose))
