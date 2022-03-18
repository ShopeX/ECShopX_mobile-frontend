import req from './req'
import S from '@/spx'
import { transformPlatformUrl } from '@/utils/platform'

function createHead() {
  return {
    header: {
      'x-wxapp-session': (S && S.getAuthToken()) || '',
      'salesperson-type': 'shopping_guide'
    }
  }
}
//获取首页导购模版
export function getHomeTmps(params = {}, config = createHead()) {
  return req.get(transformPlatformUrl('/pageparams/setting'), params, config)
}

//获取导购店铺列表
export function distributorlist(params = {}, config = createHead()) {
  return req.get('/salesperson/distributorlist', params, config)
}
//验证导购员的店铺id是否有效
export function is_valid(params = {}, config = createHead()) {
  return req.get('/salesperson/distributor/is_valid', params, config)
}
//扫条形码加入购物车
export function scancodeAddcart(params = {}, config = createHead()) {
  return req.post('/salesperson/scancodeAddcart', params, config)
}

// //计算导购分享订单商品金额
// export function salesPromotion(params = {}, config = createHead()) {
//   return req.post("/salesperson/salesPromotion", params, config);
// }

//导购员购物车新增
export function cartdataadd(params = {}, config = createHead()) {
  return req.get('/salesperson/cartdataadd', params, config)
}
//导购员购物车更新
export function cartdataupdate(params = {}, config = createHead()) {
  return req.get('/salesperson/cartdataupdate', params, config)
}
//获取导购员购物车列表
export function cartdatalist(params = {}, config = createHead()) {
  return req.get('/salesperson/cartdatalist', params, config)
}
// 获取购物车数量
export function cartCount(params = {}, config = createHead()) {
  return req.get('/salesperson/cartcount', params, config)
}

//导购员购物车删除
export function cartdatadel(params = {}, config = createHead()) {
  return req.get('/salesperson/cartdatadel', params, config)
}
//导购购物车选中状态变更
export function checkstatus(params = {}, config = createHead()) {
  return req.put('/salesperson/cartupdate/checkstatus', params, config)
}

//生成海报的二维码，增加一个参数 salesman_distributor_id:导购的店铺id
//计算导购分享订单商品金额
export function salesPromotion(params = {}, config = createHead()) {
  return req.get('/salesperson/salesPromotion', params, config)
}

//获取导购货架商品列表 wxapp/goods/salesperson/items

export function salespersonItems(params = {}, config = createHead()) {
  return req.get('/goods/salesperson/items', params, config, { showLoading: true })
}
