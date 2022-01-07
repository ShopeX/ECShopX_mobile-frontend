import req from './req'

//商户类型列表
export function type_list (params) {
  return req.get('/merchant/type/list', params)
}

//结算银行列表
export function bank_list (params) {
  return req.get('/adapay/bank/list', params)
}

//商户登陆
export function login (params) {
  return req.post('/merchant/login', params)
}

//获取当前进行到哪一步
export function getStep (params) {
  return req.get('/merchant/settlementapply/step', params)
}

//保存信息
export function save (params) {
  return req.post(`/merchant/settlementapply/${params.step}`, params)
}

//获取基础设置
export function getSetting (params) {
  return req.get(`/merchant/basesetting`, params)
}

//获取审核结果
export function getAuditstatus (params) {
  return req.get(`/merchant/settlementapply/auditstatus`, params)
}

//获取申请详情
export function detail () {
  return req.get(`/merchant/settlementapply/detail`)
}
