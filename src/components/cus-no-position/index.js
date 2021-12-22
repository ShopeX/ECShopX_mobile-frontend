import { Component } from 'react'
import { connect } from "redux";
import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'

import { PrivacyConfirmModal } from '@/components'
import api from '@/api'

import './index.scss'

@connect(({ colors }) => ({
  colors: colors.current || { data: [{}] }
}))
export default class StoreListItem extends Component {
  
  constructor (props) {
    super(props)
    this.state = {
      PrivacyVisible: false,
      update_time: null
    }

  }
  static defaultProps = {
    onClick: () => {}
  }

  static options = {
    addGlobalClass: true
  }

  async componentDidMount () {
    const result = await api.wx.getPrivacyTime()
    const { update_time } = result
    this.setState({ update_time })
  }

  handleClick = () => {
    const { update_time } = this.state
    const privacy_time = Taro.getStorageSync("policy_updatetime");
    if ((!String(privacy_time) || privacy_time != update_time)) {
      this.setState({
        PrivacyVisible: true
      })
    } else {
      this.props.onClick && this.props.onClick()
    }
  }

  // 隐私协议
  onPrivacyChange = async (type) => {
    if (type === 'agree') {
      const result = await api.wx.getPrivacyTime()
      const { update_time } = result

      Taro.setStorageSync("policy_updatetime", update_time);
      this.props.onClick && this.props.onClick()
    } else {
      Taro.removeStorageSync("policy_updatetime");
      Taro.removeStorageSync('token')
    }
    this.setState({
      PrivacyVisible: false
    })
  }

  render() {
    const { info, isStore, colors } = this.props
    const { PrivacyVisible } = this.state
    return (
      <View className='cus-no-position'>
        {this.props.children}
        <View className='position-title'>未授权位置信息，请授权定位</View>
        <View className='position-btn' onClick={this.handleClick}>直接授权定位</View>
        {/* 隐私弹窗 */}
        <PrivacyConfirmModal
          visible={PrivacyVisible}
          onChange={this.onPrivacyChange}
          isPhone={false}
        />
      </View>
    )
  }
}
