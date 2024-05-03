import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import * as  storage from "lib/storage/Storage";
import { userSlice } from "features/user/UserSlice";
import { floorSlice } from "features/registration/FloorSlice";

const userSlicePersistConfig = {
  key: "userSlice",
  storage,
}

const reducers = combineReducers({
  [userSlice.reducerPath]: userSlice.reducer,
  [floorSlice.reducerPath]: floorSlice.reducer,
});

const persistedReducer = persistReducer(userSlicePersistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(floorSlice.middleware, userSlice.middleware),
});

export const persistor = persistStore(store);

