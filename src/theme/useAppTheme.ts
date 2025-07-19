import { darkTheme, lightTheme } from "../components/theme/Theme";
import useAuthStore from "../stores/useAuthStore";

export const useAppTheme = () => {
  const theme = useAuthStore((state) => state.theme);
  return theme === "dark" ? darkTheme.colors : lightTheme.colors;
};
