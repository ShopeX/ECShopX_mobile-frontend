/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 加载
 * @FilePath: /feat-Unite-group-by/src/groupBy/component/loadingMore/index.js
 * @Date: 2020-04-29 14:44:26
 * @LastEditors: Arvin
 * @LastEditTime: 2020-06-15 10:50:05
 */
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.scss'

export default class LoadingMore extends Component {
  static defaultProps = {
    // 加载中
    isLoading: false,
    // 没有更多了
    isEnd: false,
    // 无数据
    isEmpty: false
  }

  constructor(props) {
    super(props)
  }

  render() {
    const { isLoading, isEnd, isEmpty } = this.props
    return (
      <View className={`loadingMore ${isEmpty && 'empty'}`}>
        {isLoading && (
          <View className='lds-ellipsis'>
            <View className='div'></View>
            <View className='div'></View>
            <View className='div'></View>
            <View className='div'></View>
          </View>
        )}
        {isEmpty && !isLoading && <View className='empty'>暂无数据</View>}
        {isEnd && !isEmpty && !isLoading && <View className='isEnd'>-- 我也是有底线的 --</View>}
      </View>
    )
  }
}
