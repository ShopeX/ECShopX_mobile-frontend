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

/** 券包api */
export function getBindCardList (params) {
	return req.get('/user/getBindCardList', params)
}

export function getShowCardPackage (params) {
	return req.get('/user/showCardPackage', params)
}

export function getReceiveCardPackage (params) {
	return req.post('/user/receiveCardPackage', params)
}

export function getCurrentGradList () {
	return req.post('/user/currentGardCardPackage')
}