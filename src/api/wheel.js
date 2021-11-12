import req from './req'

// 大转盘获取
export function getTurntableconfig(params) {
  return req.get('/promotion/turntableconfig', params)
}

export function getTurntable(params = {}) {
  return req.get('/promotion/turntable', params)
}

// 登陆赠送抽奖次数
export function getLoginaddtimes(params = {}) {
  return req.get('/promotion/loginaddtimes', params)
}
