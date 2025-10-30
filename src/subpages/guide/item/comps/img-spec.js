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
 * @Description: 说明
 * @FilePath: /unite-vshop/src/pages/item/comps/img-spec.js
 * @Date: 2020-06-09 16:05:37
 * @LastEditors: Arvin
 * @LastEditTime: 2020-07-07 10:18:03
 */
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
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
