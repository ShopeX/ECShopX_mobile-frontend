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
        selectedIconPath: '',
        text: '首页'
      },
      {
        iconPath: '',
        name: 'home',
        pagePath: '/pages/category/index',
        selectedIconPath: '',
        text: '分类'
      },
      {
        iconPath: '',
        name: 'home',
        pagePath: '/pages/cart/espier-index',
        selectedIconPath: '',
        text: '购物车'
      },
      {
        iconPath: '',
        name: 'home',
        pagePath: '/subpages/member/index',
        selectedIconPath: '',
        text: '我的'
      }
    ]
  }
}

const sysSlice = createSlice({
  name: 'sys',
  initialState,
  reducers: {
    setSysConfig: (state, { payload }) => {
      const { colorPrimary } = payload
      const rgb = hex2rgb(colorPrimary).join(',')
      return {
        ...state,
        ...payload,
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
