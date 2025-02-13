import { createSlice } from "@reduxjs/toolkit";

export interface userState {
  userType: string;
  userMail: string;
}

const initialState: userState = {
  userType: "",
  userMail: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (
      state,
      action: { payload: { userMail: string; userType: string } }
    ) => {
      state.userMail = action.payload.userMail;
      state.userType = action.payload.userType;
    },
    logout: (state) => {
      state.userMail = "";
      state.userType = "";
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
