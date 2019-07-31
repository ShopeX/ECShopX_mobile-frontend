import req from './req'

export function getShop (param = {}) {
  return req.get('/distributor/is_valid', {})
}
