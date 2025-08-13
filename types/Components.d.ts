import { BottomSheetHandleProps } from "@gorhom/bottom-sheet";
import { BackdropPressBehavior } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import { IconNode, TextProps, ViewProps } from "@rneui/base";
import { ReactElement, ReactNode } from "react";
import {
  KeyboardTypeOptions,
  StatusBarProps,
  StatusBarStyle,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import { ToastPosition, ToastType } from "react-native-toast-message";

export interface RnInputProps {
  value: string;
  maxLength?: number;
  onChangeText(e: string): void;
  onChange?(e: any): void;
  onBlur?(e: any): void;
  onFocus?(e: any): void;
  keyboardType?: KeyboardTypeOptions;
  error?: string;
  errorStyle?: StyleProp<TextStyle>;
  secureTextEntry?: boolean;
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  placeholder: string;
  leftIcon?: IconNode;
  rightIcon?: IconNode;
  noError?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  editable?: boolean;
}

export interface RnBottomSheetInputProps {
  value: string;
  maxLength?: number;
  onChangeText(e: string): void;
  onBlur?(e: any): void;
  onFocus?(e: any): void;
  keyboardType?: KeyboardTypeOptions;
  error?: string;
  errorStyle?: StyleProp<TextStyle>;
  secureTextEntry?: boolean;
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  placeholder: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  noError?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  editable?: boolean;
}

export interface RnPhoneInputProps {
  value: string;
  onChangeText(e: string): void;
  error?: string;
  errorStyle?: StyleProp<TextStyle>;
}

export interface RnButtonProps {
  loading?: boolean;
  disabled?: boolean;
  style: any;
  onPress?(): void;
  hitSlop?: {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
  };
  title: string;
  icon?: string | undefined;
  loaderColor?: string;
  children?: ReactNode;
  noRightIcon?: boolean;
  rightIconColor?: string;
  leftIconColor?: string;
  leftIconSize?: number;
}

export interface RnTextProps extends TextProps {
  onPress?: () => void;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  selectable?: boolean;
  children: ReactNode;
}

export interface RnContainerProps {
  topBar?: ReactElement;
  children?: ReactNode;
  customStyle?: StyleProp<ViewStyle>;
  props?: ViewProps;
}

export interface RnHeaderProps {
  statusbar?: StatusBarProps;
  barStyle?: StatusBarStyle;
  centerComponent?: HeaderSubComponent;
  leftComponent?: HeaderSubComponent;
  rightComponent?: HeaderSubComponent;
  centerText?: string;
  backgroundColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
  centerContainerStyle?: StyleProp<ViewStyle>;
  leftContainerStyle?: StyleProp<ViewStyle>;
  rightContainerStyle?: StyleProp<ViewStyle>;
  centerTextStyle?: StyleProp<TextStyle>;
}

export interface RnModalProps {
  show: boolean;
  backButton?: () => void;
  backDrop?: () => void;
  children: ReactNode;
}

export interface RnToastProps {
  type?: ToastType;
  message: string;
  heading?: string;
  position?: ToastPosition;
  onHide?: () => void;
}

export interface RnOtpProps {
  verifyCode(input: string): void;
  isError: boolean;
  value: string;
  cell?: number;
  style?: ViewStyle;
  error?: string;
}

export interface RnProgressBarProps {
  progress: number;
  height?: number;
  width?: number;
  style?: StyleProp<ViewStyle>;
}

export interface RnWheelPickerProps {
  dataSource: string[];
  selectedIndex: number;
  renderItem: (data: string, index: number) => ReactNode;
  onValueChange: (data: string | undefined, selectedIndex: number) => void;
  wrapperHeight?: number;
  wrapperBackground?: string;
  itemHeight?: number;
  highlightColor?: string;
  highlightBorderWidth?: number;
}

export interface RnImagePickerProps {
  setUri: (
    obj: Multiple extends true
      ? { uri: string; path: string; type: string; name: string }[]
      : { uri: string; path: string; type: string; name: string }
  ) => void;
  visible: boolean;
  showPicker(): void;
  hidePicker(): void;
  children: ReactElement;
  multiple?: boolean;
}

export interface ListItemType {
  title: string;
  icon: string;
  onPress(): void;
}

export interface RnAvatarProps {
  avatarHeight?: number;
  showAvatarIcon?: boolean;
  source?: string | undefined | null;
  style?: StyleProp<ViewStyle>;
}

export interface RnSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  style?: StyleProp<ViewStyle>;
  thumbColor?: string;
  trackColor?: string;
  minimumTrackTintColor?: string;
  maximumTrackTintColor?: string;
  thumbStyle?: any;
  trackStyle?: any;
}

export interface RnDropdownProps {
  onOpen?: () => void;
  value: any;
  items: { label: string; value: any; [key: string]: any }[];
  open: boolean;
  min?: number;
  max?: number;
  zIndex?: number;
  zIndexInverse?: number;
  placeholder?: string;
  placeholderStyle?: StyleProp<TextStyle>;
  emptyText?: string;
  onChangeValue?: (value: any) => void;
  style?: StyleProp<ViewStyle>;
  dropDownContainerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setItems: React.Dispatch<
    React.SetStateAction<{ label: string; value: any; [key: string]: any }[]>
  >;
  setValue: React.Dispatch<React.SetStateAction<any>>;
  loading?: boolean;
  dropdownText?: StyleProp<TextStyle>;
  multiple?: boolean;
}

export interface RnBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  children: ReactNode;
  enablePanDownToClose?: boolean;
  enableOverDrag?: boolean;
  backgroundStyle?: StyleProp<ViewStyle>;
  handleIndicatorStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  handleComponent?: React.FC<BottomSheetHandleProps> | null;
  onChange?: (index: number) => void;
  onAnimate?: (fromIndex: number, toIndex: number) => void;
  animatedIndex?: any;
  animatedPosition?: any;
  keyboardBehavior?: "interactive" | "extend" | "fillParent";
  keyboardBlurBehavior?: "none" | "restore";
  android_keyboardInputMode?: "adjustResize" | "adjustPan";
  enableContentPanningGesture?: boolean;
  enableHandlePanningGesture?: boolean;
  enableOverDrag?: boolean;
  enablePanDownToClose?: boolean;
  enableDynamicSizing?: boolean;
  animateOnMount?: boolean;
  detached?: boolean;
  style?: StyleProp<ViewStyle>;
  scroll?: boolean;
  snapPoints?: string[];
  pressBehavior?: BackdropPressBehavior;
}

export interface RnDateTimePickerProps {
  value: Date;
  onChange: (event: any, selectedDate?: Date) => void;
  mode?: "date" | "time" | "datetime";
  display?: "default" | "spinner" | "calendar" | "clock";
  placeholder?: string;
  label?: string;
  error?: string;
  errorStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  minimumDate?: Date;
  maximumDate?: Date;
  minuteInterval?: 1 | 2 | 3 | 4 | 5 | 6 | 10 | 12 | 15 | 20 | 30;
  timeZoneOffsetInMinutes?: number;
  timeZoneName?: string;
  textColor?: string;
  accentColor?: string;
  neutralButtonLabel?: string;
  positiveButtonLabel?: string;
  negativeButtonLabel?: string;
  is24Hour?: boolean;
  disabled?: boolean;
}

export interface SvgIconProps {
  svgString: string;
  width?: number;
  height?: number;
  color?: string;
}
