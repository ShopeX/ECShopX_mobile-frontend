import Taro from "@tarojs/taro";
import api from "@/api";
import { Tracker } from "@/service";

async function youshuLogin() {
  try {
    const {openid,unionid}= await getOpenId();
    if (openid) {
      // 通过token解析openid
      Tracker.setVar({
        open_id: openid,
        union_id: unionid
      });
    }
  } catch (e) {
    console.error(e);
  }
}

/**获取openid以及 unionid*/
export async function getOpenId(){
  let openid;
  let unionid;
  let code;
  try{
    let logRes = await Taro.login();
    let res = await api.wx.getYoushuOpenid({ code:logRes.code });
    openid=res.openid;
    unionid=res.unionid;
  }catch(e){}
  return {
    openid,
    unionid,
    code
  }
}

function TracksPayed(info, config, moduleName) {
  let item_fee = info.item_fee;
  let total_fee = info.item_fee;

  if (moduleName !== "espier-checkout") {
    item_fee = item_fee * 100;
    total_fee = item_fee * 100;
  }

  Tracker.dispatch("ORDER_PAYED", {
    ...info,
    item_fee,
    total_fee,
    ...config
  });
}

function getYoushuAppid() {
  const { appid } = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
  const {
    youshu: { weapp_app_id }
  } = Taro.getStorageSync("otherSetting");
  return weapp_app_id || appid;
}

export { youshuLogin, TracksPayed, getYoushuAppid };
