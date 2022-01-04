export const COUPON_LIST = {
  item_id: 'item_id',
  item_name: 'item_name',
  pics: ({ pics }) => pics[0],
  price: 'price',
  market_price: 'market_price',
  // price: ({ price }) => (+price / 100).toFixed(2),
  // market_price: ({ market_price }) => (+market_price / 100).toFixed(2),
  num: 1,
  is_plus_buy: true, //加价购
  item_spec_desc: 'item_spec_desc',
  desc: 'desc'
}
