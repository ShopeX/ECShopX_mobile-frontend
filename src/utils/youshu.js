import Taro from '@tarojs/taro';
import api from '@/api';
import { Tracker } from "@/service";
import { tokenParse } from "@/utils";

async function youshuLogin() {
    const { code } = await Taro.login()
    try {
        const { token } = await api.wx.login({ code })
        if (!token) throw new Error(`token is not defined: ${token}`)
        if (token) {
            // 通过token解析openid
            const userInfo = tokenParse(token);
            console.log("userInfo.openid",userInfo.openid)
            Tracker.setVar({
                user_id: userInfo.user_id,
                open_id: userInfo.openid,
                union_id: userInfo.unionid
            });
        }
    } catch (e) {
        console.error(e);
    }
}

function TracksPayed(info, config, moduleName) {

    let item_fee = info.item_fee;
    let total_fee = info.item_fee;

    if (moduleName !== 'espier-checkout') {
        item_fee = item_fee * 100;
        total_fee = item_fee * 100;
    }

    Tracker.dispatch("ORDER_PAYED", {
        ...info,
        item_fee,
        total_fee,
        ...config
    });
}

export {
    youshuLogin,
    TracksPayed
}