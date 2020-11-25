import req from './req'

export function automatic (params = {}) {
  return req.get('/promotion/register', params)
}

export function getpluspriceList (params = {}) {
  return req.get('/promotion/pluspricebuy/getItemList', params)
}
