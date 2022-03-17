import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { WebView } from '@tarojs/components'
import qs from 'qs';
// import { getExtConfigData } from '@/utils'

import S from '@/spx'

const Index = ()=>{ 
    const { openid ,unionid,app_id,app_type,company_id }=S.get('DIANWU_CONFIG',true); 

    // const { appid,company_id }=getExtConfigData();

    const URL=`http://192.168.1.2:10086?${qs.stringify({
        in_shop_wechat:true,
        openid,
        unionid,
        app_id,
        company_id,
        app_type
    })}`;

    return <WebView src={URL} />;

}

export default Index; 
