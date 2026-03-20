import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist'
import { rootReducer } from './reducer';
import storage from 'redux-persist/lib/storage'; // <-- dùng cái này


const persistConfig = {
  key: "tc_software",
  storage: storage,
  whitelist: [
    "changeRateReducer",
  ],
};

const reducerPS = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: reducerPS,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

const persistor = persistStore(store)
export {store, persistor}