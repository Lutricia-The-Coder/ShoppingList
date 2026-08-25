import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ShoppingItem } from "../../types";

interface ShoppingItemState {
  items: ShoppingItem[];
  loading: boolean;
  error: string | null;
}

const initialState: ShoppingItemState = {
  items: [],
  loading: false,
  error: null,
};

const shoppingItemSlice = createSlice({
  name: "shoppingItems",
  initialState,
  reducers: {
    setItems: (
      state,
      action: PayloadAction<ShoppingItem[]>
    ) => {
      state.items = action.payload;
    },

    addItem: (
      state,
      action: PayloadAction<ShoppingItem>
    ) => {
      state.items.push(action.payload);
    },

    updateItem: (
      state,
      action: PayloadAction<ShoppingItem>
    ) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },

    deleteItem: (
      state,
      action: PayloadAction<string>
    ) => {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      );
    },

    setLoading: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.loading = action.payload;
    },

    setError: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.error = action.payload;
    },

    clearItems: (state) => {
      state.items = [];
    },
  },
});

export const {
  setItems,
  addItem,
  updateItem,
  deleteItem,
  setLoading,
  setError,
  clearItems,
} = shoppingItemSlice.actions;

export default shoppingItemSlice.reducer;