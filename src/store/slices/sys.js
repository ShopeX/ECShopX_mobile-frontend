import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DEFAULT_THEME, DEFAULT_POINT_NAME } from '@/consts'

const { colorPrimary, colorMarketing, colorAccent } = DEFAULT_THEME
const initialState = {
  colorPrimary: colorPrimary,
  colorMarketing: colorMarketing,
  colorAccent: colorAccent,
  pointName: DEFAULT_POINT_NAME,
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
        pagePath: '/pages/member/index',
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
      return {
        ...state,
        tabbar: payload
      }
    }
  }
})

export const { setSysConfig } = sysSlice.actions

export default sysSlice.reducer
