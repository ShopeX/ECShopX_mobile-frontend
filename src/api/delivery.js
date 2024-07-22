import req from './req'

// 配送员首页统计
export function datacubeDeliverystaffdata (params = {}) {
  return req.get('/datacube/Deliverystaffdata', params)
}

// 配送员店铺列表
export function getDistributorList (params = {}) {
  return req.get('/selfdelivery/getDistributorList', params)
}

// 配送员店铺列表
export function datacubeDeliverystaffdataDetail (params = {}) {
  return req.get('/datacube/DeliverystaffdataDetail', params)
}

// 配送员我的
export function selfdeliveryList (params = {}) {
  return req.get('/selfdelivery/list', params)
}