import req from './req'

export function search (params = {}) {
  // return req.get('/item.search', params)
  return req.get('/goods/items', params)
}

export function detail (item_id, params = {}) {
  return req.get(`/goods/items/${item_id}`, params)
}

export function desc (item_id) {
  return req.get('/item.desc', { item_id })
}

export function rateList (item_id) {
  return req.get('/item.rate.list', { item_id })
}

export function category () {
  return req.get('/category.itemCategory')
}


export function seckillCheck ({ item_id, num = 1, seckill_id }) {
  return req.get('/promotion/seckillactivity/geticket', {
    item_id,
    num,
    seckill_id
  })
}

export function seckillCancelCheck () {
  return req.delete('/promotion/seckillactivity/cancelTicket')
}

export function packageList (params = {}) {
  return req.get('/promotions/package', params)
}

export function packageDetail (item_id) {
  return req.get(`/promotions/package/${item_id}`)
}

export function evaluationList (params) {
  return req.get('/order/rate/list', params)
}

export function replyRate (params) {
  return req.post('/order/replyRate', params)
}

export function getEvaluationDetail (rate_id,params = {}){
  return req.get(`/order/rate/detail/${rate_id}`,params)
}
export function getreplyRateList (params = {}){
  return req.get(`/order/replyRate/list`,params)
}
export function getRatePraiseStatus (params = {}){
  return req.get(`/order/ratePraise/status`,params)
}

export function getDetailShare (params) {
  return req.post('/salesperson/task/share', params)
}

//  获取分享配置 
export function getShareSetting (id) {
  return req.get(`/goods/share/items/${id}`)
}
