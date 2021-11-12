/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 最近购买者
 * @FilePath: /feat-Unite-group-by/src/groupBy/component/buyerItem/index.js
 * @Date: 2020-04-24 18:10:15
 * @LastEditors: Arvin
 * @LastEditTime: 2020-04-26 15:01:01
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import './index.scss'

export default class BuyerItem extends Component {
  static defaultProps = {
    // 是否是最后一个
    last: false,
    info: {
      num: 1
    }
  }

  constructor(props) {
    super(props)
  }

  render() {
    const { info, last } = this.props

    return (
      <View className={`buyerItem ${last ? 'last' : ''}`}>
        <Image
          className='avatar'
          src='https://pic1.zhimg.com/v2-d8bbab30a2a4db2fe03213ef3f9b50e8_r.jpg'
        />
        <View className='info'>
          <View className='desc'>某某某刚刚购买了</View>
          <View className='goodName'>购买了啥啥哈哈</View>
        </View>
        <View>X{info.num}</View>
      </View>
    )
  }
}
