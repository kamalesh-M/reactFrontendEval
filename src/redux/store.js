import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./userDetail"
import patientReducer from "./patientDetail"
import storage from 'redux-persist/lib/storage'
import {persistReducer, FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER} from 'redux-persist'
import { combineReducers } from '@reduxjs/toolkit'

const persistConfig = {
  key:"root",
  version:1,
  storage
}
const reducer = combineReducers({
  user:userReducer,
  patient:patientReducer
})
const persistedReducer = persistReducer(persistConfig,reducer)
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
})