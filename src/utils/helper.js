import {
	customName
  } from '@/utils/point';
  import Taro, { Component } from "@tarojs/taro";

export const transformTextByPoint=(isPoint=false,money,point)=>{
    if(isPoint){
        return ` ${point}${customName("积分")}`
    } 
    return ` ￥${money}`
}

export const getDistributorId=()=>{
  const { distributor_id,store_id } = Taro.getStorageSync('curStore')||{}
  const otherSetting = Taro.getStorageSync('otherSetting')||{}
  const id=otherSetting.nostores_status?store_id:distributor_id;
  return id;
}