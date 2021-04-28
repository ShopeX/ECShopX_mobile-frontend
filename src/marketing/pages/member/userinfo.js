/*
 * @Author: PrendsMoi
 * @GitHub: https://github.com/PrendsMoi
 * @Blog: https://liuhgxu.com
 * @Description: 说明
 * @FilePath: /unite-vshop/src/marketing/pages/member/userinfo.js
 * @Date: 2021-04-28 14:13:43
 * @LastEditors: PrendsMoi
 * @LastEditTime: 2021-04-28 15:10:58
 */
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { NavBar } from '@/components'
import api from '@/api'
// import { withLogin } from '@/hocs'
import S from '@/spx'
import { connect } from "@tarojs/redux"

import './userinfo.scss'

@connect(( { colors } ) => ({
  colors: colors.current
}), () => ({}))
// @withLogin()

export default class UserInfo extends Component {
  constructor (props) {
    super(props)

    this.state = {
      userInfo: {}
    }
  }

  componentDidMount () {
    // this.fetch()
  }

  config = {
    navigationBarTitleText: '个人信息'
  }

  // 退出登录
  loginOut = () => {
    S.logout()
  }

  // 保存用户信息
  saveInfo = (e) => {
    e && e.stopPropagation()
    console.log('saveInfo')
  }

  render () {
    // const { isHasAvator, info, imgs, isHasData, list, option_list, showCheckboxPanel } = this.state
    const { colors } = this.props
    return (
      <View className='page-member-setting'>
        <NavBar
          title='用户信息'
        />
        <View className='btns'>
          <View className='btn loginOut' onClick={this.loginOut.bind(this)}>退出登录</View>
          <View
            className='btn save'
            style={`background: ${colors.data[0].primary}`}
            onClick={this.saveInfo.bind(this)}
          >
            保存
          </View>
        </View>
      </View>
    )
  }
}
