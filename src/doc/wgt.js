import { formatTime } from '@/utils'
import { GOODS_DETAIL_PROMOTION_TAG } from './goods'

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
  validDate: ({ valid_date, begin_date, end_date }) =>
    valid_date ||
    (begin_date && end_date
      ? `${formatTime(begin_date * 1000, 'YYYY.MM.DD HH:mm')}-${formatTime(
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
  description: 'description',
  canUsedShops: 'canUsedShops',
  dayStockNum: 'stockNum', //日剩余库存
  stockNum: 'realStockNum', //总剩余库存
  remainingNum: ({ get_num, quantity }) => quantity - get_num
}

export const WGTGOODSITEM = {
  goodsId: 'goods_id',
  itemId: 'item_id',
  itemName: 'item_name',
  store: 'store',
  originalPrice: 'market_price',
  distributorId: 'distributor_id',
  pic: ({ pics, main_img }) => main_img || pics[0] || '',
  mainPrice: ({ price, activity_price }) => (activity_price || price) / 100,
  price: ({ price }) => price / 100, // 销售价
  activityPrice: ({ activity_price }) => activity_price / 100, // 秒杀价、内购价
  sales: 'sales',
  discount_rate: ({ discount_rate }) =>
    discount_rate ? String((discount_rate / 10).toFixed(1)) : null,
  tags: (data) => {
    let base = GOODS_DETAIL_PROMOTION_TAG(data, false)
    const { promotion_activity } = data
    const group =
      promotion_activity && promotion_activity.length
        ? promotion_activity?.find((item) => item.tag_type == 'single_group')
        : null
    if (group && group.tag_name) {
      base.unshift({
        //标签展示类型映射
        type: 'custom',
        item_id: group.promotion_id,
        tag_name: group.tag_name,
        tag_type: 'group'
      })
    }
    return base
  },
  promotionSkill: ({ promotion_activity }) => {
    const skill =
      promotion_activity && promotion_activity.length
        ? promotion_activity?.find((item) => item.tag_type == 'limited_time_sale')
        : null
    return skill
  },
  promotionGroup: ({ promotion_activity }) => {
    const group =
      promotion_activity && promotion_activity.length
        ? promotion_activity?.find((item) => item.tag_type == 'single_group')
        : null
    return group
  },
  platformLimitedTimeSaleStartTime: 'platform_limited_time_sale_start_time',
  platformLimitedTimeSaleEndTime: 'platform_limited_time_sale_end_time',
  couponList: ({ kaquan_list }) => kaquan_list || [],
  score: 'score',
  memberPreference: 'memberpreference_activity',
  spu_var: 'goods_bn',
  spuName_var: 'item_name',
  sku_var: ({ spec_items, item_id }) => {
    return spec_items && spec_items.filter((i) => i.item_id == item_id)[0]?.item_bn
  },
  skuName_var: ({ spec_items, item_id }) => {
    const item_spec = spec_items && spec_items.filter((i) => i.item_id == item_id)[0]?.item_spec
    const result = item_spec?.map((i) => i.spec_value_name).join(' ')
    return result
  },
  firstCategory_var: ({ item_category_main }) => {
    return item_category_main && item_category_main[0]?.category_name
  },
  secondCategory_var: ({ item_category_main }) => {
    return item_category_main && item_category_main[1]?.category_name
  },
  thirdCategory_var: ({ item_category_main }) => {
    return item_category_main && item_category_main[2]?.category_name
  },
  brandName_var: 'goods_brand',
  productPrice_var: ({ activity_price, price }) => {
    return (activity_price || price) / 100
  },
  discount_var: ({ discount_rate }) =>
    discount_rate ? String((discount_rate / 10).toFixed(1)) : null,
  regionauthId: 'regionauth_id'
  //   goods_id: "957"
  // item_id: "957"
  // item_name: "清润蓝矿物皂(新老包装)"
  // item_total_sales: 79
  // pics: "https://ecshopx1.yuanyuanke.cn/image/35/2022/06/15/e9b9c130700d84c61ef7f3858467ae22maEMnZ1L04weAOS3uzJImetaGZawyetw"
  // price: 2000
  // promotion_activity: []
  // sales: 79
}
