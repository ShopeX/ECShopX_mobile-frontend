import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/api'

const initialState = {
  userInfo: null,
  cardInfo: {},
  vipInfo: {
    isOpen: false,
    isVip: false,
    vipType: '',
    endTime: ''
  },
  showAdv: false,
  favs: [],
  // 是用户结算的默认地址，也是附近商家的收货地址
  address: null,
  location: {},
  chiefInfo: {}, // 团长信息
  checkIsChief: true // 检查是否是团长
}

export const fetchUserFavs = createAsyncThunk('user/fetchUserFavs', async (params) => {
  const { list } = await api.member.favsList(params)
  return {
    list
  }
})

export const addUserFav = createAsyncThunk('user/addUserFav', async (itemId) => {
  await api.member.addFav(itemId)
})

export const deleteUserFav = createAsyncThunk('user/deleteUserFav', async (itemId) => {
  await api.member.delFav(itemId)
})

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserInfo: (state, { payload }) => {
      const { deposit, memberInfo, cardInfo, vipgrade, is_open_popularize, is_promoter, favs } =
        payload
      state.userInfo = {
        ...memberInfo,
        popularize: is_open_popularize,
        isPromoter: is_promoter,
        deposit: deposit / 100 // 储值余额
      }
      state.cardInfo = cardInfo
      state.vipInfo = {
        isOpen: vipgrade.is_open,
        isVip: vipgrade.is_vip,
        vipType: vipgrade.lv_type,
        endTime: vipgrade.end_time,
        grade_name: vipgrade.grade_name
      }
      state.favs = favs
    },

    updateChooseAddress: (state, { payload }) => {
      state.address = payload
    },
    updateLocation: (state, { payload }) => {
      state.location = payload
    },

    closeAdv: (state, { payload }) => {
      state.showAdv = payload
    },

    clearUserInfo: (state, { payload }) => {
      state.userInfo = null
      state.cardInfo = {}
      state.vipInfo = {
        isOpen: false,
        isVip: false,
        vipType: '',
        endTime: ''
      }
      state.showAdv = false
      state.favs = []
      state.address = null
      state.location = {}
    },

    updateCheckChief: (state, { payload }) => {
      const { status, result } = payload
      state.checkIsChief = status
      state.chiefInfo = result
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserFavs.fulfilled, (state, action) => {
      const { list } = action.payload
      state.favs = list
    })
  }
})

export const { updateUserInfo, updateChooseAddress, updateLocation, updateCheckChief } =
  userSlice.actions

export default userSlice.reducer
