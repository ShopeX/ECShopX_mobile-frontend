import { configureStore } from '@reduxjs/toolkit'
import logger from 'redux-logger'
import persistReducer from 'redux-persist/lib/persistReducer'
import persistStore from 'redux-persist/lib/persistStore'

import rootReducer from './reducer'

let storage, store

if (process.env.TARO_ENV === 'weapp') {
  storage = require('redux-persist-weapp-storage/lib/bundle')
} else {
  storage = require('redux-persist/lib/storage').default
}

const reducer = persistReducer(
  {
    key: 'root',
    storage
  },
  rootReducer
)

export default function configStore (preloadedState = {}) {
  if (!store) {
    store = configureStore({
      // reducer: rootReducer,
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
      preloadedState
    })
    persistStore(store)
  }
  return store
}
