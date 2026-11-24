import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Состояние интерфейса после авторизации. После F5 возвращается в состояние гостя (JWT при этом остаётся в localStorage)
interface AuthState {
  isAuthenticated: boolean;
  username: string;
  token: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  username: "",
  token: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ username: string; token: string }>) {
      state.isAuthenticated = true;
      state.username = action.payload.username;
      state.token = action.payload.token;
    },
    logoutSuccess() {
      return initialState;
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;
