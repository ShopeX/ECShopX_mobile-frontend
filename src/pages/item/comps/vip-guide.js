import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

import './vip-guide.scss';

export default class VipGuide extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null
  }

  handleClick = () => {
    Taro.navigateTo({
      url: '/pages/vip/vipgrades'
    })
  }

  render () {
    const { info } = this.props
    
    if (!info) {
      return null
    }

    const { memberPrice = 0 } = info
    let price = null
    if (memberPrice) {
      price = (memberPrice/100).toFixed(2)
    }

    return (
      <View className="vip-guide">
        <View className="vip-guide-content">
          {
            info.memberPrice &&
              <View className="vip-price">
                <View className="vip-tag">
                  {info.vipgrade_desc}
                </View>
                {
                  (info.memberPrice || info.gradeDiscount) &&
                    <View>
                      {
                        info.memberPrice &&
                          <View className="vip-price-amount"><Text className="cur">¥ </Text>{price}</View>
                      }
                      {info.gradeDiscount && <View>{info.gradeDiscount}折</View>}
                    </View>
                }
              </View>
          }
          <View className="vip-guide-text">{info.guide_title_desc}</View>
        </View>
        {
          info.memberPrice &&
            <View className="vip-apply" onClick={this.handleClick.bind(this)}>立即加入</View>
        }
      </View>
    )
  }
}
