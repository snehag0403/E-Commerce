import React, { forwardRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
  TextStyle,
  KeyboardTypeOptions,
} from "react-native";
import { Typography } from "../../theme/Colors";
import Icon from "react-native-vector-icons/Octicons";

type CustomTextInputProps = {
  label?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  mainContainerStyle?:ViewStyle,
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  autoFocus?: boolean;
  maxLength?: number;
  editable?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  iconname?: string;
  iconsize?: number;
  iconcolor?: string;
  selection?: any;
  error?: string;
  onValidate?: (val: string) => boolean;
  setError?: (err: string) => void;
} & TextInputProps;

const CustomTextInput = forwardRef<TextInput, CustomTextInputProps>(
  (
    {
      label,
      value = "",
      onChangeText,
      placeholder,
      secureTextEntry = false,
      keyboardType = "default",
      mainContainerStyle,
      containerStyle,
      inputStyle,
      labelStyle,
      autoFocus,
      maxLength,
      editable = true,
      multiline = false,
      numberOfLines = 1,
      iconname,
      iconsize,
      iconcolor,
      selection,
      error,
      onValidate,
      setError,
      onChange,
      ...rest
    },
    ref
  ) => {
    const handleChange = (text: string) => {
      onChangeText?.(text);
      if (onValidate && onValidate(text)) {
        setError?.("");
      }
    };

    return (
      <View style={[styles.mainContainer, mainContainerStyle]}>
        <View style={[styles.container, containerStyle]}>
          {iconname && (
            <Icon
              name={iconname}
              size={iconsize}
              color={iconcolor}
              style={styles.iconStyle}
            />
          )}
          <TextInput
            ref={ref}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoFocus={autoFocus}
            maxLength={maxLength}
            editable={editable}
            multiline={multiline}
            numberOfLines={numberOfLines}
            style={[styles.input, inputStyle]}
            selection={selection}
            onChange={onChange}
            {...rest}
          />
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  mainContainer:{
marginBottom:18
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Typography.Colors.white,
    borderWidth: 0.5,
    borderColor: Typography.Colors.greydark,
    borderRadius: 6,
    padding: 10,
  },
  input: {
    flex: 1,
    padding: 5,
    fontSize: 16,
    marginRight: 10,
  },
  iconStyle: {
    marginTop: 5,
    marginBottom: 5,
    marginRight: 10,
    marginLeft: 18.19,
  },
  errorText: {
    color: Typography.Colors.red,
    fontSize: 14,
    marginTop: 4,
    marginLeft: 10,
  },
});

export default CustomTextInput;
