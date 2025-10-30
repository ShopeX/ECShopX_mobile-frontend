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
import { toggleTouchMove } from '@/utils/dom'
import { getQueryVariable } from '@/utils'

import './header-home.scss'

export default class HeaderHome extends Component {
  static defaultProps = {
    storeName: null,
    isOpenScanQrcode: 2
  }

  constructor(props) {
    super(props)

    this.state = {
      searchValue: '',
      historyList: [],
      isShowAction: false
    }
  }

  static options = {
    addGlobalClass: true
  }

  componentDidMount() {
    if (process.env.TARO_ENV === 'h5') {
      toggleTouchMove(this.refs.container)
    }
  }

  handlePickStore = () => {
    if (this.props.onClickItem) {
      this.props.onClickItem()
    }
    Taro.navigateTo({
      url: '/subpages/store/list'
    })
  }

  handleScanCode = () => {
    Taro.scanCode().then((res) => {
      var scene = decodeURIComponent(res.path)
      var path = scene.replace('pages/', '')
      path = path.replace('scene=', '')
      //格式化二维码参数
      const query = getQueryVariable(path)
      if (query.cid && query.t) {
        Taro.navigateTo({
          url: `/others/pages/auth/index?cid=${query.cid}&token=${query.t}`
        })
      } else {
        Taro.navigateTo({
          url: path
        })
      }
    })
  }

  render() {
    const { store = {}, isOpenScanQrcode, isOpenStoreStatus } = this.props
    const isNoStores = isOpenStoreStatus ? false : true
    return (
      <View className='home-header'>
        <View className='nearly-shop'>
          {/* {isNoStores && store.addressdetail ? ( */}
          <View
            className='shop-view view-flex-item view-flex view-flex-middle'
            onClick={this.handlePickStore.bind(this)}
          >
            <View className='iconfont icon-periscope'></View>
            <View className='shop-name'>{store.addressdetail || '选择地址'}</View>
            <View className='icon-arrowDown'></View>
          </View>
          {/* ) : (
            <View className='shop-view view-flex-item view-flex view-flex-middle'></View>
          )} */}

          {/* {Taro.getEnv() !== 'WEB' && isOpenScanQrcode == 1 && (
            <View className='scancode' onClick={this.handleScanCode.bind(this)}>
              <Text className='iconfont icon-scan'></Text>
            </View>
          )} */}
        </View>
      </View>
    )
  }
}
