import { useFocusEffect } from "@react-navigation/native";
import * as ScreenCapture from "expo-screen-capture";
import React from "react";

export const useScreenCapture = () => {
  useFocusEffect(
    React.useCallback(() => {
      ScreenCapture.preventScreenCaptureAsync();

      return () => {
        ScreenCapture.allowScreenCaptureAsync();
      };
    }, [])
  );
};

export default useScreenCapture;
