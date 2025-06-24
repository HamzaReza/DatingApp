import { IconNode, TextProps, ViewProps } from "@rneui/base";
import { ReactElement, ReactNode } from "react";
import {
  KeyboardTypeOptions,
  StatusBarProps,
  StatusBarStyle,
  StyleProp,
  TextStyle,
  ViewStyle
} from "react-native";
import { ToastPosition } from "react-native-toast-message";

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
  backButton(): void;
  backDrop?: () => void;
  children: ReactNode;
}

export interface RnToastProps {
  type: string;
  message: string;
  heading?: string;
  position?: ToastPosition;
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
  setUri: (obj: {
    uri: string;
    path: string;
    type: string;
    name: string;
  }) => void;
  visible: boolean;
  showPicker(): void;
  hidePicker(): void;
  children: ReactElement;
}

export interface ListItemType {
  title: string;
  icon: string;
  onPress(): void;
}

export interface RnAvatarProps {
  avatarHeight?: number;
  showAvatarIcon?: boolean;
  source?: {uri: string} | null;
  style?: StyleProp<ViewStyle>;
}

export interface RnSliderProps  {
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
  multiple?: boolean;
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
  setItems: React.Dispatch<React.SetStateAction<{ label: string; value: any; [key: string]: any }[]>>;
  setValue: React.Dispatch<React.SetStateAction<any>>;
  loading?: boolean;
}