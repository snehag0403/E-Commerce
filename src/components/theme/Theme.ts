import {
  createBox,
  createText,
  createTheme,
  useTheme as useThemeRS,
} from "@shopify/restyle";

import type { ColorSchemeName } from "./ColorSchemeContext";

const palette = {
  black: "#1C2128",
  lightPink: "#fef8f8",
  lightGray: "rgba(0, 0, 0, 0.04)",
  darkGray: "#3B3B3B",
  white:"#FFFFFF"
};

export const lightTheme = createTheme({
  colorScheme: "light" as ColorSchemeName,
  colors: {
    mainBackground: palette.lightPink,
    mainForeground: palette.black,
    secondaryBackground: palette.lightGray,
    text:palette.black
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  textVariants: {
    defaults: {
      color: "mainForeground",
    },
    header: {
      fontWeight: "bold",
      fontSize: 30,
      fontFamily: "SFProDisplayBold",
    },
    item: {
      fontWeight: "bold",
      fontSize: 16,
      fontFamily: "SFProDisplayBold",
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
    },
  },
});

export const darkTheme: Theme = {
  ...lightTheme,
  colorScheme: "dark",
  colors: {
    ...lightTheme.colors,
    mainBackground: palette.black,
    mainForeground: palette.lightPink,
    secondaryBackground: palette.darkGray,
    text:palette.white
  },
};

export type Theme = typeof lightTheme;

export const Box = createBox<Theme>();
export const Text = createText<Theme>();
export const useTheme = useThemeRS<Theme>;
