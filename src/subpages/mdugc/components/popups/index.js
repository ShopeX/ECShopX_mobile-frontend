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
import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { SpImg } from '@/components'

//import '../../font/iconfont.scss'
// import '../../../../src/assets/font/iconfont.scss'
import './index.scss'

export default class popups extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  onlast = (islast) => {
    console.log('islast', islast)
    this.props.Last(islast)
  }
  render() {
    const { title, text, closetext = '取消', showtext = '确认', istext = false } = this.props

    return (
      <View className='popups'>
        <View className='popups_cen'>
          <View className={`popups_cen_b ${istext ? 'text' : ''}`}>
            {/* <View className='popups_cen_b_icon'>
                        <View className='iconfont icon-logo'></View>
                    </View> */}
            <View className='popups_cen_b_text'>
              <View className='popups_cen_b_text_t'>{title}</View>
              {istext ? (
                <View className='popups_cen_b_text_b'>
                  {text.map((item, index) => {
                    return (
                      <View className='popups_cen_b_text_b_i' key={index}>
                        <View className={`popups_cen_b_text_b_i_l ${index == 0 ? 'blue' : 'red'}`}>
                          <View className={`iconfont ${item.icon} `}></View>
                        </View>
                        <View className='popups_cen_b_text_b_i_r'>
                          <View className='popups_cen_b_text_b_i_r_text'>{item.text}</View>
                          <View className='popups_cen_b_text_b_i_r_num'>{item.num}</View>
                        </View>
                      </View>
                    )
                  })}
                </View>
              ) : (
                <View className='popups_cen_b_text_b cen'>{text}</View>
              )}
            </View>
            {!istext ? (
              <View className='popups_cen_b_btn'>
                <View
                  className='popups_cen_b_btn_l popups_cen_b_btn_i'
                  onClick={this.onlast.bind(this, 1)}
                >
                  {closetext}
                </View>
                <View
                  className='popups_cen_b_btn_r popups_cen_b_btn_i'
                  onClick={this.onlast.bind(this, 2)}
                >
                  {showtext}
                </View>
              </View>
            ) : null}
            <View
              onClick={this.onlast.bind(this, 3)}
              className='popups_cen_b_close iconfont  icon-guanbi2'
            ></View>
          </View>
        </View>
      </View>
    )
  }
}
