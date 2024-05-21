import req from './req'

export function getSalespersonSalemanShopList (params = {}) {
  return req.get('/salesperson/salemanShopList', params)
}
