import { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import configStore from '@/store'

const store = configStore()

export const transformTextByPoint = (isPoint = false, money, point) => {
  if (isPoint) {
    return ` ${point}${store.getState().sys.pointName}`
  }
  return ` ￥${money}`
}

export const getDistributorId = () => {
  const { distributor_id, store_id } = Taro.getStorageSync('curStore') || {}
  const otherSetting = Taro.getStorageSync('otherSetting') || {}
  const id = otherSetting.nostores_status ? store_id : distributor_id
  return id
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
