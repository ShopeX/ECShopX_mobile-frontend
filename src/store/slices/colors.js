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
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
  current: {}
}

const colorsSlice = createSlice({
  name: 'colors',
  initialState,
  reducers: {
    setColor: (state, { payload }) => {
      state.current = {
        data: [
          {
            primary: payload.primary || '#d42f29',
            marketing: payload.marketing || '#fba629',
            accent: payload.accent || '#2e3030'
          }
        ]
      }
    }
  }
})

export const { setColor } = colorsSlice.actions

export default colorsSlice.reducer
