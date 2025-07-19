import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { BaseToast, ErrorToast } from "react-native-toast-message";

export const ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={styles.success}
      text1Style={styles.text1}
      text2Style={styles.text2}

    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={styles.error}
      text1Style={styles.text1}
      text2Style={styles.text2}
    />
  ),
};

const styles = StyleSheet.create({
  success: {
    borderLeftColor: "#4CAF50",
    backgroundColor: "#E8F5E9",
    borderRadius: 10,
    width: "60%",
    // top:0
    },
  error: {
    borderLeftColor: "#f44336",
    backgroundColor: "#FFEBEE",
    borderRadius: 10,
  },
  text1: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  text2: {
    fontSize: 14,
    color: "#666",
  },
});
