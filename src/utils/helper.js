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
import { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import configStore from '@/store'

const { store } = configStore()

export const transformTextByPoint = (isPoint = false, money, point) => {
  if (isPoint) {
    return ` ${point}${store.getState().sys.pointName}`
  }
  return ` ￥${money}`
}

export const getDtidIdUrl = (url, distributor_id) => {
  if (url.indexOf('dtid=') > -1) {
    return url
  }
  const isShareDtid = Taro.getStorageSync('distributor_param_status') == true
  if (isShareDtid) {
    return url + `&dtid=${distributor_id}`
  }
  return url
}

export default {}
