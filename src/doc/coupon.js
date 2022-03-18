import { formatTime } from '@/utils'

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

export const COUPON_ITEM = {
  title: 'title',
  cardId: 'card_id',
  cardType: 'card_type',
  beginDate: ({ begin_date }) => formatTime(begin_date * 1000, 'YYYY.MM.DD'),
  endDate: ({ end_date }) => formatTime(end_date * 1000, 'YYYY.MM.DD'),
  tagClass: 'tagClass',
  reduceCost: ({ reduce_cost }) => reduce_cost / 100,
  leastCost: ({ least_cost }) => least_cost / 100,
  discount: ({ discount }) => {
    return (100 - discount) / 10
  },
  useBound: 'use_bound',
  description: 'description',
  quantity: ({ quantity }) => parseInt(quantity),
  getNum: 'get_num'
}
