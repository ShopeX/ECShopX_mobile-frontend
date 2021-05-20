import Taro from '@tarojs/taro'
import req from './req'
import { getYoushuAppid } from '@/utils/youshu'

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

export function getYoushuOpenid (params) {
  return req.post('/getopenid', {
    ...params, 
    appid:getYoushuAppid()
  }, { showError: false })
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

export function newMarketing () {
  return req.get('/promotion/getMemberCard')
}

export function newlogin (params) {
  const appid = getAppId()
  return req.post('/new_login', {
    ...params,
    appid,
    auth_type: 'wxapp'
  }, { showError: false })
}

export function prelogin(params) {
  const appid = getAppId();
  return req.post("/prelogin", {
    ...params,
    appid,
    auth_type: "wxapp"
  });
}

// export function prelogin (params) {
//   const appid = getAppId()
//   return req.post('/workwechatlogin', {
//     ...params,
//     appid,
//     auth_type: 'wxapp'
//   })
// }

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

// 获取shareid解析
export function getShareId (params) {
  return req.get('/getbyshareid', {
    ...params
  })
}

// 任务埋点上报
export function taskReportData (params) {
  return req.post('/salesperson/subtask/post', {
    ...params
  })
}

// 互动埋点上报
export function interactiveReportData (params) {
  return req.post('/salesperson/relationshipcontinuity', {
    ...params
  })
}