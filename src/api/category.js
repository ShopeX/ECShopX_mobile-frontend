import req from './req'

export function get () {
  return req.get('http://pjj.aixue7.com/index.php/api/h5app/wxapp/goods/category?company_id=1')
}
