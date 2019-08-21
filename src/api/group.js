import req from './req'

export function groupList (params = {}) {
  return req.get('/promotions/groups', params)
}

export function groupDetail ( id,params={}) {
	return req.get(`/groupOrders/${id}`, params)	
}