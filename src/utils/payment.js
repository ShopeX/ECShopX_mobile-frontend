
import Taro from '@tarojs/taro';
import { payment_platform } from '@/utils/platform';
import { isWbWechat } from '@/utils';
import api from '@/api'

export async function getPaymentList() {
    let params={}
    const distributor_id = Taro.getStorageSync('payment_list_dtid')
    if (distributor_id) {
        params = {
            distributor_id,
            platform: isWbWechat?'wxPlatform':payment_platform
        }
    }
    let list = await api.member.getTradePaymentList(params);
    console.log("===list===",list)
    const isHasAlipay=list.some(item=>item.pay_type_code==='alipayh5');
    return {
        list,
        isHasAlipay
    }
}