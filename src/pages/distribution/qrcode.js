import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import api from '@/api'

import './qrcode.scss'

export default class DistributionQrcode extends Component {
  constructor (props) {
    super(props)

    this.state = {
      info: {}
    }
  }

  componentDidMount () {
    Taro.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#2f3030'
    })
    this.fetch()
  }

  async fetch () {
    const { username, avatar } = Taro.getStorageSync('userinfo')
    let { isOpenShop, status } = this.$router.params
    isOpenShop = JSON.parse(isOpenShop)
    status = JSON.parse(status)
    const url = isOpenShop && status ? 'pages/distribution/shop-home' : 'pages/index'
    const res = await api.distribution.qrcode({path: url})
    const { qrcode } = res

    this.setState({
      info: {
        username,
        avatar,
        qrcode
      }
    })
  }

  render () {
    const { info } = this.state

    return (
      <View className='page-distribution-qrcode'>
        <View className="qrcode-bg">
          <View className="title">邀请卡</View>
          <Image
            className="avatar"
            src={info.avatar}
            mode="aspectFit"
          />
          <View className="name">{info.username}</View>
          <View className="welcome-words">邀你一起加入，推广赢奖励</View>
          <View className="qrcode">
            <Image src={info.qrcode} mode="aspectFit" />
          </View>
          <View className="tips">微信扫一扫或长按识别</View>
        </View>
      </View>
    )
  }
}
