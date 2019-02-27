import req from './req'

export function login (data) {
  return req.post('/user.login', data)
}

export function logout () {
  return req.post('/user.logout')
}

export function reg (data) {
  return req.post('/user.reg', data)
}
