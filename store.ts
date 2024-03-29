// store.ts
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
export const store = configureStore({
    reducer: {
        counter: counterReducer,
        auth: authReducer,
        cart: cartReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;