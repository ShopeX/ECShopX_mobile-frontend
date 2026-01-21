import { formatTime } from '@/utils'

export const STORECLASSIFY_SELECT = {
  title: 'category_name',
  id: 'category_id',
  image: 'image_url',
  name: 'category_name',
  children: ({ children }) => {
    return (
      children &&
      children.length > 0 &&
      children?.map((item) => {
        return {
          id: item.category_id,
          name: item.category_name,
          image: item.image_url
        }
      })
    )
  }
}

export const STORECLASSIFY = {
  title: ({ category_name, current_category_name }) => current_category_name || category_name,
  id: 'category_id',
  image: 'image_url',
  name: ({ category_name, current_category_name }) => current_category_name || category_name,
  store_ids: 'store_ids'
}

export const WGTCOUPON = {
  title: 'title',
  validDate: ({ valid_date, start_date, end_date }) =>
    valid_date ||
    (start_date && end_date
      ? `${formatTime(start_date * 1000, 'YYYY.MM.DD HH:mm')}-${formatTime(
          end_date * 1000,
          'YYYY.MM.DD HH:mm'
        )}`
      : ''),
  endDate: ({ end_date, valid_date }) => {
    return (
      valid_date?.split(' - ')[1] ||
      (end_date ? formatTime(end_date * 1000, 'YYYY.MM.DD HH:mm') : '')
    )
  },
  cardType: ({ card_type_name, card_type }) => card_type_name || card_type,
  type: 'card_type',
  buttonStatus: ({ button_status }) => button_status?.label, //"button_status": label: 'get/exchange/buy/get_invalid', text: '领取/兑换/购买/已领取'
  buttonText: ({ button_status }) => button_status?.text,
  point: 'point',
  price: 'price',
  cardId: ({ card_id, id }) => card_id || id,
  couponSn: ({ couponSn, code }) => couponSn || code,
  useScene: ({ use_scenes }) => use_scenes?.toLowerCase(), // 使用场景(如：线上商城专享 online; 通用券 common; 线下专享 offline)
  useAllItems: 'use_all_items', // 是否全场可用: 0:否,1:是
  cardSource: 'card_source', // 券来源(如：mob，ecshopx)
  subscript: 'subscript', // {color: "#CB9800", text: "新获取"}
  isChecked: 'is_checked',
  isDisabled: 'is_disabled',
  code: 'code',
  useBound: 'use_bound', // 适用范围: 0:全场可用,1:指定商品可用,2:指定分类可用,3:指定商品标签可用,4:指定商品品牌可用,6:指定店铺商品可用
  tagClass: 'tagClass',
  reduceCost: ({ reduce_cost }) => reduce_cost / 100,
  leastCost: ({ least_cost }) => least_cost / 100,
  discount: ({ discount }) => {
    return (100 - discount) / 10
  },
  quantity: ({ quantity }) => parseInt(quantity),
  getNum: 'get_num',
  couponStatus: ({ quantity, get_limit, user_get_num = 0, get_num = 0 }) => {
    // get_limit 0 表示不限制领取数量
    if (quantity - get_num <= 0) {
      return 0 // 已领完
    } else if (get_limit - user_get_num > 0 || get_limit == 0) {
      return 1 // 立即领取
    } else if (get_limit - user_get_num <= 0) {
      return 2 // 已领取
    }
  },
  distributorName: ({ distributor_info }) => {
    return distributor_info?.name
  },
  sourceType: 'source_type',
  sourceId: 'source_id',
  valid: ({ valid }) => {
    if (typeof valid === 'undefined') {
      return true
    } else {
      return valid
    }
  },
  discount_rule: 'discount_rule',
  canUsedShops: 'canUsedShops',
  dayStockNum: 'stockNum', //日剩余库存
  stockNum: 'realStockNum', //总剩余库存
  remainingNum: ({ get_num, quantity }) => quantity - get_num
}
