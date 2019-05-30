import req from './req'

export function list (params = {}) {
  return req.get('/article/management', params)
}

export function detail (id) {
  return req.get(`/article/management/${id}`)
}

export function focus (id) {
  return req.get(`/article/focus/${id}`)
}

export function praise (id) {
  return req.get(`/article/praise/${id}`)
}

export function collectArticle (id) {
  return req.get(`/member/collect/article/${id}`)
}

export default {}
