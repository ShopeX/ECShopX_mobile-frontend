import Taro from "@tarojs/taro";
import { maxBy } from "lodash";

/** 在支付宝平台 */
export const isAlipay = Taro.getEnv() == Taro.ENV_TYPE.ALIPAY;
/** 在微信平台 */
export const isWeixin = Taro.getEnv() == Taro.ENV_TYPE.WEAPP;
/* 获取小程序 */
export const getAppId = () => {
  const { appid } = Taro.getExtConfigSync ? Taro.getExtConfigSync() : {};

  return appid;
};

export const closeClassName = isWeixin
  ? "at-icon at-icon-close"
  : "iconfont icon-close";

export const checkClassName = isWeixin
  ? "at-icon at-icon-check"
  : "iconfont icon-check";

export const rightClassName = isWeixin
  ? "at-icon at-icon-chevron-right"
  : "iconfont icon-arrowRight";

export const copy = isWeixin
  ? text => Taro.setClipboardData({ data: text })
  : text => {
      console.log("alipay支付成功");
      my.setClipboard({
        text,
        success: e => console.log("粘贴成功", e),
        fail: e => console.log("粘贴失败", e)
      });
    };

export const showLoading = isAlipay ? my.showLoading : Taro.showLoading;

export const hideLoading = isAlipay ? my.hideLoading : Taro.hideLoading;

//平台支付
export async function payPlatform(order = {}) {
  let payRes;
  let payErr = null;
  if (isAlipay) {
    payRes = await my.tradePay({ tradeNO: order.trade_no });
    if (!payRes.result) {
      Taro.showToast({
        title: "用户取消支付",
        icon: "none"
      });

      payErr = "用户取消支付";
    }
  } else {
    payRes = await Taro.requestPayment(order);
  }
  return {
    payRes,
    payErr
  };
}
//平台模版名称
export const platformTemplateName = isAlipay ? "onexshop" : "yykweishop";
//平台添加字段
export const payTypeField = isAlipay ? { page_type: "alipay" } : {};

export const transformPlatformUrl = url => {
  console.log("---transformPlatformUrl---", url, isWeixin);
  return isWeixin ? url.replace("/alipay", "") : url;
};
