import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";
import { useAppTheme } from "../../theme/useAppTheme";

const ThemedText: React.FC<TextProps> = ({ style, ...props }) => {
  const theme = useAppTheme();

  return <Text style={[{ color: theme.text }, style]} {...props} />;
};

export default ThemedText;
