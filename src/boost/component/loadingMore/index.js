// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
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
import React, { Component } from 'react'
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
