export const CHECKOUT_GOODS_ITEM = {
  item_id: 'item_id',
  // cart_id: 'cart_id',
  title: 'item_name',
  curSymbol: 'fee_symbol',
  discount_info: 'discount_info',
  order_item_type: 'order_item_type',
  type: 'type',
  origincountry_img_url: 'origincountry_img_url',
  origincountry_name: 'origincountry_name',
  pics: 'pic',
  point: 'point',
  item_point: 'item_point',
  price: 'price', // ({ price }) => (+price / 100).toFixed(2),
  num: 'num',
  item_spec_desc: 'item_spec_desc',
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
