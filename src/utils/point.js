import Taro,{getCurrentInstance} from "@tarojs/taro";
import configStore from "@/store";

const store = configStore()
// const DEFAULT_NAME = "积分";
// const CUSTOM_NAME = Taro.getStorageSync("custom_point_name") || DEFAULT_NAME;

// export const customName = name => {
//   if (name.length === 1) {
//     return CUSTOM_NAME.substr(0, 1);
//   }
//   if (name) {
//     return name.replace(new RegExp(DEFAULT_NAME), CUSTOM_NAME);
//   }
// };

export const getPointName = function() {
  const { system } = store.getState();
  return system.pointName;
};
