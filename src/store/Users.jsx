import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
	name: "user",
	initialState: { user: null, token: "" },
	reducers: {
		login: (state, action) => {
			state.value = action.payload;
		},
		logout: (state) => {
			state.value = null;
		},
	},
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
