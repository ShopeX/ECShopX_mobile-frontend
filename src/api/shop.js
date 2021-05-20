import req from './req'

export function getShop (params = {}) {
  return req.get('/distributor/is_valid', params)
}

export function list (params = {}) {
  return req.get('/distributor/list', params)
}

export function getStoreStatus (params = {}) {
  return req.get('/nostores/getstatus', params)
}

// 获取首页配置
export function homeSetting (params = {
  type: 'frontend'
}) {
  return req.get('common/setting', params)
}

// 总店店铺信息及协议
export function getStoreBaseInfo (params = {}) {
  return req.get('/shops/info', params)
}


// 协议信息获取
export function getRuleInfo (params = {}) {
  return req.get('/shops/protocol', params)
}

// 获取总店信息
export function getHeadquarters (params = {}) {
  return req.get('/distributor/self', params)
}