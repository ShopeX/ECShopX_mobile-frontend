import req from './req'

export function getList (params) {
  return req.get('/vipgrades/newlist', params)
}
