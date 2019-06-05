import req from './req'

export function login (data) {
  return req.post('/login', data)
}

export function logout () {
  return req.post('/user.logout')
}

export function refreshToken () {
  return req.get('/token/refresh')
}

export function reg (data) {
  return req.post('/member', data)
}

export function regRule () {
  return req.get('/member/agreement')
}

export function regImg (params = {}) {
  // return req.post('http://pjj.aixue7.com/index.php/api/weapp/deposit/rechargeruleshttp://api.espier.local/index.php/api/h5app/wxapp/member', data)
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
