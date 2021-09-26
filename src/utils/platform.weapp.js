import Taro from "@tarojs/taro";

export function setPageTitle(title) {
  Taro.setNavigationBarTitle({
    title
  });
}

export const platformTemplateName = "onexshop";

export const transformPlatformUrl = url => {
  return url
};