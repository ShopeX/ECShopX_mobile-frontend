import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import S from '@/spx'

import './vip-guide.scss';

export default class VipGuide extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null
  }

  handleClick = () => {
    if (!S.getAuthToken()) {
      S.toast('请先登录')

      setTimeout(() => {
        S.login(this)
      }, 2000)

      return
    }

    const { info } = this.props

    Taro.navigateTo({
      url: `/pages/vip/vipgrades?grade_name=${info.vipgrade_name}`
    })
  }

  render () {
    const { info } = this.props

    if (!info) {
      return null
    }

    return (
      <View className="vip-guide">
        <View className="vip-guide-content">
          <View className="vip-price">
            {
              info.gradeDiscount &&
                <View className="vip-tag">
                  {info.vipgrade_desc}
                </View>
            }
            {
              (info.memberPrice || info.gradeDiscount) &&
                <View className="vip-price-amount">
                  {
                    info.memberPrice &&
                      <View className="vip-price-amount"><Text className="cur">¥ </Text>{info.memberPrice}</View>
                  }
                  {
                    info.gradeDiscount &&
                      <View>{info.gradeDiscount}折</View>
                  }
                </View>
            }
          </View>
          <View className="vip-guide-text">{info.guide_title_desc}</View>
        </View>
        <View className="vip-apply" onClick={this.handleClick.bind(this)}>立即加入</View>
      </View>
    )
  }
}
