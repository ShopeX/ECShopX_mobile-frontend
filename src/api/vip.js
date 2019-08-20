import req from './req'

export function getList (params) {
  return req.get('/vipgrades/newlist', params)
}
 
export function charge (params) {
	return req.post('/vipgrades/buy',params)
}

export function getUserVipInfo (params) {
	return req.get('/vipgrades/uservip',params)
}
