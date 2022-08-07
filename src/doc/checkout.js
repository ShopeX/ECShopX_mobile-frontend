export const CHECKOUT_GOODS_ITEM = {
  itemId: 'item_id',
  // cart_id: 'cart_id',
  itemName: 'item_name',
  img: 'pic',
  curSymbol: 'fee_symbol',
  discount_info: 'discount_info',
  orderItemType: 'order_item_type',
  type: 'type',
  origincountry_img_url: 'origincountry_img_url',
  origincountry_name: 'origincountry_name',
  point: 'point',
  isPoint: 'is_point',
  item_point: 'item_point',
  price: ({ price }) => price / 100, // 销售价
  activityPrice: ({ activity_price }) => activity_price / 100, // 秒杀价
  marketPrice: ({ market_price }) => market_price / 100, // 原价
  memberPrice: ({ member_price }) => member_price / 100, // 当前会员等级价
  vipPrice: ({ vip_price }) => vip_price / 100, // vip价格
  svipPrice: ({ svip_price }) => svip_price / 100, // svip价格
  packagePrice: ({ package_price }) => package_price / 100, // 组合价
  num: 'num',
  itemSpecDesc: 'item_spec_desc',
  nospec: ({ item_spec_desc }) => {
    return !item_spec_desc
  },
  distributor_id: 'distributor_id'
}

export const INVOICE_TITLE = {
  type: 'type',
  content: 'title',
  company_address: 'companyAddress',
  registration_number: 'taxNumber',
  bankname: 'bankName',
  bankaccount: 'bankAccount',
  company_phone: 'telephone'
}

export const RECEIVER_ADDRESS = {
  receiver_name: 'username',
  receiver_mobile: 'telephone',
  receiver_state: 'province',
  receiver_city: 'city',
  receiver_district: 'county',
  receiver_address: 'adrdetail',
  receiver_zip: 'postalCode'
}

export const ZITI_ADDRESS = {
  receiver_name: 'name',
  receiver_mobile: 'mobile',
  receiver_state: 'province',
  receiver_city: 'city',
  receiver_district: 'area',
  receiver_address: 'address'
}

export const GUIDE_CHECKOUT_GOODSITEM = {
  itemName: 'item_name',
  img: 'pics',
  nospec: ({ item_spec_desc }) => {
    if (item_spec_desc) {
      return false
    } else {
      return true
    }
  },
  itemSpecDesc: 'item_spec_desc',
  num: 'num',
  price: ({ price }) => price / 100,
  activityPrice: ({ act_price }) => act_price / 100,
  memberPrice: ({ member_price }) => {
    if (!member_price) {
      return NaN
    } else {
      return member_price / 100
    }
  },
  marketPrice: ({ market_price }) => market_price / 100
}
