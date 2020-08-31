import req from './req'

export function get (params) {
  return req.get('/goods/category', params)
}

export function getCategory (params = {}) {
  return req.get('/pageparams/setting', params)
}
