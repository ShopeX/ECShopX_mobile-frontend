
import Taro from '@tarojs/taro';
import { isWeixin } from '@/utils';

//设置系统信息
export function setSystemInfo(){ 
    if(isWeixin){
        const systemInfo=Taro.getSystemInfoSync();
        const mebuButtonObject=Taro.getMenuButtonBoundingClientRect(); 
        Taro.setStorageSync('systemInfo',{...systemInfo,menuButton:mebuButtonObject})
    }
}

//获取系统信息
export function getSystemInfo(){
    let res;
    if(isWeixin){ 
        res=Taro.getStorageSync('systemInfo')
    }
    return res={};
}

//获取导航栏高度
export const getNavbarHeight = () => { 
    //statusBarHeight是状态栏高度
    const { statusBarHeight,menuButton } = getSystemInfo();
    //获取菜单按钮（右上角胶囊按钮）的布局位置信息 
    const { top, height } = menuButton||{}; 
    //导航栏的高度
    const navbarHeight = height + (top - statusBarHeight) * 2;

    return {
        navbarHeight: navbarHeight + statusBarHeight,
        statusBarHeight: statusBarHeight
    };

}

//px转为rpx
export const pxTransform=(pxNumber)=>{
    if(isWeixin){
        const { windowWidth } = getSystemInfo(); 
        return pxNumber * (750 / windowWidth)
    }
}

