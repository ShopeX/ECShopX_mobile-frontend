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
import { Button, View, Image } from '@tarojs/components'
import './index.scss'

export default class BaShareMenu extends Component {
  static options = {
    addGlobalClass: true
  }
  static defaultProps = {
    showPosterBtn: true,
    onClick: () => {}
  }
  constructor(props) {
    super(props)
    this.state = {
      ...this.state
    }
  }
  handlePoster(e) {
    const { onCreatePoster } = this.props
    onCreatePoster()
  }

  render() {
    const { showPosterBtn, entry_form } = this.props
    return (
      <View className='share-menu__mask'>
        <View className='share-menu__option'>
          <View className='close-share'>
            <View
              className='in-icon in-icon-close'
              onClick={() => this.props.onClick(false)}
            ></View>
          </View>
          <View className='option-btn'>
            <View className='option-btn__item'>
              <View className='share-menu'>
                <Image
                  mode='widthFix'
                  className='share-menu__img'
                  src='https://bbc-espier-images.amorepacific.com.cn/image/2/2020/12/14/fcdd2ee967312c2add90fd6eb10acb1eF2Tt2Awa44mgXPiVViVTxwjthVPLZK1o'
                />
                {entry_form &&
                ['single_chat_tools', 'group_chat_tools'].includes(entry_form.entry) ? (
                  <Button onClick={this.props.onShareMessage} className='share-friend'>
                    {' '}
                  </Button>
                ) : (
                  <Button open-type='share' className='share-friend'>
                    {' '}
                  </Button>
                )}
              </View>
              <View className='text'>分享给好友</View>
            </View>
            {showPosterBtn && (
              <View className='option-btn__item'>
                <View className='share-menu' onClick={this.handlePoster}>
                  <Image
                    mode='widthFix'
                    className='share-menu__img'
                    src='https://bbc-espier-images.amorepacific.com.cn/image/2/2020/12/14/fcdd2ee967312c2add90fd6eb10acb1eavvEiC6QtSODTxH6qmXR9TtGCT8XOcGG'
                  />
                </View>
                <View className='text'>生成分享图片</View>
              </View>
            )}
          </View>
        </View>
      </View>
    )
  }
}
