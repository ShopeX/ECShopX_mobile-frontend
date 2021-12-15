export const SHOP_ITEM = {
  logo: "logo",
  name: "name",
  hour: "hour",
  address: "address",
  tagList: "tagList",
  distance: ({ distance, distance_unit }) => {
    return distance ? `${parseFloat(distance).toFixed(1)}${distance_unit}` : "";
  },
  cardList: "discountCardList",
  
};


