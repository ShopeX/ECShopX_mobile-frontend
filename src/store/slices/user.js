import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { getDistributorId } from '@/utils'
import { defaultLang } from '@/utils/lang'
import api from '@/api'

console.log('defaultLang', defaultLang)
const initialState = {
  userInfo: null,
  isNewUser: false,
  cardInfo: {},
  lang: defaultLang,
  vipInfo: {
    isOpen: false,
    isVip: false,
    vipType: '',
    endTime: ''
  },
  showAdv: false,
  favs: [],
  // 是用户结算的默认地址，也是附近商家的收货地址
  location: null,
  chiefInfo: {}, // 团长信息
  checkIsChief: true, // 检查是否是团长
  address: {
    province: '北京市',
    city: '北京市',
    area: '昌平区',
    lat: '40.220415',
    lng: '116.234890'
  }
}

export const fetchUserFavs = createAsyncThunk('user/fetchUserFavs', async (params) => {
  const { list } = await api.member.favsList({
    ...params,
    distributor_id: params?.distributor_id || getDistributorId()
  })
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
      const {
        deposit,
        memberInfo,
        cardInfo,
        vipgrade,
        is_open_popularize,
        is_promoter,
        favs,
        salesPersonList
      } = payload
      state.userInfo = {
        ...memberInfo,
        salesPersonList,
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

    updateIsNewUser: (state, { payload }) => {
      state.isNewUser = payload
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
    updateLang: (state, { payload }) => {
      state.lang = payload
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
      state.isNewUser = true
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

export const {
  updateUserInfo,
  updateChooseAddress,
  updateLocation,
  updateCheckChief,
  clearUserInfo,
  updateIsNewUser,
  updateLang
} = userSlice.actions

export default userSlice.reducer
