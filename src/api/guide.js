import req from './req'

//获取导购店铺列表
export function distributorlist (params = {}) {
  return req.get('/salesperson/distributorlist', params)
}
//验证导购员的店铺id是否有效
export function is_valid (params = {},config={}) {
  console.log('/salesperson/distributor/is_valid')
  return req.get('/salesperson/distributor/is_valid', params,config)
}
//扫条形码加入购物车
export function scancodeAddcart (params = {}) {
  return req.post('/salesperson/scancodeAddcart', params)
}
//导购员购物车新增
export function cartdataadd (params = {}) {
  return req.get('/salesperson/cartdataadd', params)
}
//导购员购物车更新
export function cartdataupdate (params = {}) {
  return req.get('/salesperson/cartdataupdate', params)
}
//获取导购员购物车
export function cartdatalist (params = {}) {
  return req.get('/salesperson/cartdatalist', params)
}
//导购员购物车删除
export function cartdatadel (params = {}) {
  return req.get('/salesperson/cartdatadel', params)
}
