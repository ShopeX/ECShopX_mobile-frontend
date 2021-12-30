export const SHOP_ITEM = {
  logo: "logo",
  title: 'title',
  name: "store_name",
  hour: "hour",
  address: "store_address",
  tagList: "tagList",
  distributor_id: "distributor_id",
  distance: ({ distance, distance_unit }) => {
    return distance ? (distance < 1 ? Math.round(distance * Math.pow(10, 3)) : Number(distance).toFixed(2)) + distance_unit : ''
  },
  cardList: "discountCardList",
  salesCount: "sales_count",
  rate: "rate",
  scoreList: 'scoreList',
  is_dada: "is_dada",
  marketingActivityList: "marketingActivityList",
  itemList: "itemList",
};

export const BUSINESS_SORT = {
  tag_name: 'title',
  tag_id: 'sort',
}


