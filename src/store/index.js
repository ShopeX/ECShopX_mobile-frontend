import { configureStore } from '@reduxjs/toolkit'
import logger from 'redux-logger'
import rootReducer from './reducer'

let store
export default function configStore(preloadedState = {}) {
  if (!store) {
    store = configureStore({
      reducer: rootReducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
      preloadedState
    })
  }
  return store
}

