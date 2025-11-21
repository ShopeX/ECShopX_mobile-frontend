/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
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
