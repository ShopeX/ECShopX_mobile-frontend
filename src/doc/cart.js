export const CART_GOODS_ITEM = {
  item_id: "item_id",
  item_name: "item_name",
  pics: ({ pics }) => pics[0],
  price: "price",
  market_price: "market_price",
  // price: ({ price }) => (+price / 100).toFixed(2),
  // market_price: ({ market_price }) => (+market_price / 100).toFixed(2),
  num: 1,
  is_plus_buy: true, //加价购
  item_spec_desc: "item_spec_desc",
  desc: "desc"
}

// export const CART_GOODS_LIST = {
//   item_id: "item_id",
//   cart_id: "cart_id",
//   activity_id: "activity_id",
//   title: "item_name",
//   desc: "brief",
//   is_checked: "is_checked",
//   store: "store",
//   curSymbol: "cur.symbol",
//   distributor_id: "shop_id",
//   type: "type",
//   goods_id: "goods_id",
//   origincountry_name: "origincountry_name",
//   origincountry_img_url: "origincountry_img_url",
//   promotions: ({ promotions = [], cart_id }) =>
//     promotions.map(p => {
//       p.cart_id = cart_id;
//       return p;
//     }),
//   pics: ({ pics }) => pics,
//   // price: ({ price }) => (+price / 100).toFixed(2),
//   // market_price: ({ market_price }) => (+market_price / 100).toFixed(2),
//   member_price: "member_price",
//   num: "num",
//   // packages: item =>
//   //   item.packages &&
//   //   item.packages.length &&
//   //   this.transformCartList(item.packages),
//   item_spec_desc: "item_spec_desc"
// }