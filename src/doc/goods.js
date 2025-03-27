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
  promotion: 'promotionActivity',
  distributorId: 'distributor_id',
  isPoint: 'is_point',
  price: ({ price }) => price / 100, // 销售价
  activityPrice: ({ promotionActivity,act_price }) => {
   let _aprice = (promotionActivity && promotionActivity[0]?.activity_price) || act_price
   return _aprice/ 100
  }, // 秒杀价
  marketPrice: ({ promotionActivity }) => promotionActivity && promotionActivity[0]?.market_price / 100, // 原价
  memberPrice: ({ promotionActivity }) => promotionActivity && promotionActivity[0]?.member_price / 100, // 当前会员等级价
  vipPrice: ({ vip_price }) => vip_price / 100, // vip价格
  svipPrice: ({ svip_price }) => svip_price / 100, // svip价格
  isPrescription:({medicine_data}) => medicine_data?.is_prescription,
}

export const WGT_GOODS_SCROLL = {
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
  // price: ({ activity_price, member_price, price }) => {
  //   if (activity_price > 0) {
  //     return activity_price
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
  isPrescription:'isPrescription',
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
  // price: ({ activity_price, member_price, price }) => {
  //   if (activity_price > 0) {
  //     return activity_price
  //   } else if (member_price > 0) {
  //     return member_price
  //   } else {
  //     return price
  //   }
  // },
  // marketPrice: 'market_price',
  price: ({ price }) => price / 100, // 销售价
  activityPrice: ({ activity_price, act_price }) => {
    let _aprice = activity_price || act_price
    return _aprice / 100
  }, // 秒杀价
  marketPrice: ({ market_price }) => market_price / 100, // 原价
  memberPrice: ({ member_price }) => member_price / 100, // 当前会员等级价
  vipPrice: ({ vip_price }) => vip_price / 100, // vip价格
  svipPrice: ({ svip_price }) => svip_price / 100, // svip价格
  brand: 'brand',
  isPrescription:({medicine_data}) => medicine_data?.is_prescription,
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
  activityPrice: ({ activity_price }) => Number(activity_price) / 100, // 秒杀价
  marketPrice: ({ market_price }) => market_price / 100, // 原价
  memberPrice: ({ member_price }) => member_price / 100, // 当前会员等级价
  vipPrice: ({ vip_price }) => vip_price / 100, // vip价格
  svipPrice: ({ svip_price }) => svip_price / 100, // svip价格

  // is_fav: ({ item_id }) => Boolean(favs[item_id]),
  store: 'store',
  // isPrescription: 'is_prescription',
  medicineData: 'medicine_data',
  isMedicine: 'is_medicine',
  isPrescription:({medicine_data,is_prescription}) => is_prescription?is_prescription:medicine_data?.is_prescription,
}

export const ITEM_LIST_POINT_GOODS = {
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
  point: 'point',
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
  itemBn: 'item_bn',
  itemName: 'itemName',
  brief: 'brief',
  img: 'pics[0]',
  imgs: 'pics',
  companyId: 'company_id',
  activityInfo: 'activity_info',
  activityType: 'activity_type',
  approveStatus: 'approve_status',
  point: 'point',
  isPoint: 'is_point',
  price: ({ price }) => price / 100, // 销售价
  activityPrice: ({ activity_price }) => activity_price / 100, // 秒杀价、内购价
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
  // 内购限购
  purlimitByCart: 'purchase_limit_num_by_cart',
  purlimitByFastbuy: 'purchase_limit_num_by_fastbuy',
  isGift: 'is_gift',
  itemParams: ({ regions, item_unit, item_params }) => {
    const res = []
    if (!Array.isArray(regions)) {
      // 如果 regions 不是数组，可以将它转换成数组   把 regions 转换成只包含一个元素的数组
      regions = [regions]
    }
    if (item_unit) {
      res.push({ attribute_name: '计量单位', attribute_value_name: item_unit })
    }
    if (regions) {
      res.push({ attribute_name: '产地', attribute_value_name: regions.join(' ') })
    }
    return res.concat(item_params)
  },
  groupsList: 'groups_list',
  orderItemType: 'item_type',
  sales: 'sales',
  salesSetting: 'sales_setting',
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
  specImages: 'spec_images',
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
  specItems: ({ spec_items, is_point }) => {
    return pickBy(spec_items, {
      approveStatus: 'approve_status',
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
      // activityPrice: ({ activity_price }) => activity_price / 100
      point: 'point',
      isPoint: () => is_point,
      price: ({ price }) => price / 100, // 销售价
      activityPrice: ({ activity_price }) => activity_price / 100, // 秒杀价
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
  video: 'videos',
  medicineData: 'medicine_data',
  isMedicine: 'is_medicine',
}

export const ESPIER_DETAIL_GOODS_INFO = {
  itemId: 'item_id',
  itemBn: 'item_bn',
  itemName: 'itemName',
  brief: 'brief',
  img: 'pics[0]',
  imgs: 'pics',
  companyId: 'company_id',
  activityInfo: 'activity_info',
  activityType: 'activity_type',
  approveStatus: 'approve_status',
  point: 'point',
  isPoint: 'is_point',
  price: ({ price }) => price / 100, // 销售价
  activityPrice: ({ act_price }) => act_price / 100, // 秒杀价、内购价
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
  // 内购限购
  purlimitByCart: 'purchase_limit_num_by_cart',
  purlimitByFastbuy: 'purchase_limit_num_by_fastbuy',
  isGift: 'is_gift',
  itemParams: ({ regions, item_unit, item_params }) => {
    const res = []
    if (!Array.isArray(regions)) {
      // 如果 regions 不是数组，可以将它转换成数组   把 regions 转换成只包含一个元素的数组
      regions = [regions]
    }
    if (item_unit) {
      res.push({ attribute_name: '计量单位', attribute_value_name: item_unit })
    }
    if (regions) {
      res.push({ attribute_name: '产地', attribute_value_name: regions.join(' ') })
    }
    return res.concat(item_params)
  },
  groupsList: 'groups_list',
  orderItemType: 'item_type',
  sales: 'sales',
  salesSetting: 'sales_setting',
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
  specImages: 'spec_images',
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
  specItems: ({ spec_items, is_point }) => {
    return pickBy(spec_items, {
      activity_type: 'activity_type',
      approveStatus: 'approve_status',
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
      // activityPrice: ({ activity_price }) => activity_price / 100
      point: 'point',
      isPoint: () => is_point,
      price: ({ price }) => price / 100, // 销售价
      activityPrice: ({ activity_price }) => activity_price / 100, // 秒杀价
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
  video: 'videos',
  isPrescription: 'is_prescription',
  medicineData: 'medicine_data',
  isMedicine: 'is_medicine',
}

export const PACKGOODS_INFO = {
  img: 'pics[0]',
  itemName: 'itemName',
  num: '',
  price: ({ price }) => price / 100,
  marketPrice: ({ market_price }) => market_price / 100
}
