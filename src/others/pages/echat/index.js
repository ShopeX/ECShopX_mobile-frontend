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
 * @FilePath: /unite-vshop/src/others/pages/echat/index.js
 * @Date: 2020-11-17 15:49:21
 * @LastEditors: Arvin
 * @LastEditTime: 2020-11-17 16:08:22
 */
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { WebView } from '@tarojs/components'

export default class MeiQia extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {}

  handleClose = () => {
    Taro.navigateBack()
  }

  render() {
    const echat = Taro.getStorageSync('echat')

    return echat && echat.echat_url && <WebView src={echat.echat_url}></WebView>
  }
}
