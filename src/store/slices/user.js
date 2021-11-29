import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
  userInfo: {},
  cardInfo: {},
  vipInfo: {
    isOpen: false,
    isVip: false,
    vipType: '',
    endTime: ''
  },
  showAdv: false,
  fav: {},
  address: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserInfo: (state, { payload }) => {
      const { memberInfo, cardInfo, vipgrade, is_open_popularize, is_promoter } = payload
      console.log(vipgrade)
      state.userInfo = {
        ...memberInfo,
        popularize: is_open_popularize,
        isPromoter: is_promoter
      }
      state.cardInfo = cardInfo
      state.vipInfo = {
        isOpen: vipgrade.is_open,
        isVip: vipgrade.is_vip,
        vipType: vipgrade.lv_type,
        endTime: vipgrade.created
      }
    },

    updateAddress: (state, { payload }) => {
      state.address = payload
    }
  }
})

export const { updateUserInfo, updateAddress } = userSlice.actions

export default userSlice.reducer
