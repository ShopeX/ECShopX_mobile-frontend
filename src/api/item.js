import req from './req'

export function search (params = {}) {
  // return req.get('/item.search', params)
  return req.get('http://pjj.aixue7.com/index.php/api/h5app/wxapp/goods/items', params)
}

export function detail (item_id, params = {}) {
  // return req.get('/item.detail', { item_id, ...params })
  return req.get(`http://pjj.aixue7.com/index.php/api/h5app/wxapp/goods/items/${item_id}`, params)
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