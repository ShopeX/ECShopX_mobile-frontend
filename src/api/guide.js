import req from "./req";
import S from "@/spx";
console.log("---req-guide-S---", S);
function createHead() {
  console.log("---req-guide-S-createHead---", S);
  return {
    header: {
      "x-wxapp-session": (S && S.get("session3rd")) || "",
      "salesperson-type": "shopping_guide"
    }
  };
}

//获取导购店铺列表
export function distributorlist(params = {}) {
  return req.get("/salesperson/distributorlist", params);
}
//验证导购员的店铺id是否有效
export function is_valid(params = {}, config = createHead()) {
  console.log("/salesperson/distributor/is_valid");
  return req.get("/salesperson/distributor/is_valid", params, config);
}
//扫条形码加入购物车
export function scancodeAddcart(params = {}, config = createHead()) {
  return req.post("/salesperson/scancodeAddcart", params, config);
}
//导购员购物车新增
export function cartdataadd(params = {}, config = createHead()) {
  return req.get("/salesperson/cartdataadd", params, config);
}
//导购员购物车更新
export function cartdataupdate(params = {}, config = createHead()) {
  return req.get("/salesperson/cartdataupdate", params, config);
}
//获取导购员购物车
export function cartdatalist(params = {}, config = createHead()) {
  return req.get("/salesperson/cartdatalist", params, config);
}
//导购员购物车删除
export function cartdatadel(params = {}, config = createHead()) {
  return req.get("/salesperson/cartdatadel", params, config);
}

//生成海报的二维码，增加一个参数 salesman_distributor_id:导购的店铺id
export function salesPromotion(params = {}, config = createHead()) {
  return req.get("/salesperson/salesPromotion", params, config);
}
 