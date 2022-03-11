import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { WebView } from '@tarojs/components'

const Index = ()=>{

    const URL='http://192.168.1.2:10086/?in_shop_wechat=true';

    return <WebView src={URL}></WebView>

}

export default Index; 
