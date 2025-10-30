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
import { Image } from '@tarojs/components'
import { classNames } from '@/utils'
import './index.scss'

export default class SpImg extends Component {
  static defaultProps = {
    onLoad: () => {},
    onError: () => {}
  }

  static options = {
    addGlobalClass: true
  }

  static externalClasses = ['img-class']

  render() {
    const { disk_driver = 'qiniu' } = Taro.getStorageSync('otherSetting') || {}
    const {
      src,
      mode,
      lazyLoad,
      onLoad,
      onError,
      width,
      height,
      // 缩放模式
      m,
      // 最长边
      l,
      // 最短边
      s,
      // 大于原图是否处理
      limit,
      // 填充
      color,
      // 按比例
      p
    } = this.props

    if (!src) return null

    let url = src

    if (disk_driver === 'oss') {
      // 处理阿里云的图片缩放参数
      const mod = m ? `m_${m},` : ''
      const w = width ? `w_${width},` : ''
      const h = height ? `h_${height},` : ''
      const ll = l ? `l_${l},` : ''
      const ss = s ? `s_${s},` : ''
      const lim = limit ? `limit_${limit},` : ''
      const col = color ? `color_${limit},` : ''
      const per = p ? `p_${p},` : ''
      // 是否需要处理
      const isMode = mod || width || height || ll || ss || lim || col || per
      url += isMode ? `?x-oss-process=image/resize,${mod}${w}${h}${ll}${ss}${lim}${col}${per}` : ''
    } else if (disk_driver === 'qiniu') {
      url +=
        width || height
          ? `?imageView2/2${width ? '/w/' + width : ''}${height ? '/h/' + height : ''}`
          : ''
    }

    const imgClass = Taro.getEnv() !== 'WEB' ? 'img-class' : this.props['img-class']

    return (
      <Image
        className={classNames(`sp-img`, imgClass)}
        src={url}
        mode={mode}
        onError={onError}
        onLoad={onLoad}
        lazyLoad={lazyLoad}
      />
    )
  }
}
