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
export function getBindCardList (params) { // 卡券展示
	return req.get('/user/getBindCardList', params)
}

export function getShowCardPackage (params) { // 未读卡券
	return req.get('/user/showCardPackage', params)
}

export function getCouponList (params) { // 领取卡券
	return req.post('/user/confirmPackageShow', params)
}