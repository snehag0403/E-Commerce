// import React from "react";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import {
//   Image,
//   StyleSheet,
//   View,
//   TouchableOpacity,
//   Text,
// } from "react-native";
// import { assets } from "../../assets/images";
// import HomeNavigator from "./HomeNavigator";
// import SearchNavigator from "./SearchNavigator";
// import WishlistNavigator from "./WishlistNavigator";
// import ProfileNavigator from "./ProfileNavigator";
// import CartNavigator from "./CartNavigator";
// import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
// import useAuthStore from "../stores/useAuthStore";
// import { Typography } from "../theme/Colors";

// function getTabBarVisibility(route: any) {
//   const routeName = getFocusedRouteNameFromRoute(route) ?? "ProfileScreen";
//   const hideOnScreens = [
//     "MyOrdersScreen",
//     "EditProfile",
//     "ChangePasswordScreen",
//     "Passwordchange",
//     "PrivacyPolicy",
//     "TermsnConditions",
//     "AboutSection",
//     "HelpScreen",
//     "DeliveryAddress",
//     "AddAddressList",
//     "PromoCodeScreen",
//   ];
//   return hideOnScreens.includes(routeName);
// }

// function getTabBarVisibilityForHome(route: any) {
//   const routeName = getFocusedRouteNameFromRoute(route) ?? "HomeScreen";
//   const hideOnScreens = ["ProductDetailPage", "ProductsPage", "Category"];
//   return hideOnScreens.includes(routeName);
// }

// function getTabBarVisibilityForSearch(route: any) {
//   const routeName = getFocusedRouteNameFromRoute(route) ?? "SearchScreen";
//   const hideOnScreens = ["ProductDetailPage", "ProductsPage"];
//   return hideOnScreens.includes(routeName);
// }

// function getTabBarVisibilityForCart(route: any) {
//   const routeName = getFocusedRouteNameFromRoute(route) ?? "CartScreen";
//   const hideOnScreens = [
//     "OrderScreen",
//     "PromoCodeScreen",
//     "DeliveryAddress",
//     "AddAddressList",
//   ];
//   return hideOnScreens.includes(routeName);
// }

// function CustomTabBar({ state, descriptors, navigation }) {
//   const themeMode = useAuthStore((state) => state.theme);
//   const theme =
//     themeMode === "dark"
//       ? {
//           background: Typography.Colors.charcol,
//           text: Typography.Colors.white,
//         }
//       : {
//           background: Typography.Colors.navigatorColor,
//           text: Typography.Colors.black,
//         };

//   // Check if tab bar should be hidden for any route
//   const shouldHideTabBar = () => {
//     const currentRoute = state.routes[state.index];
//     const routeName = currentRoute.name;

//     switch (routeName) {
//       case "HomeNavigator":
//         return getTabBarVisibilityForHome(currentRoute);
//       case "SearchNavigator":
//         return getTabBarVisibilityForSearch(currentRoute);
//       case "CartNavigator":
//         return getTabBarVisibilityForCart(currentRoute);
//       case "ProfileNavigator":
//         return getTabBarVisibility(currentRoute);
//       case "WishlistNavigator":
//         return false; // Wishlist doesn't have hide logic
//       default:
//         return false;
//     }
//   };

//   // If tab bar should be hidden, return null
//   if (shouldHideTabBar()) {
//     return null;
//   }

//   const getIconSource = (routeName: string, isFocused: boolean) => {
//     switch (routeName) {
//       case "HomeNavigator":
//         return isFocused ? assets.HomeBlue : assets.Home;
//       case "SearchNavigator":
//         return isFocused ? assets.SearchBlue : assets.Search;
//       case "WishlistNavigator":
//         return isFocused ? assets.HeartBlue : assets.Heart;
//       case "CartNavigator":
//         return isFocused ? assets.BagBlue : assets.Bag;
//       case "ProfileNavigator":
//         return isFocused ? assets.UserBlue : assets.User;
//       default:
//         return assets.Home;
//     }
//   };

//   const getLabel = (routeName: string) => {
//     switch (routeName) {
//       case "HomeNavigator":
//         return "Home";
//       case "SearchNavigator":
//         return "Search";
//       case "WishlistNavigator":
//         return "Wishlist";
//       case "CartNavigator":
//         return "Cart";
//       case "ProfileNavigator":
//         return "Profile";
//       default:
//         return "";
//     }
//   };

//   const handleTabPress = (index, routeName) => {
//     const event = navigation.emit({
//       type: "tabPress",
//       target: state.routes[index].key,
//       canPreventDefault: true,
//     });

//     if (state.index !== index && !event.defaultPrevented) {
//       navigation.navigate(routeName);
//     }
//   };

//   return (
//     <View style={[styles.tabBarContainer, { backgroundColor: theme.background }]}>
//       <View style={styles.tabBar}>
//         {state.routes.map((route, index) => {
//           const isFocused = state.index === index;

//           return (
//             <TouchableOpacity
//               key={route.key}
//               style={styles.tabItem}
//               onPress={() => handleTabPress(index, route.name)}
//               activeOpacity={0.8}
//             >
//               <View
//                 style={[
//                   styles.iconContainer,
//                   isFocused && styles.focusedIconContainer,
//                 ]}
//               >
//                 <Image
//                   source={getIconSource(route.name, isFocused)}
//                   style={[styles.icon,{tintColor:!isFocused?theme.text:null
//                   }]}
//                 />
//               </View>
//               <Text style={[styles.label, { color: theme.text }]}>
//                 {getLabel(route.name)}
//               </Text>
//             </TouchableOpacity>
//           );
//         })}
//       </View>
//     </View>
//   );
// }

// export default function BottomTabs() {
//   const Tab = createBottomTabNavigator();

//   return (
//     <Tab.Navigator
//       id="bottomTab"
//       tabBar={(props) => <CustomTabBar {...props} />}
//       backBehavior="initialRoute"
//     >
//       <Tab.Screen
//         name="HomeNavigator"
//         component={HomeNavigator}
//         options={{
//           headerShown: false,
//         }}
//       />
//       <Tab.Screen
//         name="SearchNavigator"
//         component={SearchNavigator}
//         options={{
//           headerShown: false,
//         }}
//       />
//       <Tab.Screen
//         name="WishlistNavigator"
//         component={WishlistNavigator}
//         options={{ headerShown: false }}
//       />
//       <Tab.Screen
//         name="CartNavigator"
//         component={CartNavigator}
//         options={{
//           headerShown: false,
//         }}
//       />
//       <Tab.Screen
//         name="ProfileNavigator"
//         component={ProfileNavigator}
//         options={{
//           headerShown: false,
//         }}
//       />
//     </Tab.Navigator>
//   );
// }

// const styles = StyleSheet.create({
//   tabBarContainer: {
//     position: "absolute",
//     bottom: 10,
//     left: 10,
//     right: 10,
//     height: 80,
//     borderRadius: 40,
//     paddingHorizontal: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: -4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 8,
//   },
//   tabBar: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-end",
//     flex: 1,
//     paddingBottom: 10,
//   },
//   tabItem: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "flex-end",
//   },
//   iconContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   focusedIconContainer: {
//     backgroundColor: "#fff",
//     elevation:3
//   },
//   icon: {
//     width: 24,
//     height: 24,
//     resizeMode: "contain",
//   },
//   label: {
//     fontSize: 12,
//     marginTop: 4,
//     fontWeight: "500",
//   },
// });


import React, { useEffect, useCallback } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { assets } from "../../assets/images";
import HomeNavigator from "./HomeNavigator";
import SearchNavigator from "./SearchNavigator";
import WishlistNavigator from "./WishlistNavigator";
import ProfileNavigator from "./ProfileNavigator";
import CartNavigator from "./CartNavigator";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import useAuthStore from "../stores/useAuthStore";
import { Typography } from "../theme/Colors";
import { useColorScheme } from "../components/theme/ColorSchemeContext";

const { width } = Dimensions.get('window');

function getTabBarVisibility(route: any) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? "ProfileScreen";
  const hideOnScreens = [
    "MyOrdersScreen",
    "EditProfile",
    "ChangePasswordScreen",
    "Passwordchange",
    "PrivacyPolicy",
    "TermsnConditions",
    "AboutSection",
    "HelpScreen",
    "DeliveryAddress",
    "AddAddressList",
    "PromoCodeScreen",
  ];
  return hideOnScreens.includes(routeName);
}

function getTabBarVisibilityForHome(route: any) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? "HomeScreen";
  const hideOnScreens = ["ProductDetailPage", "ProductsPage", "Category"];
  return hideOnScreens.includes(routeName);
}

function getTabBarVisibilityForSearch(route: any) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? "SearchScreen";
  const hideOnScreens = ["ProductDetailPage", "ProductsPage"];
  return hideOnScreens.includes(routeName);
}

function getTabBarVisibilityForCart(route: any) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? "CartScreen";
  const hideOnScreens = [
    "OrderScreen",
    "PromoCodeScreen",
    "DeliveryAddress",
    "AddAddressList",
  ];
  return hideOnScreens.includes(routeName);
}

function CustomTabBar({ state, descriptors, navigation }) {
  const themeMode = useAuthStore((state) => state.theme);
  
  const theme =
    themeMode === "dark"
      ? {
          background: Typography.Colors.charcol,
          text: Typography.Colors.white,
          activeBackground: "#808080",
          activeText: "#000",
        }
      : {
          background: Typography.Colors.navigatorColor,
          text: Typography.Colors.black,
          activeBackground: "#fff",
          activeText: "#000",
        };

  // Animation values
  const progress = useSharedValue(0);
  const tabWidth = (width - 40) / state.routes.length; // Accounting for container padding


  const setProgress = useCallback((index) => {
    progress.value = withTiming(
      index * tabWidth,
      { duration: 600, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }
    );
  }, [tabWidth]);

  useEffect(() => {
    setProgress(state.index);
  }, [state.index, setProgress]);


  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: progress.value }],
    };
  });

  // Check if tab bar should be hidden for any route
  const shouldHideTabBar = () => {
    const currentRoute = state.routes[state.index];
    const routeName = currentRoute.name;

    switch (routeName) {
      case "HomeNavigator":
        return getTabBarVisibilityForHome(currentRoute);
      case "SearchNavigator":
        return getTabBarVisibilityForSearch(currentRoute);
      case "CartNavigator":
        return getTabBarVisibilityForCart(currentRoute);
      case "ProfileNavigator":
        return getTabBarVisibility(currentRoute);
      case "WishlistNavigator":
        return false;
      default:
        return false;
    }
  };

  if (shouldHideTabBar()) {
    return null;
  }

  const getIconSource = (routeName: string, isFocused: boolean) => {
    switch (routeName) {
      case "HomeNavigator":
        return isFocused ? assets.HomeBlue : assets.Home;
      case "SearchNavigator":
        return isFocused ? assets.SearchBlue : assets.Search;
      case "WishlistNavigator":
        return isFocused ? assets.HeartBlue : assets.Heart;
      case "CartNavigator":
        return isFocused ? assets.BagBlue : assets.Bag;
      case "ProfileNavigator":
        return isFocused ? assets.UserBlue : assets.User;
      default:
        return assets.Home;
    }
  };

  const getLabel = (routeName: string) => {
    switch (routeName) {
      case "HomeNavigator":
        return "Home";
      case "SearchNavigator":
        return "Search";
      case "WishlistNavigator":
        return "Wishlist";
      case "CartNavigator":
        return "Cart";
      case "ProfileNavigator":
        return "Profile";
      default:
        return "";
    }
  };

  const handleTabPress = (index, routeName) => {
    const event = navigation.emit({
      type: "tabPress",
      target: state.routes[index].key,
      canPreventDefault: true,
    });

    if (state.index !== index && !event.defaultPrevented) {
      navigation.navigate(routeName);
    }
  };

  return (
    <Animated.View style={[styles.tabBarContainer, { backgroundColor: theme.background }]}>
      <View style={styles.tabBar}>
        {/* Animated sliding indicator */}
        <Animated.View
          style={[
            animatedIndicatorStyle,
            styles.activeIndicator,
            {
              width: tabWidth,
              backgroundColor: theme.activeBackground,
            },
          ]}
        />
        
        {/* Tab items */}
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          return (
            <TouchableOpacity
              key={route.key}
              style={[styles.tabItem, { width: tabWidth }]}
              onPress={() => handleTabPress(index, route.name)}
              activeOpacity={0.8}
            >
              <Animated.View style={styles.tabContent}>
                <View style={styles.iconContainer}>
                  <Image
                    source={getIconSource(route.name, isFocused)}
                    style={[
                      styles.icon,
                      {
                        tintColor: isFocused 
                          ? theme.activeText 
                          : theme.text,
                      },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    styles.label,
                    {
                      color: isFocused 
                        ? theme.activeText 
                        : theme.text,
                      fontWeight: isFocused ? "600" : "500",
                    },
                  ]}
                >
                  {getLabel(route.name)}
                </Text>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );
}

export default function BottomTabs() {
  const Tab = createBottomTabNavigator();
  // const { toggle, colorScheme, active } = useColorScheme();
  // console.log(colorScheme,'colorSchemecolorScheme',active,"activeactive")
  return (
    <Tab.Navigator
      id="bottomTab"
      tabBar={(props) => <CustomTabBar {...props} />}
      backBehavior="initialRoute"
    >
      <Tab.Screen
        name="HomeNavigator"
        component={HomeNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="SearchNavigator"
        component={SearchNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="WishlistNavigator"
        component={WishlistNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="CartNavigator"
        component={CartNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="ProfileNavigator"
        component={ProfileNavigator}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    height: 80,
    borderRadius: 40,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  tabBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    flex: 1,
    paddingBottom: 10,
    position: "relative",
  },
  activeIndicator: {
    position: "absolute",
    bottom: 10,
    height: 60,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "flex-end",
    height: 60,
    zIndex: 1,
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  label: {
    fontSize: 11,
    textAlign: "center",
  },
});