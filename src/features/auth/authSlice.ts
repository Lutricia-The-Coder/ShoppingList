
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { StoredUser, User } from "../../types";

interface AuthState {
  currentUser: StoredUser | null;
  isAuthenticated: boolean;
}

const getStoredUser = (): StoredUser | null => {
  try {
    const storedUser = localStorage.getItem("shoppingListUser");

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser) as StoredUser;
  } catch {
    localStorage.removeItem("shoppingListUser");
    return null;
  }
};

const storedUser = getStoredUser();

const initialState: AuthState = {
  currentUser: storedUser,
  isAuthenticated: storedUser !== null,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    login: (state, action: PayloadAction<User>) => {
      const { password, ...safeUser } = action.payload;

      state.currentUser = safeUser;
      state.isAuthenticated = true;

      localStorage.setItem(
        "shoppingListUser",
        JSON.stringify(safeUser)
      );
    },

  
    updateCurrentUser: (
      state,
      action: PayloadAction<StoredUser>
    ) => {
      state.currentUser = action.payload;

      localStorage.setItem(
        "shoppingListUser",
        JSON.stringify(action.payload)
      );
    },

    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;

      localStorage.removeItem("shoppingListUser");
    },
  },
});

export const {
  login,
  updateCurrentUser,
  logout,
} = authSlice.actions;

export default authSlice.reducer;

