
import Taro from "@tarojs/taro";
import { maxBy } from "lodash";

/** 在支付宝平台 */
export const isAlipay = Taro.getEnv() == Taro.ENV_TYPE.ALIPAY;
/** 在微信平台 */
export const isWeixin = Taro.getEnv() == Taro.ENV_TYPE.WEAPP;
/* 获取小程序 */
export const getAppId = () => {
    const { appid } = Taro.getExtConfigSync
        ? Taro.getExtConfigSync()
        : {};

    return appid
}

export const closeClassName=isWeixin?'at-icon at-icon-close':'iconfont icon-close';

export const checkClassName=isWeixin?'at-icon at-icon-check':'iconfont icon-check';

export const rightClassName=isWeixin?'at-icon at-icon-chevron-right':'iconfont icon-arrowRight';

export const copy=isWeixin?(text)=>Taro.setClipboardData({data:text}):(text)=>{console.log('alipay支付成功');my.setClipboard({text,success:(e)=>console.log("粘贴成功",e),fail:(e)=>console.log("粘贴失败",e)})}