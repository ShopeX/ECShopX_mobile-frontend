import req from './req'

export function become () {
  return req.post('/promoter')
}

export function update (params = {}) {
  return req.put('/promoter', params)
}

export function dashboard () {
  return req.get('/promoter/index')
}

export function info (params = {}) {
  return req.get('/promoter/info', params)
}

export function subordinate (params) {
  return req.get('/promoter/children', params)
}

export function commission (params = {}) {
  return req.get('/promoter/brokerages', params)
}

export function statistics () {
  return req.get('/promoter/brokerage/count')
}

export function withdrawRecord (params) {
  return req.get('/promoter/cash_withdrawal', params)
}

export function withdraw () {
  return req.post('/promoter/cash_withdrawal')
}

export function qrcode (params) {
  return req.get('/promoter/qrcode', params)
}

export function items (params) {
  return req.get('/promoter/relgoods', params)
}

export function release (params) {
  return req.post('/promoter/relgoods', params)
}

export function unreleased (params) {
  return req.delete('/promoter/relgoods', params)
}
