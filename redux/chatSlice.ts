import { createSlice } from '@reduxjs/toolkit';

export const ChatSlice = createSlice({
  name: 'chat',
  initialState: {
    chat: null,
    isOpen: false,
    onlineUsers: null,
  },
  reducers: {
    restoreChat: (state, action) => {
      state.chat = action.payload;
      state.isOpen = true;
    },
    currentChat: (state, action) => {
      state.chat = action.payload;
      state.isOpen = true;
    },
    closeMsgbox: (state, action) => {
      state.isOpen = false;
    },
    addOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const { restoreChat, currentChat, closeMsgbox, addOnlineUsers } =
  ChatSlice.actions;

export default ChatSlice.reducer;
