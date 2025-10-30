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
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { classNames } from '@/utils'
import './plate-type.scss'

export default class WgtPlateType extends Component {
  static options = {}

  static defaultProps = {
    info: {},
    index: '',
    num: '',
    base: {}
  }

  constructor(props) {
    super(props)
    this.state = {
      nowIndex: ''
    }
  }

  render() {
    const { info, index, num, base } = this.props
    let style = `color:${base.WordColor};border-color:${base.WordColor}`

    return (
      <View className='index'>
        {/* 模板一 */}
        {info.template === 'one' && (
          <View className={classNames('template1', 'noe')}>
            <View className={classNames('li_a', index === num ? 'li_aa' : '')} style={style}>
              {info.mainTitle}
            </View>
            <View className={classNames('li_b', index === num ? 'li_bb' : '')} style={style}>
              {info.subtitle}
            </View>
            <View className={classNames('li_c', index === num ? 'li_cc' : '')} style={style}>
              {info.subtitleTow}
            </View>
            {info.button && (
              <View className={classNames('li_d', index === num ? 'li_dd' : '')} style={style}>
                {info.button}
              </View>
            )}
          </View>
        )}
        {/* 模板二 */}
        {info.template === 'two' && (
          <View className={classNames('template1', 'two')}>
            <View className={classNames('li_b', index === num ? 'li_aa' : '')} style={style}>
              {info.mainTitle}
            </View>
            <View className={classNames('li_a', index === num ? 'li_bb' : '')} style={style}>
              {info.subtitle}
            </View>
            <View className={classNames('li_c', index === num ? 'li_cc' : '')} style={style}>
              {info.subtitleTow}
            </View>
            {info.button && (
              <View className={classNames('li_d', index === num ? 'li_dd' : '')} style={style}>
                {info.button}
              </View>
            )}
          </View>
        )}

        {/* 模板三*/}
        {info.template === 'three' && (
          <View className={classNames('template1', 'three')}>
            <View className={classNames('li_b', index === num ? 'li_aa' : '')} style={style}>
              {info.mainTitle}
            </View>
            <View className={classNames('li_a', index === num ? 'li_bb' : '')} style={style}>
              {info.subtitle}
            </View>
            <View className={classNames('li_c', index === num ? 'li_cc' : '')} style={style}>
              {info.subtitleTow}
            </View>
            {info.button && (
              <View className={classNames('li_d', index === num ? 'li_dd' : '')} style={style}>
                {info.button}
              </View>
            )}
          </View>
        )}

        {/* 模板四*/}
        {info.template === 'four' && (
          <View className={classNames('template1', 'four')}>
            <View className={classNames('li_b', index === num ? 'li_aa' : '')} style={style}>
              {info.mainTitle}
            </View>
            <View className={classNames('li_a', index === num ? 'li_bb' : '')} style={style}>
              {info.subtitle}
            </View>
            {info.button && (
              <View className={classNames('li_d', index === num ? 'li_cc' : '')} style={style}>
                {info.button}
              </View>
            )}
          </View>
        )}
      </View>
    )
  }
}
