import { createStore, applyMiddleware } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import reducers from './reducers'

let storage
if (process.env.TARO_ENV === 'weapp') {
  storage = require('redux-persist-weapp-storage').default
} else {
  storage = require('redux-persist/lib/storage').default
}

const middlewares = [
  thunkMiddleware,
  createLogger()
]

const reducer = persistReducer({
  key: 'root',
  storage
}, reducers)

let store, persistor

export default function configStore () {
  if (!store) {
    store = createStore(reducer, applyMiddleware(...middlewares))
    persistor = persistStore(store)
  }

  return {
    store,
    persistor
  }
}


