import req from './req'

export function login (data) {
  return req.post('http://pjj.aixue7.com/index.php/api/h5app/wxapp/login?company_id=1', data)
}

export function logout () {
  return req.post('/user.logout')
}

export function refreshToken () {
  return req.get('http://pjj.aixue7.com/index.php/api/h5app/wxapp/token/refresh')
}

export function reg (data) {
  // return req.post('http://pjj.aixue7.com/index.php/api/weapp/deposit/rechargeruleshttp://api.espier.local/index.php/api/h5app/wxapp/member', data)
  return req.post('http://pjj.aixue7.com/index.php/api/h5app/wxapp/member', data)
}

export function regImg (params = {}) {
  // return req.post('http://pjj.aixue7.com/index.php/api/weapp/deposit/rechargeruleshttp://api.espier.local/index.php/api/h5app/wxapp/member', data)
  return req.get('http://pjj.aixue7.com/index.php/api/h5app/wxapp/member/image/code', params)
}

export function regParam () {
  // return req.post('http://pjj.aixue7.com/index.php/api/weapp/deposit/rechargeruleshttp://api.espier.local/index.php/api/h5app/wxapp/member', data)
  return req.get('http://pjj.aixue7.com/index.php/api/h5app/wxapp/member/setting')
}

export function info () {
  return req.get('http://pjj.aixue7.com/index.php/api/h5app/wxapp/member/setting')
}
