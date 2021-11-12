import { createStore, applyMiddleware } from 'redux'
import persistReducer from 'redux-persist/lib/persistReducer'
import persistStore from 'redux-persist/lib/persistStore'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import reducers from './reducers'

let storage

if (process.env.TARO_ENV === 'weapp') {
  storage = require('redux-persist-weapp-storage/lib/bundle')
} else {
  storage = require('redux-persist/lib/storage').default
}

const isProd = process.env.NODE_ENV === 'production'

const middlewares = [thunkMiddleware, !isProd && createLogger()].filter(Boolean)

const reducer = persistReducer(
  {
    key: 'root',
    storage,
    blacklist: ['cart', 'address', 'home', 'guide']
  },
  reducers
)

let store, persistor

export default function configStore() {
  if (!store) {
    store = createStore(reducer, applyMiddleware(...middlewares))
    persistor = persistStore(store)
  }

  return {
    store,
    persistor
  }
}
