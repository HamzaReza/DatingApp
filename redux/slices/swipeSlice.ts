// redux/slice/swipeSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SwipeState {
  viewedUserIds: string[];
}

const initialState: SwipeState = {
  viewedUserIds: [],
};

const swipeSlice = createSlice({
  name: "swipe",
  initialState,
  reducers: {
    addViewedUser: (state, action: PayloadAction<string>) => {
      if (!state.viewedUserIds.includes(action.payload)) {
        state.viewedUserIds.push(action.payload);
      }
    },
    resetViewedUsers: state => {
      state.viewedUserIds = [];
    },
    setViewedUsers: (state, action: PayloadAction<string[]>) => {
      state.viewedUserIds = action.payload;
    },
  },
});

export const { addViewedUser, resetViewedUsers, setViewedUsers } =
  swipeSlice.actions;
export default swipeSlice.reducer;
