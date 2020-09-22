/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 助力首页
 * @FilePath: /unite-vshop/src/boost/pages/home/index.js
 * @Date: 2020-09-22 14:08:32
 * @LastEditors: Arvin
 * @LastEditTime: 2020-09-22 14:31:15
 */
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.scss'

export default class Home extends Component {
  render () {
    return (
      <View className='home'>
        助力首页
      </View>
    )
  }
}