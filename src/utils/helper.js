import { getPointName } from "@/utils";
import { Component } from 'react';
import Taro,{getCurrentInstance} from "@tarojs/taro";

export const transformTextByPoint = (isPoint = false, money, point) => {
  if (isPoint) {
    return ` ${point}${getPointName()}`;
  }
  return ` ￥${money}`;
};

export const getDistributorId = () => {
  const { distributor_id, store_id } = Taro.getStorageSync("curStore") || {};
  const otherSetting = Taro.getStorageSync("otherSetting") || {};
  const id = otherSetting.nostores_status ? store_id : distributor_id;
  return id;
};

export const getDtidIdUrl = (url, distributor_id) => {
  if (url.indexOf("dtid=") > -1) {
    return url;
  }
  const isShareDtid = Taro.getStorageSync("distributor_param_status") == true;
  if (isShareDtid) {
    return url + `&dtid=${distributor_id}`;
  }
  return url;
};
/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 说明
 * @FilePath: /unite-vshop/src/pages/home/wgts/helper.js
 * @Date: 2020-04-30 17:12:45
 * @LastEditors: Arvin
 * @LastEditTime: 2021-02-01 14:00:21
 */

// import { WGTS_NAV_MAP } from '@/consts'

export function linkPage(type, data) {
  const { id, title } = data;
  console.log(type, data);
  let url = "";

  switch (type) {
    case "goods":
      url = "/pages/item/espier-detail?id=" + id;
      break;
    case "category":
      url = "/pages/item/list?cat_id=" + id;
      break;
    case "article":
      url = "/pages/article/index?id=" + id;
      break;
    case "planting":
      url = "/subpage/pages/recommend/detail?id=" + id;
      break;
    case "custom_page":
      url = "/pages/custom/custom-page?id=" + id;
      break;
    case "marketing":
      url = "/marketing/pages/item/group-list";
      break;
    case "seckill":
      url = "/marketing/pages/item/seckill-goods-list?seckill_id=" + id;
      break;
    case "link":
      if (id == "vipgrades") {
        url = "/subpage/pages/vip/vipgrades";
      } else if (id == "serviceH5Coach") {
        url = "/marketing/pages/service/wap-link?tp=o";
      } else if (id == "serviceH5Sales") {
        url = "/marketing/pages/service/wap-link?tp=r";
      } else if (id == "storelist") {
        url = "/marketing/pages/service/store-list";
      } else if (id == "aftersales") {
        url = "/marketing/pages/service/refund-car";
      } else if (id == "mycoach") {
        url = "/marketing/pages/service/online-guide";
      } else if (id == "hottopic") {
        url = "/pages/recommend/list";
      } else if (id === "floorguide") {
        url = "/pages/floorguide/index";
      } else if (id === "grouppurchase") {
        url = "/groupBy/pages/home/index";
      } else {
        url = "";
      }
      break;
    case "tag":
      url = "/pages/item/list?tag_id=" + id;
      break;
    case "regactivity":
      url = "/marketing/pages/reservation/goods-reservate?activity_id=" + id;
      break;
    case "liverooms":
      url =
        "plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=" +
        id;
      break;
    case "store":
      url = `/pages/store/index?id=${id}`;
      break;
    case "custom":
      url = id;
      break;
    case "liverooms":
      url =
        "plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=" +
        id;
      break;
    default:
  }

  if (id === "pointitems") {
    url = "/pointitem/pages/list";
  }

  if (type === "other_wxapp") {
    Taro.navigateToMiniProgram({
      appId: id,
      path: title
    });
  } else {
    Taro.navigateTo({
      url
    });
  }
}

export default {};
