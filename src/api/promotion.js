import req from './req'

export function automatic (params = {}) {
  return req.get('/promotion/register', params)
}

export function getpluspriceList (params = {}) {
  return req.get('/promotion/pluspricebuy/getItemList', params)
}

// 开屏广告
export function getScreenAd (params = {}) {
  return req.get('/openscreenad', params)
}

//增加扫码日志
export function logQrcode (params) {
  return req.post('/promoter/qrcode/log', params)
}
