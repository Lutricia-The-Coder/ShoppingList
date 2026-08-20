import { createSlice, type PayloadAction } from "@reduxjs/toolkit"; //added type
import type { User } from "../../types";

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  currentUser: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },

    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;