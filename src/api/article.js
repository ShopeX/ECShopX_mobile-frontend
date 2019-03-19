import req from './req'

export function detail (id) {
  return req.get(`/article/management/${id}`)
}

export default {}
