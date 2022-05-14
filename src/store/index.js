import { configureStore } from '@reduxjs/toolkit'
import logger from 'redux-logger'
// import persistReducer from 'redux-persist/lib/persistReducer'
// import persistStore from 'redux-persist/lib/persistStore'
import { persistStore, persistReducer } from 'redux-persist'
import weappStorage from './storage'

import rootReducer from './reducer'

let storage, store, persistor

if (process.env.TARO_ENV === 'weapp') {
  // storage = require('redux-persist-weapp-storage/lib/bundle')
  storage = weappStorage
} else {
  storage = require('redux-persist/lib/storage').default
}

const reducer = persistReducer(
  {
    key: 'root',
    storage,
    blacklist: ['merchant', 'select'],
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
