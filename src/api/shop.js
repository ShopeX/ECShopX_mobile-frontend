import { platformTemplateName, transformPlatformUrl } from "@/utils/platform";
import req from "./req";

export function getShop(params = {}) {
  return req.get("/distributor/is_valid", params);
}

export function list(params = {}) {
  return req.get("/distributor/list", params);
}

export function getStoreStatus(params = {}) {
  return req.get("/nostores/getstatus", params);
}

export function getNearbyShop(params) {
  return req.get("/distributor/list", params);
}



// 总店店铺信息及协议
export function getStoreBaseInfo(params = {}) {
  return req.get("/shops/info", params);
}

// 协议信息获取
export function getRuleInfo(params = {}) {
  return req.get("/shops/protocol", params);
}

// 获取总店信息
export function getDefaultShop(params = {}) {
  return req.get('/distributor/default', params)
}

// 获取总店信息
export function getHeadquarters(params = {}) {
  return req.get("/distributor/self", params);
}

//
export function getPageParamsConfig({
  page_name,
  template_name = platformTemplateName,
  version = "v1.0.1"
}) {
  return req.get(transformPlatformUrl("/pageparams/setting"), {
    page_name,
    template_name,
    version
  });
}

// 获取tabbars和小程序配置
export function getAppConfig() {
  return req.get("/pagestemplate/setInfo");
}



// 获取首页配置
export function homeSetting() {
  return req.get("common/setting", {
    type: "frontend"
  });
}

/**
 * @function APP启动获取全局配置
 */
export function getAppBaseInfo() {
  return req.get( `pagestemplate/baseinfo`, {
    page_name: "color_style",
    template_name: platformTemplateName,
    version: "v1.0.1"
  })
}

/**
 * @function 首页模版配置
 */
export function getShopTemplate(params) {
  return req.get( `/pagestemplate/detail`, {
    template_name: 'yykweishop',
    weapp_pages: 'index',
    ...params
  })
}

// 获取高德地图key
export function getMapKeyDetail(params) {
  return req.get('/third_party/map/key', params)
}