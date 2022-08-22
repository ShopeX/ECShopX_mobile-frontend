import { pickBy } from '@/utils'
import Big from 'big.js'

export const GOODS_ITEM = {
  itemId: 'item_id',
  pic: ({ pics }) => (pics ? (typeof pics !== 'string' ? pics[0] : JSON.parse(pics)[0]) : ''),
  name: 'item_name',
  itemSpecDesc: 'item_spec_desc',
  price: ({ price }) => price / 100, // 销售价
  activityPrice: ({ activity_price }) => activity_price / 100, // 秒杀价
  marketPrice: ({ market_price }) => market_price / 100, // 原价
  memberPrice: ({ member_price }) => member_price / 100, // 当前会员等级价
  vipPrice: ({ vip_price }) => vip_price / 100, // vip价格
  svipPrice: ({ svip_price }) => svip_price / 100, // svip价格
  store: 'store',
  barcode: 'barcode'
}

export const CART_GOODS_ITEM = {
  totalCount: 'cart_total_coun',
  totalNum: 'cart_total_num',
  totalPrice: ({ cart_total_price }) => cart_total_price / 100,
  discountFee: ({ discount_fee }) => discount_fee / 100,
  totalFee: ({ total_fee }) => total_fee / 100,
  memberDiscount: ({ member_discount }) => member_discount / 100,
  giftActivity: 'gift_activity',
  promotionFee: ({ activity_grouping }) => {
    const promotionFee = activity_grouping.reduce((total, item) => new Big(total).plus(item.discount_fee), 0)
    return promotionFee / 100
  },
  activityGrouping: 'activity_grouping',
  list: ({ list }) => {
    return pickBy(list, {
      cartId: 'cart_id',
      itemId: 'item_id',
      itemName: 'item_name',
      pic: 'pics',
      itemSpecDesc: 'item_spec_desc',
      num: 'num',
      price: ({ price }) => price / 100, // 销售价
      activityPrice: ({ activity_price }) => activity_price / 100, // 秒杀价
      marketPrice: ({ market_price }) => market_price / 100, // 原价
      memberPrice: ({ member_price }) => member_price / 100, // 当前会员等级价
      vipPrice: ({ vip_price }) => vip_price / 100, // vip价格
      svipPrice: ({ svip_price }) => svip_price / 100 // svip价格
    })
  }
}

export const MEMBER_ITEM = {
  username: 'username',
  mobile: 'mobile',
  userId: 'user_id'
}

export const CREATE_MEMBER_ITEM = {
  username: 'username',
  mobile: 'mobile',
  userId: 'user_id'
}

export const CHECKOUT_GOODS_ITEM = {
  couponInfo: 'coupon_info',
  items: ({ items }) => {
    return pickBy(items, {
      itemId: 'item_id',
      pic: 'pic',
      name: 'item_name',
      itemSpecDesc: 'item_spec_desc',
      price: ({ price }) => price / 100, // 销售价
      activityPrice: ({ activity_price }) => activity_price / 100, // 秒杀价
      marketPrice: ({ market_price }) => market_price / 100, // 原价
      memberPrice: ({ member_price }) => member_price / 100, // 当前会员等级价
      vipPrice: ({ vip_price }) => vip_price / 100, // vip价格
      svipPrice: ({ svip_price }) => svip_price / 100, // svip价格
      num: 'num',
      barcode: 'barcode'
    })
  },
  itemsPromotion: 'items_promotion',
  totalItemNum: 'totalItemNum',
  itemFee: ({ item_fee }) => item_fee / 100,
  discountFee: ({ discount_fee }) => discount_fee / 100,
  totalFee: ({ total_fee }) => total_fee / 100,
  memberDiscount: ({ member_discount }) => member_discount / 100,
  couponDiscount: ({ coupon_discount }) => coupon_discount / 100,
  promotionDiscount: ({ promotion_discount }) => promotion_discount / 100
}

export const COUPON_ITEM = {
  cardId: 'card_id',
  couponCode: 'code',
  title: 'title',
  beginDate: ({ begin_date }) => begin_date.replace(/-/g, '.'),
  endDate: ({ end_date }) => end_date.replace(/-/g, '.'),
  cardType: 'card_type',
  reduceCost: ({ reduce_cost }) => reduce_cost / 100,
  leastCost: ({ least_cost }) => least_cost / 100,
  discount: ({ discount }) => {
    return (100 - discount) / 10
  }
}
