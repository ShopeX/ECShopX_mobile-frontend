import Taro from "@tarojs/taro";

export function setPageTitle(title) {
  Taro.setNavigationBarTitle({
    title
  });
}
