import req from './req'

export function list (params = {}) {
  return req.get('/article/management', params)
}

export function authList (params = {}) {
  return req.get('/article/usermanagement', params)
}
export function detailAuth (id) {
  return req.get(`/article/usermanagement/${id}`)
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

export function praiseCheck (id) {
  return req.get(`/article/praise/check/${id}`)
}

export function praiseNum (id) {
  return req.get(`/article/praise/num/${id}`)
}

export function totalCollectArticle (params={}) {
  return req.get('/member/collect/article',params)
}

export function collectArticle (id) {
  return req.post(`/member/collect/article/${id}`)
}

export function delCollectArticle (params={}) {
  return req.delete('/member/collect/article',params)
}

export function collectArticleInfo (params={}) {
  return req.get('/member/collect/article/info',params)
}

export function columnList () {
  return req.get('/article/category')
}

export default {}
