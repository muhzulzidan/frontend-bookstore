// cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
    bookId: number;
    title: string;
    author: string;
    price: number;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    total: number;
}

const initialState: CartState = {
    items: [],
    total: 0,
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            state.items.push(action.payload);
            state.total += action.payload.price * action.payload.quantity;
        },
        removeFromCart: (state, action: PayloadAction<number>) => {
            const index = state.items.findIndex(item => item.bookId === action.payload);
            if (index !== -1) {
                state.total -= state.items[index].price * state.items[index].quantity;
                state.items.splice(index, 1);
            }
        },
        updateQuantity: (state, action: PayloadAction<{ bookId: number; quantity: number }>) => {
            const item = state.items.find(item => item.bookId === action.payload.bookId);
            if (item) {
                state.total -= item.price * item.quantity;
                item.quantity = action.payload.quantity;
                state.total += item.price * item.quantity;
            }
        },
        clearCart: state => {
            state.items = [];
            state.total = 0;
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;