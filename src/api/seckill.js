import req from './req'

export function seckillList (params = {}) {
  // return req.get('/item.search', params)
  return req.get('/promotion/seckillactivity/getlist', params)
}
