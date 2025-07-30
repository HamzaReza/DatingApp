import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import userSlice from "./userSlice";
import swipeSlice from "./swipeSlice";

const rootReducer = combineReducers({
  user: userSlice,
  swipe: swipeSlice,
});

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  blacklist: [""],
  whitelist: ["user"],
};

export const persistedReducer = persistReducer(persistConfig, rootReducer);
