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
import { combineReducers } from '@reduxjs/toolkit'

import userReducer from './slices/user'
import colorsReducer from './slices/colors'
import sysReducer from './slices/sys'
import cartReducer from './slices/cart'
import merchantReducer from './slices/merchant'
import shopReducer from './slices/shop'
import guideReducer from './slices/guide'
import tabBar from './slices/tab-bar'
import communityReducer from './slices/community'
import dianwuReducer from './slices/dianwu'
import purchaseReducer from './slices/purchase'
import memberReducer from './slices/member'

const rootReducer = combineReducers({
  guide: guideReducer,
  user: userReducer,
  colors: colorsReducer,
  sys: sysReducer,
  cart: cartReducer,
  merchant: merchantReducer,
  shop: shopReducer,
  tabBar: tabBar,
  community: communityReducer,
  dianwu: dianwuReducer,
  purchase: purchaseReducer,
  member: memberReducer
})

export default rootReducer
