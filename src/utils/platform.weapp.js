import Taro,{getCurrentInstance} from "@tarojs/taro";

export function setPageTitle(title) {
  Taro.setNavigationBarTitle({
    title
  });
}

//支付方式平台
export const payment_platform = 'wxMiniProgram'


export const platformTemplateName = "yykweishop";

export const transformPlatformUrl = url => {
  return url
};

export const createIntersectionObserver = Taro.createIntersectionObserver