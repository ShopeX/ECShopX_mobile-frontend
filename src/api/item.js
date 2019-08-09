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

export function groupList (params) {
  return req.get('/promotions/groups', params)
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
