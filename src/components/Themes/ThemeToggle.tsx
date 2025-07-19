import { StyleSheet, Text, TouchableOpacity, Animated } from "react-native";
import { useRef } from "react";
import useAuthStore from "../../stores/useAuthStore";
import { Typography } from "../../theme/Colors";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useAuthStore();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    // Scale animation for press effect
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Rotation animation for theme change
    Animated.timing(rotateAnim, {
      toValue: rotateAnim._value + 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    toggleTheme();
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <TouchableOpacity
      style={[
        styles.container,
        theme === "dark" ? styles.darkContainer : styles.lightContainer
      ]}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <Animated.Text
        style={[
          styles.icon,
          {
            transform: [
              { scale: scaleAnim },
              { rotate: rotateInterpolate }
            ],
          },
        ]}
      >
        {theme === "dark" ? "🌙" : "☀️"}
      </Animated.Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 35,
    height: 35,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  lightContainer: {
    backgroundColor: "#FFD700",
    borderWidth: 2,
    borderColor: "#FFA500",
  },
  darkContainer: {
    backgroundColor: "#2C2C54",
    borderWidth: 2,
    borderColor: "#40407A",
  },
  icon: {
    fontSize: 20,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
