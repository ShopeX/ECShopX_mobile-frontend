import req from './req'

const getAppId = () => {
  const { appid } = wx.getExtConfigSync? wx.getExtConfigSync(): {}
  return appid
}

export function login (data) {
  return req.post('/login', data)
}

export function logout () {
  return req.post('/user.logout')
}

export function refreshToken () {
  return req.get('/token/refresh')
}

export function reg (params) {
  const appid = getAppId()
  return req.post('/member', {
    ...params,
    appid
  })
}

export function regRule () {
  return req.get('/member/agreement')
}

export function regImg (params = {}) {
  return req.get('/member/image/code', params)
}

export function regSmsCode (params = {}) {
  return req.get('/member/sms/code', params)
}

export function regParam () {
  return req.get('/member/setting')
}

export function info () {
  return { data: {} }
  // return req.get('/member/setting')
}

export function forgotPwd (params = {}) {
  return req.post('/member/reset/password', params)
}

export function prelogin (data) {
  return req.post('/prelogin', data)
}

export function checkpclogin (data) {
  return req.post('/oauthlogin', data)
}

export function pclogin (data) {
  return req.post('/oauth/login/authorize', data)
}

export function reg_pclogin (data) {
  return req.post('/member/decryptPhoneOauth', data)
}

export function registrationActivity (data) {
  return req.get('/registrationActivity', data)
}

export function registrationSubmit (data) {
  return req.post('/registrationSubmit', data)
}

export function registrationRecordList (data) {
  return req.get('/registrationRecordList', data)
}

export function registrationRecordInfo (data) {
  return req.get('/registrationRecordInfo', data)
}

export function scancodeAddcart (data) {
  return req.post('/goods/scancodeAddcart', data)
}

export function newWxaMsgTmpl (params = {}) {
  return req.get('/newtemplate', params)
}

export function storeReg (data) {
  return req.post('/distributor', data)
}
// 客服 
export function im (id) {
  return req.get(`/im/meiqia/distributor/${id}`)
}

// 客服默认配置
export function imConfig () {
  return req.get(`/im/meiqia`)
}

// 客服默认配置
export function echatConfig () {
  return req.get(`/im/echat`)
}

// 扫码登录
export function codeAuth (param = {}) {
  return req.post('/oauthlogin', param)
}

// 确认登录
export function codeAuthConfirm (param = {}) {
  return req.post('/oauth/login/authorize', param)
}

// 订阅到货通知
export function subscribeGoods (item_id) {
  return req.post(`/member/subscribe/item/${item_id}`)
}

// 检测是否订阅
export function isSubscribeGoods (item_id) {
  return req.get(`/member/item/is_subscribe/${item_id}`)
}
