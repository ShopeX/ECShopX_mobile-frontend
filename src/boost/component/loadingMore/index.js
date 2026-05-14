/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
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
import { $t } from '@/i18n'
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
        {isEmpty && !isLoading && <View className='empty'>{$t('e46c7606.21efd8')}</View>}
        {isEnd && !isEmpty && !isLoading && <View className='isEnd'>{$t('e46c7606.a19d66')}</View>}
      </View>
    )
  }
}
