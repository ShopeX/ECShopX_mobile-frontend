
import Taro from '@tarojs/taro';
import { payment_platform } from '@/utils/platform';
import api from '@/api'

export async function getPaymentList() {
    let params={}
    const distributor_id = Taro.getStorageSync('payment_list_dtid')
    if (distributor_id) {
        params = {
            distributor_id,
            platform: payment_platform
        }
    }
    let list = await api.member.getTradePaymentList(params);
    const isHasAlipay=list.some(item=>item==='alipayh5');
    return {
        list,
        isHasAlipay
    }
}