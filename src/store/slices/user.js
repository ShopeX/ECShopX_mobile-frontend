import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
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
  // 不是用户结算的默认地址，附近商家的收货地址
  address: null,
  location: {}
}

export const fetchUserFavs = createAsyncThunk( 'user/fetchUserFavs', async () => {
  const { list } = await api.member.favsList();
  return {
    list
  };
} )

export const addUserFav = createAsyncThunk( 'user/addUserFav', async (itemId) => {
  await api.member.addFav(itemId);
} )

export const deleteUserFav = createAsyncThunk("user/deleteUserFav", async itemId => {
  await api.member.delFav(itemId);
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUserInfo: (state, { payload }) => {
      const {
        memberInfo,
        cardInfo,
        vipgrade,
        is_open_popularize,
        is_promoter,
        favs
      } = payload;
      console.log(vipgrade);
      state.userInfo = {
        ...memberInfo,
        popularize: is_open_popularize,
        isPromoter: is_promoter
      };
      state.cardInfo = cardInfo;
      state.vipInfo = {
        isOpen: vipgrade.is_open,
        isVip: vipgrade.is_vip,
        vipType: vipgrade.lv_type,
        endTime: vipgrade.end_time,
        grade_name: vipgrade.grade_name
      };
      state.favs = favs
    },

    updateChooseAddress: (state, { payload }) => {
      state.address = payload;
    },

    updateLocation: (state, { payload }) => {
      state.location = payload;
    },

    clearUserInfo: (state, { payload }) => {
      state.userInfo = null;
      state.cardInfo = {};
      state.vipInfo = {
        isOpen: false,
        isVip: false,
        vipType: "",
        endTime: ""
      };
      state.showAdv = false;
      state.favs = []
      state.address = null;
      state.location = {};
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchUserFavs.fulfilled, (state, action) => {
      const { list } = action.payload;
      state.favs = list;
    });
  }
});

export const { updateUserInfo, updateChooseAddress, updateLocation } = userSlice.actions

export default userSlice.reducer
