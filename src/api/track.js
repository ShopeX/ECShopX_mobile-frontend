import req from './req'

export function viewnum(param = {}) {
  return req.post('/track/viewnum', {})
}
