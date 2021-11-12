import req from './req'

const getAppId = () => {
  const { appid } = Taro.getExtConfigSync ? Taro.getExtConfigSync() : {}
  return appid
}

export function login (data) {
  return req.post('/login', data)
}

// 绑定导购
export function bindSaleperson (data) {
  return req.post('/member/bindSalesperson', data)
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

export function regParam (params) {
  return req.get('/member/setting', params)
}

export function info () {
  return { data: {} }
  // return req.get('/member/setting')
}

export function forgotPwd (params = {}) {
  return req.post('/member/reset/password', params)
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

// 检测是否可以分享
export function getIsCanShare (param = {}) {
  return req.get('/goods/checkshare/items', param)
}

//ba导购端
export function getGuideInfo (params = {}) {
  return req.get('/guide/info', params)
}
export function getGuideShops (params = {}) {
  return req.get('/guide/shops', params)
}
//获取导购session_key -> 用户登录
export function getQwUserInfo (params = {}) {
  return req.post('/workwechatlogin', params)
}
// //导购登录
// export function getGuideShops(params = {}) {
//   return req.get("/workwechatlogin", params);
// }

//悦诗风呀 导购登录
// export function prelogin(data) {
//   return req.post("/prelogin", data);
// }
//云店-导购登录
// export function prelogin(params = {}) {
//   return req.get("/workwechatlogin", params);
// }
//更新用户详情
export function updateUserInfo (params) {
  return req.put('/updateWechatUserInfo', {
    ...params
  })
}

//记录导购被访问的UV
export function uniquevisito (params) {
  return req.post('/member/salesperson/uniquevisito', {
    ...params
  })
}

// 是否需要开启初次授权填写个人信息
export function getIsMustOauth (params) {
  return req.get('/espier/config/request_field_setting', params)
}
