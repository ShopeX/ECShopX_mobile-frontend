/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 说明
 * @FilePath: /unite-vshop/src/pages/item/comps/vip-guide.js
 * @Date: 2020-11-19 14:22:17
 * @LastEditors: PrendsMoi
 * @LastEditTime: 2021-03-05 13:54:30
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
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
      url: `/subpage/pages/vip/vipgrades?grade_name=${info.vipgrade_name}`
    })
  }

  render () {
    const { info } = this.props

    if (!info) {
      return null
    }

    let price = info.memberPrice
    if (info.type == '1') {
      const taxRate = (Number(info.tax_rate || 0) / 100)
      price = Math.floor((price * 100) * (1 + taxRate)) / 100
    }

    return (
      <View className='vip-guide'>
        <View className='vip-guide-content'>
          <View className='vip-price'>
            {
              info.gradeDiscount &&
                <View className='vip-tag'>
                  {info.vipgrade_desc}
                </View>
            }
            {
              (info.memberPrice || info.gradeDiscount) &&
                <View className='vip-price-amount'>
                  {
                    info.memberPrice &&
                      <View className='vip-price-amount'><Text className='cur'>¥ </Text>{price}</View>
                  }
                  {
                    info.gradeDiscount &&
                      <View>{info.gradeDiscount}折</View>
                  }
                </View>
            }
          </View>
          <View className='vip-guide-text'>{info.guide_title_desc}</View>
        </View>
        <View className='vip-apply' onClick={this.handleClick.bind(this)}>立即加入</View>
      </View>
    )
  }
}
