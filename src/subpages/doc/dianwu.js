/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { pickBy } from '@/utils'
import dayjs from 'dayjs'
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
  barcode: 'barcode',
  isPrescription: 'is_prescription',
  isMedicine: 'is_medicine',
  platformStore: 'platform_store',
  isTotalStore: 'is_total_store',
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
    const promotionFee = activity_grouping.reduce(
      (total, item) => new Big(total).plus(item.discount_fee),
      0
    )
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
      svipPrice: ({ svip_price }) => svip_price / 100, // svip价格
      isPrescription: 'is_prescription',
      isMedicine: 'is_medicine'
    })
  }
}

export const MEMBER_ITEM = {
  username: 'username',
  avatar: 'avatar',
  mobile: 'mobile',
  userId: 'user_id'
}

export const MEMBER_INFO = {
  vipDiscount: ({ vipgrade, gradeInfo }) => {
    if (vipgrade && vipgrade.is_vip) {
      return (100 - vipgrade.discount) / 10
    } else if (gradeInfo && gradeInfo?.privileges?.discount_desc != 0) {
      return gradeInfo.privileges.discount_desc
    } else {
      return 10
    }
  },
  couponNum: ({ coupon_num }) => {
    return coupon_num || 0
  },
  point: 'point',
  username: 'username',
  avatar: 'avatar',
  mobile: 'mobile',
  userId: 'user_id'
}

export const CREATE_MEMBER_ITEM = {
  username: 'username',
  mobile: 'mobile',
  userId: 'user_id'
}

/** type 为 mark_down 的 discount_fee（分） */
function markDownFenOne(e) {
  if (!e || typeof e !== 'object') return 0
  if (e.type !== 'mark_down' && e.type !== 'markDown') return 0
  const n = Number(e.discount_fee ?? e.discountFee)
  return Number.isFinite(n) && n > 0 ? n : 0
}

/** discount_info / discountInfo：数组、{ mark_down }、或扁平对象 */
function markDownFenFrom(di) {
  if (di == null) return 0
  if (Array.isArray(di)) return di.reduce((s, e) => s + markDownFenOne(e), 0)
  if (typeof di !== 'object') return 0
  const inner = di.mark_down ?? di.markDown
  return inner ? markDownFenOne(inner) : markDownFenOne(di)
}

/** 店务改价优惠（元）：mark_down 的 discount_fee 分→元；再 tradeInfo / 明细行 / price_adjustment */
export function dianwuMarkdownAdjustmentYuan(payload, detailRoot) {
  if (!payload || typeof payload !== 'object') return 0
  const m = detailRoot && typeof detailRoot === 'object' ? { ...detailRoot, ...payload } : payload
  let fen = markDownFenFrom(m.discount_info ?? m.discountInfo)
  if (!fen && detailRoot?.tradeInfo) {
    fen = markDownFenFrom(detailRoot.tradeInfo.discountInfo ?? detailRoot.tradeInfo.discount_info)
  }
  if (!fen) {
    for (const row of m.items ?? m.order_items ?? []) {
      fen += markDownFenFrom(row.discount_info ?? row.discountInfo)
    }
  }
  if (!fen) {
    fen = Number(m.price_adjustment ?? m.priceAdjustment) || 0
  }
  return fen > 0 && Number.isFinite(fen) ? fen / 100 : 0
}

export const CHECKOUT_GOODS_ITEM = {
  couponInfo: 'coupon_info',
  items: ({ items }) => {
    return pickBy(items, {
      itemId: 'item_id',
      pic: 'pic',
      name: 'item_name',
      itemSpecDesc: 'item_spec_desc',
      orderItemType: 'order_item_type',
      price: ({ price }) => price / 100, // 销售价
      activityPrice: ({ activity_price }) => activity_price / 100, // 秒杀价
      marketPrice: ({ market_price }) => market_price / 100, // 原价
      memberPrice: ({ member_price }) => member_price / 100, // 当前会员等级价
      vipPrice: ({ vip_price }) => vip_price / 100, // vip价格
      svipPrice: ({ svip_price }) => svip_price / 100, // svip价格
      totalFee: ({ total_fee }) => total_fee / 100,
      discountFee: ({ discount_fee }) => discount_fee / 100, // 优惠
      point: 'point', // 积分抵扣
      num: 'num',
      barcode: 'barcode',
      isPrescription: 'is_prescription',
      isMedicine: 'is_medicine'
    })
  },
  itemsPromotion: ({ items_promotion }) => items_promotion || [],
  totalItemNum: 'totalItemNum',
  // item_fee_new 不包含赠品商品价格
  itemFee: ({ item_fee_new }) => item_fee_new / 100,
  itemFeeNew: ({ item_fee_new }) => item_fee_new / 100,
  freightFee: ({ freight_fee }) => freight_fee / 100,
  discountFee: ({ discount_fee }) => discount_fee / 100,
  totalFee: ({ total_fee }) => total_fee / 100,
  memberDiscount: ({ member_discount }) => (member_discount ? member_discount / 100 : 0),
  couponDiscount: ({ coupon_discount }) => (coupon_discount ? coupon_discount / 100 : 0),
  promotionDiscount: ({ promotion_discount }) =>
    promotion_discount ? promotion_discount / 100 : 0,
  /** 改价优惠金额（元），见 dianwuMarkdownAdjustmentYuan */
  priceAdjustment: (res) => dianwuMarkdownAdjustmentYuan(res),
  prescriptionStatus: 'prescription_status'
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

export const PENDING_ITEM = {
  created: ({ created }) => {
    return dayjs(created * 1000).format('YYYY.MM.DD HH:mm:ss')
  },
  pendingId: 'pending_id',
  pendingData: ({ pending_data }) => {
    return pickBy(pending_data, {
      pic: ({ pics }) => (pics ? (typeof pics !== 'string' ? pics[0] : JSON.parse(pics)[0]) : ''),
      name: 'itemName',
      itemSpecDesc: 'item_spec_desc',
      price: ({ price }) => price / 100,
      num: 'num',
      isPrescription: 'is_prescription',
      isMedicine: 'is_medicine'
    })
  },
  userId: 'user_id',
  memberInfo: 'memberInfo',
  showDetail: false,
  totalNum: 'total_num'
}

export const ORDER_INFO = {
  items: ({ items }) => {
    return pickBy(items, {
      id: 'id',
      pic: 'pic',
      itemId: 'item_id',
      itemName: 'item_name',
      itemSpecDesc: 'item_spec_desc',
      totalFee: ({ total_fee }) => total_fee / 100,
      price: ({ price }) => price / 100,
      num: 'num',
      refundNum: 'left_aftersales_num',
      leftAftersalesNum: 'left_aftersales_num',
      checked: false,
      discountFee: ({ discount_fee }) => discount_fee / 100,
      point: ({ point_fee }) => point_fee / 100,
      isPrescription: 'is_prescription'
    })
  },
  refundFee: ({ items }) => {
    const remainFee = items.reduce((total, current) => total + current.remain_fee, 0)
    return (remainFee / 100).toFixed(2)
  },
  refundPoint: ({ items }) => {
    const remainPoint = items.reduce((total, current) => total + current.remain_point, 0)
    return remainPoint
  },
  ziti_info: 'ziti_info',
  user_id: 'user_id',
  receiver_name: 'receiver_name',
  receiver_mobile: 'receiver_mobile',
  receiver_state: 'receiver_state',
  receiver_city: 'receiver_city',
  receiver_district: 'receiver_district',
  receiver_address: 'receiver_address',
  order_class: 'order_class',
  totalFee: ({ total_fee }) => total_fee / 100,
  freightFee: ({ freight_fee }) => freight_fee / 100,
  itemFeeNew: ({ item_total_fee }) => item_total_fee / 100,
  itemPoint: 'item_point',
  receipt_type: 'receipt_type',
  pointFreightFee: ({ point_freight_fee }) => point_freight_fee / 100
}
