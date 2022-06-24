import { pickBy } from '@/utils'

export const WGT_GOODS_GRID = {
  cross: {
    key: 'origincountry_img_url',
    default: []
  },
  pic: ({ imgUrl }) => {
    return imgUrl
  },
  itemId: 'goodsId',
  itemName: 'title',
  brief: 'brief',
  brand: 'brand',
  promotion: 'promotion_activity',
  distributorId: 'distributor_id',
  isPoint: 'is_point',
  // price: ({ act_price, member_price, price }) => {
  //   if (act_price > 0) {
  //     return act_price
  //   } else if (member_price > 0) {
  //     return member_price
  //   } else {
  //     return price
  //   }
  // },
  // marketPrice: 'market_price',
  price: ({ price }) => price / 100, // 销售价
  activityPrice: ({ act_price }) => act_price / 100, // 秒杀价
  marketPrice: ({ market_price }) => market_price / 100, // 原价
  memberPrice: ({ member_price }) => member_price / 100, // 当前会员等级价
  vipPrice: ({ vip_price }) => vip_price / 100, // vip价格
  svipPrice: ({ svip_price }) => svip_price / 100, // svip价格
}

export const WGT_GOODS_GRID_TAB = {
  pic: ({ imgUrl }) => {
    return imgUrl
  },
  itemId: 'goodsId',
  itemName: 'title',
  brief: 'brief',
  promotion: 'promotion_activity',
  distributorId: 'distributor_id',
  isPoint: 'is_point',
  // price: ({ act_price, member_price, price }) => {
  //   if (act_price > 0) {
  //     return act_price
  //   } else if (member_price > 0) {
  //     return member_price
  //   } else {
  //     return price
  //   }
  // },
  // marketPrice: 'market_price',
  price: ({ price }) => price / 100, // 销售价
  activityPrice: ({ act_price }) => act_price / 100, // 秒杀价
  marketPrice: ({ market_price }) => market_price / 100, // 原价
  memberPrice: ({ member_price }) => member_price / 100, // 当前会员等级价
  vipPrice: ({ vip_price }) => vip_price / 100, // vip价格
  svipPrice: ({ svip_price }) => svip_price / 100, // svip价格
  brand: 'brand'
}

export const WGT_GOODS_BRAND = {
  id: 'attribute_id',
  name: 'attribute_name'
}

export const BUSINESS_LIST_TAG = {
  id: 'tag_id',
  name: 'tag_name'
}

export const ITEM_LIST_GOODS = {
  pic: ({ pics }) => (pics ? (typeof pics !== 'string' ? pics[0] : JSON.parse(pics)[0]) : ''),
  itemId: 'item_id',
  itemName: 'item_name',
  brief: 'brief',
  distributorId: 'distributor_id',
  distributor_info: 'distributor_info',
  promotion: 'promotion_activity',
  origincountry_name: 'origincountry_name',
  origincountry_img_url: 'origincountry_img_url',
  type: 'type',
  price: ({ price }) => price / 100, // 销售价
  activityPrice: ({ activity_price }) => activity_price / 100, // 秒杀价
  marketPrice: ({ market_price }) => market_price / 100, // 原价
  memberPrice: ({ member_price }) => member_price / 100, // 当前会员等级价
  vipPrice: ({ vip_price }) => vip_price / 100, // vip价格
  svipPrice: ({ svip_price }) => svip_price / 100, // svip价格

  // is_fav: ({ item_id }) => Boolean(favs[item_id]),
  store: 'store'
}

export const GOODS_INFO = {
  itemId: 'item_id',
  itemName: 'itemName',
  brief: 'brief',
  img: 'pics[0]',
  imgs: 'pics',
  companyId: 'company_id',
  activityInfo: 'activity_info',
  activityType: 'activity_type',
  approveStatus: 'approve_status',
  price: ({ price }) => price / 100, // 销售价
  activityPrice: ({ act_price }) => act_price / 100, // 秒杀价
  marketPrice: ({ market_price }) => market_price / 100, // 原价
  memberPrice: ({ member_price }) => member_price / 100, // 当前会员等级价
  vipPrice: ({ vip_price }) => vip_price / 100, // vip价格
  svipPrice: ({ svip_price }) => svip_price / 100, // svip价格
  packagePrice: ({ package_price }) => package_price / 100, // 组合价
  nospec: 'nospec',
  itemSpecDesc: 'item_spec_desc',
  specText: '',
  vipgradeGuideTitle: 'vipgrade_guide_title',
  couponList: 'kaquan_list',
  store: 'store',
  store_setting: 'store_setting',
  limitNum: 'limit_num',
  isGift: 'is_gift',
  itemParams: 'item_params',
  groupsList: 'groups_list',
  orderItemType: 'item_type',
  promotionActivity: ({ promotion_activity }) => {
    if (!promotion_activity) {
      return []
    } else {
      return pickBy(promotion_activity, {
        joinLimit: ({ join_limit }) => parseInt(join_limit),
        promotionTag: 'promotion_tag',
        marketingName: 'marketing_name',
        marketingType: 'marketing_type',
        marketingId: 'marketing_id',
        endDate: 'end_date',
        conditionRules: 'condition_rules',
        gifts: 'gifts',
        plusItems: 'plusitems'
      })
    }
  },

  skuList: ({ item_spec_desc }) => {
    return pickBy(item_spec_desc, {
      skuName: 'spec_name',
      skuValue: ({ spec_values, spec_name }) => {
        return pickBy(spec_values, {
          specId: 'spec_value_id',
          specName: ({ spec_custom_value_name, spec_value_name }) => {
            return spec_custom_value_name || spec_value_name
          },
          specImgs: 'item_image_url'
        })
      }
    })
  },
  specItems: ({ spec_items }) => {
    return pickBy(spec_items, {
      specItem: ({ item_spec }) => {
        return pickBy(item_spec, {
          specId: 'spec_value_id',
          skuName: 'spec_name',
          specName: ({ spec_custom_value_name, spec_value_name }) => {
            return spec_custom_value_name || spec_value_name
          },
          specImgs: 'item_image_url'
        })
      },
      itemId: 'item_id',
      store: 'store',
      limitNum: 'limit_num',
      // price: ({ price }) => price / 100,
      // marketPrice: ({ market_price }) => market_price / 100,
      // memberPrice: ({ member_price }) => {
      //   if (!member_price) {
      //     return NaN
      //   } else {
      //     return member_price / 100
      //   }
      // },
      // activityPrice: ({ act_price }) => act_price / 100
      price: ({ price }) => price / 100, // 销售价
      activityPrice: ({ act_price }) => act_price / 100, // 秒杀价
      marketPrice: ({ market_price }) => market_price / 100, // 原价
      memberPrice: ({ member_price }) => member_price / 100, // 当前会员等级价
      vipPrice: ({ vip_price }) => vip_price / 100, // vip价格
      svipPrice: ({ svip_price }) => svip_price / 100, // svip价格
      packagePrice: ({ package_price }) => package_price / 100, // 组合价
    })
  },
  intro: 'intro',
  distributorInfo: ({ distributor_info }) => {
    return pickBy(distributor_info, {
      distributorId: 'distributor_id',
      logo: 'logo',
      storeName: 'name'
    })
  },
  distributorId: 'distributor_id',
  video: 'videos'
}

export const PACKGOODS_INFO = {
  img: 'pics[0]',
  itemName: 'itemName',
  num: '',
  price: ({ price }) => price / 100,
  marketPrice: ({ market_price }) => market_price / 100
}
