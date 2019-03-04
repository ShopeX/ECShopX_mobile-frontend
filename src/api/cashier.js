import req from './req'

export function weapppay () {
  return req.get('http://pjj.aixue7.com/index.php/api/wxapp/payment/config')
}
