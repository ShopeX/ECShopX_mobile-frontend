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
import { configureStore } from '@reduxjs/toolkit'
import logger from 'redux-logger'
// import persistReducer from 'redux-persist/lib/persistReducer'
// import persistStore from 'redux-persist/lib/persistStore'
import { persistStore, persistReducer } from 'redux-persist'
import weappStorage from './storage'

import rootReducer from './reducer'

let storage, store, persistor

if (process.env.TARO_ENV === 'weapp' || process.env.TARO_ENV === 'alipay') {
  // storage = require('redux-persist-weapp-storage/lib/bundle')
  storage = weappStorage
} else {
  storage = require('redux-persist/lib/storage').default
}

const reducer = persistReducer(
  {
    key: 'root',
    storage,
    blacklist: ['merchant', 'select', 'sys'],
    throttle: 20
  },
  rootReducer
)

export default function configStore(preloadedState = {}) {
  if (!store) {
    store = configureStore({
      // reducer: rootReducer,
      reducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: ['persist/PERSIST']
          }
        }).concat(logger),
      preloadedState
    })
    persistor = persistStore(store)
  }
  return { store, persistor }
}
