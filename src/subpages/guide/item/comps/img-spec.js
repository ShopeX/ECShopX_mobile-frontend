/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 说明
 * @FilePath: /unite-vshop/src/pages/item/comps/img-spec.js
 * @Date: 2020-06-09 16:05:37
 * @LastEditors: Arvin
 * @LastEditTime: 2020-07-07 10:18:03
 */
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Image, ScrollView, Text } from '@tarojs/components'
import { classNames } from '@/utils'

import './img-spec.scss'

export default class ImgSpec extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null
  }

  handleSepcClick = (index) => {
    this.props.onClick(index)
  }

  render() {
    const { info, current, onClick } = this.props
    if (!info) {
      return null
    }

    return (
      <View className='goods-sec-specs'>
        <ScrollView className='specs-scroller' scrollX>
          <View className='specs-imgs'>
            <Text>{info.length}色可选</Text>
            {info.map((item, index) => {
              return (
                <Image
                  className={classNames(
                    'specs-imgs__item',
                    current === index && 'specs-imgs__item-active'
                  )}
                  src={item.url}
                  key={item.specValueId}
                  mode='aspectFill'
                  onClick={this.handleSepcClick.bind(this, index)}
                />
              )
            })}
          </View>
        </ScrollView>
      </View>
    )
  }
}
