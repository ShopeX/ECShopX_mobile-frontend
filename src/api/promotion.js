import req from './req'

export function automatic (params = {}) {
  return req.get('/promotion/register', params)
}
