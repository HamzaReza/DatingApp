import { UserState } from "@/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { LocationObject } from "expo-location";

const initialState: UserState = {
  user: null,
  token: null,
  deviceLocation: null,
  locationPermissionGranted: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    setToken: (state, action: PayloadAction<any>) => {
      state.token = action.payload;
    },
    setDeviceLocation: (state, action: PayloadAction<LocationObject>) => {
      state.deviceLocation = action.payload;
    },
    setLocationPermissionGranted: (state, action: PayloadAction<boolean>) => {
      state.locationPermissionGranted = action.payload;
    },
    removeUser: (state, action: PayloadAction<any>) => {
      state.user = null;
      state.token = null;
      state.deviceLocation = null;
      state.locationPermissionGranted = false;
    },
  },
});

export const {
  setUser,
  setToken,
  setDeviceLocation,
  setLocationPermissionGranted,
  removeUser,
} = userSlice.actions;

export default userSlice.reducer;
