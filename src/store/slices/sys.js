/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { $t } from '@/i18n'
import { DEFAULT_THEME, DEFAULT_POINT_NAME } from '@/consts'
import { hex2rgb } from '@/utils'

//没有则获取正确的颜色
function getColor(field, value) {
  return value ? value : DEFAULT_THEME()[field]
}

const { colorPrimary, colorMarketing, colorAccent } = DEFAULT_THEME()

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
        text: $t('1734e75c.db1c89')
      },
      {
        iconPath: '',
        name: 'category',
        pagePath: '/pages/category/index',
        selectedIconPath: 'category',
        text: $t('e6f782b6.d0771a')
      },
      {
        iconPath: '',
        name: 'cart',
        pagePath: '/pages/cart/espier-index',
        selectedIconPath: 'cart',
        text: $t('a2d3a891.c017be'),
        max: 99
      },
      {
        iconPath: '',
        name: 'member',
        pagePath: '/subpages/member/index',
        selectedIconPath: 'member',
        text: $t('e4bfc1bd.07b181')
      }
    ]
  },
  openStore: false,
  openRecommend: 1,
  openScanQrcode: 1,
  openOfficialAccount: 1,
  openWechatappLocation: 1,
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
      const { colorPrimary, tabbar, colorMarketing, colorAccent, openWechatappLocation } = payload
      const rgb = hex2rgb(getColor('colorPrimary', colorPrimary)).join(',')
      return {
        ...state,
        ...payload,
        colorPrimary: getColor('colorPrimary', colorPrimary),
        colorMarketing: getColor('colorMarketing', colorMarketing),
        colorAccent: getColor('colorAccent', colorAccent),
        tabbar: tabbar ? tabbar : initialState.tabbar,
        rgb,
        openWechatappLocation: openWechatappLocation
          ? openWechatappLocation
          : initialState.openWechatappLocation
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
