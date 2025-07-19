import React from "react";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import RootNavigator from "./src/navigation/RootNavigator";
import { SafeAreaView, StatusBar, useColorScheme, View } from "react-native";
import { Typography } from "./src/theme/Colors";
import useAuthStore from "./src/stores/useAuthStore";
import Toast from "react-native-toast-message";
import { ToastConfig } from "./src/components/toast/ToastConfig";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ColorSchemeProvider } from "./src/components/theme/ColorSchemeContext";
import { ThemeProvider } from "@shopify/restyle";
import { darkTheme } from "./src/components/theme/Theme";
export default function App() {
  
  const colorScheme = useColorScheme();
  const theme = useAuthStore((state) => state.theme);
  return (
    <GestureHandlerRootView style={{ flex: 1}}>
      <ColorSchemeProvider>
        <ThemeProvider theme={colorScheme === "dark" ? darkTheme : theme}>
          <NavigationContainer >
              <RootNavigator />
            <StatusBar
              barStyle={theme === "dark" ? "light-content" : "dark-content"}
              backgroundColor={
                theme === "dark"
                  ? Typography.Colors.charcol
                  : Typography.Colors.barColor
              }
            />
            <Toast config={ToastConfig} />
          </NavigationContainer>
        </ThemeProvider>
      </ColorSchemeProvider>
    </GestureHandlerRootView>
  );
}
