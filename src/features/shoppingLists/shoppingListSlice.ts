import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ShoppingList } from "../../types";

interface ShoppingListState {
  lists: ShoppingList[];
  loading: boolean;
  error: string | null;
}

const initialState: ShoppingListState = {
  lists: [],
  loading: false,
  error: null,
};

const shoppingListSlice = createSlice({
  name: "shoppingLists",
  initialState,
  reducers: {
    setLists: (state, action: PayloadAction<ShoppingList[]>) => {
      state.lists = action.payload;
    },

    addList: (state, action: PayloadAction<ShoppingList>) => {
      state.lists.push(action.payload);
    },

    updateList: (state, action: PayloadAction<ShoppingList>) => {
      const index = state.lists.findIndex(
        (list) => list.id === action.payload.id
      );

      if (index !== -1) {
        state.lists[index] = action.payload;
      }
    },

    deleteList: (state, action: PayloadAction<string>) => {
      state.lists = state.lists.filter(
        (list) => list.id !== action.payload
      );
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setLists,
  addList,
  updateList,
  deleteList,
  setLoading,
  setError,
} = shoppingListSlice.actions;

export default shoppingListSlice.reducer;