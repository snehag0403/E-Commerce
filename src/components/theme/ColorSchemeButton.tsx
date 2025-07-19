import React from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Feather from "@expo/vector-icons/Feather";
import { useTheme } from "@react-navigation/native";
import { useColorScheme } from "./ColorSchemeContext";
import useAuthStore from "../../stores/useAuthStore";
import { TouchableOpacity, View } from "react-native";

// import { useColorScheme, useTheme } from "../../components";

export const ColorSchemeButton = () => {
  const   theme = useTheme();
  const { toggle, colorScheme, active } = useColorScheme();
  // console.log(toggle, "toggle", colorScheme, "colorScheme", active, "active");
  const tap = Gesture.Tap()
    .runOnJS(true)
    .onStart((e) => {
      // console.log("Tapped", e.absoluteX, e.absoluteY);
      if (!active) {
        toggle(e.absoluteX, e.absoluteY);
      }
    });
  return (
    <GestureDetector gesture={tap} >
      <View style={{ padding: 12 }}>
        <Feather
          name={colorScheme === "light" ? "moon" : "sun"}
          color={theme.colors.border}
          size={32}
        />
      </View>
      </GestureDetector>
  );
};
