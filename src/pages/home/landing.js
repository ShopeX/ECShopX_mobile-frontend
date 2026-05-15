/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from 'react-redux'
import { normalizeQuerys } from '@/utils'
import { $t } from '@/i18n'

import './landing.scss'

class Landing extends Component {
  $instance = getCurrentInstance() || {}
  constructor(props) {
    super(props)

    this.state = {
      ...this.state
    }
  }
  async componentDidMount() {
    const query = await normalizeQuerys(this.$instance?.router?.params)

    this.props.onUserLanding(query)

    this.fetch()
  }

  async fetch() {
    Taro.redirectTo({
      url: '/subpages/auth/reg'
    })
  }

  render() {
    return (
      <View className='page-member-integral'>
        <View>{$t('033e746d.4d484f')}</View>
      </View>
    )
  }
}

export default connect(
  () => ({}),
  (dispatch) => ({
    onUserLanding: (land_params) => dispatch({ type: 'user/landing', payload: land_params })
  })
)(withTranslation()(Landing))
