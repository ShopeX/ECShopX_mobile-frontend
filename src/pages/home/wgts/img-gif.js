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
import { View, Image } from '@tarojs/components'
import { SpImg } from '@/components'
import './img-gif.scss'

export default class WgtImgGif extends Component {
  static options = {}

  static defaultProps = {
    info: {}
  }

  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    const { info } = this.props
    if (!info) {
      return null
    }

    return (
      <View className={`img-gif-index ${info.base.padded ? 'wgt__padded' : null}`}>
        <View className='imglist' style={`background:url(${info.data && info.data[0].imgUrl})`}>
          <SpImg
            img-class='scale-placeholder gif'
            src={info.data && info.data[1].imgUrl}
            mode='widthFix'
            width='750'
            lazyLoad
          />
        </View>
      </View>
    )
  }
}
