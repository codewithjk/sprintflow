
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    // add more feature slices here (e.g. org, project)
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // because of non-serializable data like cookies
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
