import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { RnBottomSheetProps } from "@/types";
import { hp, wp } from "@/utils";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useRef } from "react";
import { StyleSheet } from "react-native";

const RnBottomSheet: React.FC<RnBottomSheetProps> = ({
  isVisible,
  onClose,
  children,
  enablePanDownToClose = true,
  enableOverDrag = true,
  backgroundStyle,
  handleIndicatorStyle,
  containerStyle,
  handleComponent,
  onChange,
  onAnimate,
  animatedIndex,
  animatedPosition,
  keyboardBehavior = "interactive",
  keyboardBlurBehavior = "none",
  android_keyboardInputMode = "adjustResize",
  enableContentPanningGesture = true,
  enableHandlePanningGesture = true,
  enableDynamicSizing = false,
  animateOnMount = true,
  detached = false,
  style,
  scroll,
}) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const styles = StyleSheet.create({
    backgroundStyle: {
      backgroundColor: Colors[theme].background,
      borderTopLeftRadius: wp(6),
      borderTopRightRadius: wp(6),
    },
    handleIndicatorStyle: {
      backgroundColor: "transparent",
      width: wp(12),
      height: hp(0.6),
    },
    containerStyle: {
      flex: 1,
    },
    contentContainerStyle: {
      flex: 1,
      paddingHorizontal: wp(4),
    },
  });

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleDismiss = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (onChange) {
        onChange(index);
      }
    },
    [onChange]
  );

  const handleSheetAnimate = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (onAnimate) {
        onAnimate(fromIndex, toIndex);
      }
    },
    [onAnimate]
  );

  useEffect(() => {
    if (isVisible) {
      handlePresentModalPress();
    } else {
      handleDismiss();
    }
  }, [isVisible, handlePresentModalPress, handleDismiss]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.8}
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      enablePanDownToClose={enablePanDownToClose}
      backdropComponent={renderBackdrop}
      enableOverDrag={enableOverDrag}
      backgroundStyle={[styles.backgroundStyle, backgroundStyle]}
      handleIndicatorStyle={[styles.handleIndicatorStyle, handleIndicatorStyle]}
      containerStyle={[styles.containerStyle, containerStyle]}
      handleComponent={handleComponent}
      onChange={handleSheetChanges}
      onAnimate={handleSheetAnimate}
      animatedIndex={animatedIndex}
      animatedPosition={animatedPosition}
      keyboardBehavior={keyboardBehavior}
      keyboardBlurBehavior={keyboardBlurBehavior}
      android_keyboardInputMode={android_keyboardInputMode}
      enableContentPanningGesture={enableContentPanningGesture}
      enableHandlePanningGesture={enableHandlePanningGesture}
      enableDynamicSizing={enableDynamicSizing}
      animateOnMount={animateOnMount}
      detached={detached}
      style={[styles.containerStyle, style]}
      onDismiss={onClose}
    >
      {scroll ? (
        <BottomSheetScrollView
          contentContainerStyle={styles.contentContainerStyle}
        >
          {children}
        </BottomSheetScrollView>
      ) : (
        <BottomSheetView style={styles.contentContainerStyle}>
          {children}
        </BottomSheetView>
      )}
    </BottomSheetModal>
  );
};

export default RnBottomSheet;
