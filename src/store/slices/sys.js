import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DEFAULT_THEME, DEFAULT_POINT_NAME } from '@/consts'
import { hex2rgb } from '@/utils'

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
  isCustomTabBar: false
}

const sysSlice = createSlice({
  name: 'sys',
  initialState,
  reducers: {
    setSysConfig: (state, { payload }) => {
      const { colorPrimary, tabbar } = payload
      const rgb = hex2rgb(colorPrimary ? colorPrimary : DEFAULT_THEME.colorPrimary).join(',')
      return {
        ...state,
        ...payload,
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
    },
    updateIsCustomTabBar: (state, { payload }) => {
      const { isCustomTabBar } = payload
      return {
        ...state,
        isCustomTabBar
      }
    }
  }
})

export const { setSysConfig } = sysSlice.actions

export default sysSlice.reducer
