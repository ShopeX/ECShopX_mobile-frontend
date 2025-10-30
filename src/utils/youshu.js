// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
import Taro, { getCurrentInstance } from '@tarojs/taro'
import api from '@/api'
import { getAppId } from '@/utils'
// import { Tracker } from "@/service";

async function youshuLogin() {
  try {
    const { openid, unionid } = await getOpenId()
    if (openid) {
      // 通过token解析openid
      // Tracker.setVar({
      //   open_id: openid,
      //   union_id: unionid
      // });
    }
  } catch (e) {
    console.error(e)
  }
}

/**获取openid以及 unionid*/
export async function getOpenId() {
  let openid
  let unionid
  let code
  try {
    let logRes = await Taro.login()
    code = logRes.code
    let res = await api.wx.getYoushuOpenid({ code })
    openid = res.openid
    unionid = res.unionid
  } catch (e) {}
  return {
    openid,
    unionid,
    code
  }
}

function TracksPayed(info, config, moduleName) {
  let item_fee = info.item_fee
  let total_fee = info.item_fee

  if (moduleName !== 'espier-checkout') {
    item_fee = item_fee * 100
    total_fee = item_fee * 100
  }

  // Tracker.dispatch("ORDER_PAYED", {
  //   ...info,
  //   item_fee,
  //   total_fee,
  //   ...config
  // });
}

function getYoushuAppid() {
  const appid = getAppId()
  const {
    youshu: { weapp_app_id }
  } = Taro.getStorageSync('otherSetting')
  return weapp_app_id || appid
}

export { youshuLogin, TracksPayed, getYoushuAppid }
