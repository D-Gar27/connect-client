import { createSlice } from '@reduxjs/toolkit';

export const UserSlice = createSlice({
  name: 'user',
  initialState: {
    user: {
      username: '',
      userImg: '',
      token: '',
    },
  },
  reducers: {
    restoreUserData: (state, action) => {
      state.user.username = action.payload?.username;
      state.user.token = action.payload?.token;
      state.user.userImg = action.payload?.userImg
        ? action.payload?.userImg
        : '/images/account.svg';
    },
  },
});

export const { restoreUserData } = UserSlice.actions;

export default UserSlice.reducer;
