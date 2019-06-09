import req from './req'

export function get () {
  return req.get('/goods/category')
}

export function getCategory (params = {}) {
  return req.get('/pageparams/setting', params)
}
