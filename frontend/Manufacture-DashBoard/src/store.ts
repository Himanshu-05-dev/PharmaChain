import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './features/dashboard/slice/dashboard.slice';
import authReducer from './features/auth/slice/auth.slice';

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

