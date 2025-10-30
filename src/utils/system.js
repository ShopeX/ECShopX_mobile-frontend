// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
import Taro from '@tarojs/taro'
import { isWeixin } from '@/utils'

//设置系统信息
export function setSystemInfo() {
  if (isWeixin) {
    const systemInfo = Taro.getSystemInfoSync()
    const mebuButtonObject = Taro.getMenuButtonBoundingClientRect()
    Taro.setStorageSync('systemInfo', { ...systemInfo, menuButton: mebuButtonObject })
  }
}

//获取系统信息
export function getSystemInfo() {
  let res
  if (isWeixin) {
    res = Taro.getStorageSync('systemInfo')
  }
  return (res = {})
}

//获取导航栏高度
export const getNavbarHeight = () => {
  //statusBarHeight是状态栏高度
  const { statusBarHeight, menuButton } = getSystemInfo()
  //获取菜单按钮（右上角胶囊按钮）的布局位置信息
  const { top, height } = menuButton || {}
  //导航栏的高度
  const navbarHeight = height + (top - statusBarHeight) * 2

  return {
    navbarHeight: navbarHeight + statusBarHeight,
    statusBarHeight: statusBarHeight
  }
}

//px转为rpx
export const pxTransform = (pxNumber) => {
  if (isWeixin) {
    const { windowWidth } = getSystemInfo()
    return pxNumber * (750 / windowWidth)
  }
}
