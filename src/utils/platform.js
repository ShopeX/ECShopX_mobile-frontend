
import Taro from "@tarojs/taro";

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