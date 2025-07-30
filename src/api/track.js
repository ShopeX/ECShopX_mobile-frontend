import req from './req'

export function viewnum(data) {
  return req.post('/track/viewnum', data)
}
