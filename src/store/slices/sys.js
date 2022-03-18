import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DEFAULT_THEME, DEFAULT_POINT_NAME } from '@/consts'
import { hex2rgb } from '@/utils'

//没有则获取正确的颜色
function getColor(field, value) {
  return value ? value : DEFAULT_THEME[field]
}

const { colorPrimary, colorMarketing, colorAccent } = DEFAULT_THEME

const initialState = {
  colorPrimary: colorPrimary,
  colorMarketing: colorMarketing,
  colorAccent: colorAccent,
  rgb: '',
  pointName: DEFAULT_POINT_NAME,
  pageTitle: '',
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
  openStore: true,
  openRecommend: 1,
  openScanQrcode: 1,
  openLocation: 1,
  openOfficialAccount: 1
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
