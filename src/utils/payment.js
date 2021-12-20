import Taro from "@tarojs/taro";
import { payment_platform } from "@/utils/platform";
import { isWxWeb } from "@/utils";
import api from "@/api";

export default async function getPaymentList() {
  let params = {};
  const distributor_id = Taro.getStorageSync("payment_list_dtid");
  if (distributor_id) {
    params = {
      distributor_id,
      platform: isWxWeb ? "wxPlatform" : payment_platform,
    };
  }
  let list = await api.member.getTradePaymentList(params);
  console.log("===list===", list);
  const isHasAlipay = list.some((item) => item.pay_type_code === "alipayh5");
  return {
    list,
    isHasAlipay,
  };
}
