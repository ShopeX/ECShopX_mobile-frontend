/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  shopInfo: {},
  salespersonInfo: {},
  zitiShop: null,
  showGuideConsultModal: false // 全局企微导购联系弹框（与 FloatSalesperson 一致）
}

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    updateShopInfo: (state, { payload }) => {
      state.shopInfo = payload
    },
    updateSalesperson: (state, { payload }) => {
      state.salespersonInfo = payload
    },
    changeZitiStore: (state, { payload }) => {
      state.zitiShop = payload
    },
    setShowGuideConsultModal: (state, { payload }) => {
      state.showGuideConsultModal = !!payload
    }
  }
})

export const { updateShopInfo, updateSalesperson, changeZitiStore, setShowGuideConsultModal } =
  shopSlice.actions

export default shopSlice.reducer
