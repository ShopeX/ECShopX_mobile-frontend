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
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DEFAULT_THEME, DEFAULT_POINT_NAME } from '@/consts'
import { hex2rgb } from '@/utils'

//没有则获取正确的颜色
function getColor(field, value) {
  return value ? value : DEFAULT_THEME[field]
}

const { colorPrimary, colorMarketing, colorAccent } = DEFAULT_THEME

const initialState = {
  initState: false,
  colorPrimary: colorPrimary,
  colorMarketing: colorMarketing,
  colorAccent: colorAccent,
  rgb: '',
  pointName: DEFAULT_POINT_NAME(),
  pageTitle: '',
  appName: '',
  tabbar: {
    config: {
      backgroundColor: '#fff',
      color: '#333',
      selectedColor: '#1f82e0'
    },
    data: [
      {
        iconPath: '',
        name: 'home',
        pagePath: '/pages/index',
        selectedIconPath: 'home',
        text: '首页'
      },
      {
        iconPath: '',
        name: 'category',
        pagePath: '/pages/category/index',
        selectedIconPath: 'category',
        text: '分类'
      },
      {
        iconPath: '',
        name: 'cart',
        pagePath: '/pages/cart/espier-index',
        selectedIconPath: 'cart',
        text: '购物车',
        max: 99
      },
      {
        iconPath: '',
        name: 'member',
        pagePath: '/subpages/member/index',
        selectedIconPath: 'member',
        text: '我的'
      }
    ]
  },
  openStore: false,
  openRecommend: 1,
  openScanQrcode: 1,
  openOfficialAccount: 1,
  priceSetting: {
    cart_page: {
      market_price: false
    },
    item_page: {
      market_price: false,
      member_price: false,
      svip_price: false
    },
    order_page: {
      market_price: false
    }
  }
}

const sysSlice = createSlice({
  name: 'sys',
  initialState,
  reducers: {
    setSysConfig: (state, { payload }) => {
      const { colorPrimary, tabbar, colorMarketing, colorAccent } = payload
      const rgb = hex2rgb(getColor('colorPrimary', colorPrimary)).join(',')
      return {
        ...state,
        ...payload,
        colorPrimary: getColor('colorPrimary', colorPrimary),
        colorMarketing: getColor('colorMarketing', colorMarketing),
        colorAccent: getColor('colorAccent', colorAccent),
        tabbar: tabbar ? tabbar : initialState.tabbar,
        rgb
      }
    },
    updatePageTitle: (state, { payload }) => {
      const { pageTitle } = payload
      return {
        ...state,
        pageTitle
      }
    }
  }
})

export const { setSysConfig } = sysSlice.actions

export default sysSlice.reducer
