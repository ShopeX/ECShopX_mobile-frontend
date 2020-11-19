/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 说明
 * @FilePath: /unite-vshop/src/pages/home/landing.js
 * @Date: 2020-11-19 14:22:17
 * @LastEditors: Arvin
 * @LastEditTime: 2020-11-19 15:32:50
 */

import Taro, { Component } from '@tarojs/taro'
import {View } from '@tarojs/components'
import { connect } from "@tarojs/redux";
import { normalizeQuerys } from '@/utils'

import './landing.scss'
@connect(() => ({}), (dispatch) => ({
  onUserLanding: (land_params) => dispatch({ type: 'user/landing', payload: land_params })
}))
export default class Landing extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
    }
  }
  componentDidMount () {
    const query = normalizeQuerys(this.$router.params)

    this.props.onUserLanding(query)

    this.fetch()
  }

  async fetch () {
    Taro.redirectTo({
      url: '/subpage/pages/auth/reg'
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
