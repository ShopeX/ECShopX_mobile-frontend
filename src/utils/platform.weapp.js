import Taro,{getCurrentInstance} from "@tarojs/taro";

export function setPageTitle(title) {
  Taro.setNavigationBarTitle({
    title
  });
}

export const platformTemplateName = "yykweishop";

export const transformPlatformUrl = url => {
  return url
};

export const createIntersectionObserver = Taro.createIntersectionObserver