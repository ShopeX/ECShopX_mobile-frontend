import req from './req'

export function list (params) {
  return req.get('/aftersales', params)
}

export function info (params) {
  return req.get('/aftersales/info', params)
}

export function apply (params) {
  return req.post('/aftersales', params)
}

export function modify (params) {
  return req.post('/aftersales/modify', params)
}

export function sendback (params) {
  return req.post('/aftersales/sendback', params)
}

export function close (params) {
  return req.post('/aftersales/close', params)
}