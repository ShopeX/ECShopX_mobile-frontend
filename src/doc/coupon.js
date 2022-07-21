import { formatTime } from '@/utils'

export const COUPON_ITEM = {
  title: 'title',
  cardId: 'card_id',
  cardType: 'card_type',
  code: 'code',
  beginDate: ({ begin_date }) => begin_date.replace(/-/g, '.'),
  endDate: ({ end_date }) => end_date.replace(/-/g, '.'),
  tagClass: 'tagClass',
  reduceCost: ({ reduce_cost }) => reduce_cost / 100,
  leastCost: ({ least_cost }) => least_cost / 100,
  discount: ({ discount }) => {
    return (100 - discount) / 10
  },
  useBound: 'use_bound',
  description: 'description',
  quantity: ({ quantity }) => parseInt(quantity),
  distributorName: ({ distributor_info }) => {
    return distributor_info?.name
  },
  getNum: 'get_num',
  valid: ({ valid }) => {
    if(typeof valid === 'undefined') {
      return true
    } else {
      return valid
    }
  }
}

export const COUPON = {
  title: 'title',
  cardId: 'card_id',
  cardType: 'card_type',
  code: 'code',
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
  getNum: 'get_num',
  couponStatus: ({ quantity, get_limit, user_get_num, get_num}) => {
    if(quantity - get_num <= 0) { 
      return 0 // 已领完
    } else if(get_limit - user_get_num > 0) {
      return 1 // 立即领取
    } else if(get_limit - user_get_num <= 0) {
      return 2 // 已领取
    }
  },
  distributorName: ({ distributor_info }) => {
    return distributor_info?.name
  },
  sourceType: 'source_type',
  sourceId: 'source_id',
  valid: ({ valid }) => {
    if(typeof valid === 'undefined') {
      return true
    } else {
      return valid
    }
  }
}

export const GUIDE_COUPON_ITEM = {
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
