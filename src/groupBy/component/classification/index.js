/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 分类组件
 * @FilePath: /unite-vshop/src/groupBy/component/classification/index.js
 * @Date: 2020-06-12 13:27:40
 * @LastEditors: Arvin
 * @LastEditTime: 2020-06-22 17:14:11
 */

import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import './index.scss'

export default class Classification extends Component {
  static defaultProps = {
    list: []
  }

  constructor(props) {
    super(props)
  }

  render() {
    const { list } = this.props
    return (
      <View className='classification'>
        {list.map((item) => (
          <View className='menuItem' key={item}>
            <Image className='img' src='https://picsum.photos/id/1036/200/200' />
            <View className='name'>菜单{item}</View>
          </View>
        ))}
      </View>
    )
  }
}
