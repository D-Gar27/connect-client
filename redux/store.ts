import { configureStore } from '@reduxjs/toolkit';
import UserReducer from './userSlice';
import ChatReducer from './chatSlice';

const store = configureStore({
  reducer: {
    user: UserReducer,
    chat: ChatReducer,
  },
});

export default store;
