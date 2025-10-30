// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  //商户类型
  merchantType: {},
  //经营范围
  businessScope: {},
  //银行
  bank: { name: '' }
}

const merchantSlice = createSlice({
  name: 'merchant',
  initialState,
  reducers: {
    updateMerchantType: (state, { payload }) => {
      state.merchantType = payload
    },
    updateBusinessScope: (state, { payload }) => {
      state.businessScope = payload
    },
    updateBank: (state, { payload }) => {
      state.bank = payload
    }
  }
})

export const { updateMerchantType, updateBusinessScope, updateBank } = merchantSlice.actions

export default merchantSlice.reducer
