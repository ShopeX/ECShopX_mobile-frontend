import {
	customName
  } from '@/utils/point';

export const transformTextByPoint=(isPoint=false,money,point)=>{
    if(isPoint){
        return ` ${point}${customName("积分")}`
    } 
    return ` ￥${money}`
}