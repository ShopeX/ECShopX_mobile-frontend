import Taro from '@tarojs/taro'
import req from './req'

const getAppId = () => {
  const { appid } = wx.getExtConfigSync? wx.getExtConfigSync(): {}
  return appid
}

export function info (data) {
  return req.post('/wx.info', data)
}

export function code (code) {
  return req.get('/wx.code', { code })
}

export function userInfo () {
  return req.get('/wx.user.info')
}

export function login (params) {
  const appid = getAppId()
  return req.post('/login', {
    ...params,
    appid,
    auth_type: 'wxapp'
  }, { showError: false })
}
export function wxworkLogin (params) {
  const appid = getAppId()
  return req.post('/workwechatlogin', {
    ...params,
    appid,
    auth_type: 'wxapp'
  }, { showError: false })
}
export function prelogin (params) {
  const appid = getAppId()
  return req.post('/workwechatlogin', {
    ...params,
    appid,
    auth_type: 'wxapp'
  })
}

export function decryptPhone (params) {
  const appid = getAppId()
  return req.get('/member/decryptPhone', {
    ...params,
    appid
  })
}

export function shareSetting (params) {
  return req.get('/share/setting', {
    ...params
  })
}
export function getWhiteList () {
  return req.get('/whitelist/status')
}