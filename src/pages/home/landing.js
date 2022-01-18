import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from 'react-redux'
import { normalizeQuerys } from '@/utils'

import './landing.scss'

@connect(
  () => ({}),
  (dispatch) => ({
    onUserLanding: (land_params) => dispatch({ type: 'user/landing', payload: land_params })
  })
)
export default class Landing extends Component {
  $instance = getCurrentInstance()
  constructor (props) {
    super(props)

    this.state = {
      ...this.state
    }
  }
  async componentDidMount () {
    const query = await normalizeQuerys(this.$instance.router.params)

    this.props.onUserLanding(query)

    this.fetch()
  }

  async fetch () {
    Taro.redirectTo({
      url: '/subpages/auth/reg'
    })
  }

  render () {
    return (
      <View className='page-member-integral'>
        <View>跳转中...</View>
      </View>
    )
  }
}
