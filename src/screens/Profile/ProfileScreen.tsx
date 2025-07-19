// import {
//   Image,
//   FlatList,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   Dimensions,
// } from "react-native";
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withSpring,
//   withTiming,
//   withSequence,
//   withDelay,
//   interpolateColor,
//   runOnJS,
//   Easing,
// } from "react-native-reanimated";
// import { Typography } from "../../theme/Colors";
// import { assets } from "../../../assets/images";
// import { useNavigation } from "@react-navigation/native";
// import useAuthStore from "../../stores/useAuthStore";
// import { ThemeToggle } from "../../components/Themes/ThemeToggle";
// import { useEffect, useRef } from "react";

// const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// const ProfileScreen = () => {
//   const user = useAuthStore((state) => state.user);
//   const themeMode = useAuthStore((state) => state.theme);
//   const theme =
//     themeMode === "dark"
//       ? {
//           background: Typography.Colors.black,
//           text: Typography.Colors.white,
//         }
//       : {
//           background: Typography.Colors.white,
//           text: Typography.Colors.black,
//         };
//   const logout = useAuthStore((state) => state.logout);
//   const Navigation = useNavigation();

//   // Ref to measure theme toggle position
//   const themeToggleRef = useRef(null);

//   // Simple progress value for theme animation
//   const themeProgress = useSharedValue(themeMode === "dark" ? 1 : 0);

//   // Ripple effect values
//   const rippleScale = useSharedValue(0);
//   const rippleOpacity = useSharedValue(0);
//   const rippleX = useSharedValue(screenWidth / 2);
//   const rippleY = useSharedValue(100);

//   // Individual item press animations
//   const item0Scale = useSharedValue(1);
//   const item1Scale = useSharedValue(1);
//   const item2Scale = useSharedValue(1);
//   const item3Scale = useSharedValue(1);
//   const item4Scale = useSharedValue(1);
//   const item5Scale = useSharedValue(1);
//   const item6Scale = useSharedValue(1);

//   // Simple theme change handler
//   const handleThemeChange = () => {
//     if (themeToggleRef.current) {
//       themeToggleRef.current.measureInWindow((x, y, width, height) => {
//         // Set ripple position to center of the toggle button
//         rippleX.value = x + width / 2;
//         rippleY.value = y + height / 2;

//         // Start ripple animation
//         animateRipple();
//       });
//     } else {
//       animateRipple();
//     }
//   };

//   // Simple ripple animation
//   const animateRipple = () => {
//     // Calculate scale to cover screen
//     const maxDistance = Math.sqrt(screenWidth * screenWidth + screenHeight * screenHeight);
//     const finalScale = maxDistance / 50; // 50 is half of base circle (100px)

//     // Reset and animate ripple
//     rippleScale.value = 0;
//     rippleOpacity.value = withTiming(0.7, { duration: 100 });
//     rippleScale.value = withTiming(finalScale, { duration: 1000 });

//     // Fade out ripple
//     rippleOpacity.value = withDelay(800, withTiming(0, { duration: 300 }));
//     rippleScale.value = withDelay(1100, withTiming(0, { duration: 0 }));
//   };

//   // Update theme progress when theme changes
//   useEffect(() => {
//     const targetValue = themeMode === "dark" ? 1 : 0;
//     themeProgress.value = withTiming(targetValue, { duration: 1000 });

//     // Trigger ripple animation
//     setTimeout(() => handleThemeChange(), 50);
//   }, [themeMode]);

//   // Simple animated styles using interpolateColor
//   const animatedBackgroundStyle = useAnimatedStyle(() => {
//     const backgroundColor = interpolateColor(
//       themeProgress.value,
//       [0, 1],
//       [Typography.Colors.barColor, Typography.Colors.charcol]
//     );
//     return { backgroundColor };
//   });

//   const animatedTextStyle = useAnimatedStyle(() => {
//     const color = interpolateColor(
//       themeProgress.value,
//       [0, 1],
//       [Typography.Colors.black, Typography.Colors.white]
//     );
//     return { color };
//   });

//   // Ripple animation style
//   const rippleAnimatedStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: rippleScale.value }],
//     opacity: rippleOpacity.value,
//     left: rippleX.value - 50,
//     top: rippleY.value - 50,
//   }));

//   // Individual item animated styles
//   const item0AnimatedStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: item0Scale.value }],
//   }));

//   const item1AnimatedStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: item1Scale.value }],
//   }));

//   const item2AnimatedStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: item2Scale.value }],
//   }));

//   const item3AnimatedStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: item3Scale.value }],
//   }));

//   const item4AnimatedStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: item4Scale.value }],
//   }));

//   const item5AnimatedStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: item5Scale.value }],
//   }));

//   const item6AnimatedStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: item6Scale.value }],
//   }));

//   const handleNavigation = (screen, params = {}) => {
//     if (screen) Navigation.navigate(screen, params);
//   };

//   const getItemScaleAndStyle = (index) => {
//     const scales = [item0Scale, item1Scale, item2Scale, item3Scale, item4Scale, item5Scale, item6Scale];
//     const styles = [item0AnimatedStyle, item1AnimatedStyle, item2AnimatedStyle, item3AnimatedStyle, item4AnimatedStyle, item5AnimatedStyle, item6AnimatedStyle];

//     return {
//       scaleValue: scales[index],
//       animatedStyle: styles[index]
//     };
//   };

//   const handleItemPress = (onPress, index) => {
//     const { scaleValue } = getItemScaleAndStyle(index);

//     scaleValue.value = withSequence(
//       withTiming(0.95, { duration: 100 }),
//       withSpring(1, { damping: 10, stiffness: 300 })
//     );

//     setTimeout(() => onPress(), 150);
//   };

//   const menuItems = [
//     {
//       title: "My Orders",
//       icon: assets.tote,
//       onPress: () => handleNavigation("MyOrdersScreen"),
//     },
//     {
//       title: "Wishlist",
//       icon: assets.heart,
//       onPress: () =>
//         handleNavigation("WishlistNavigator", { screen: "WishlistScreen" }),
//     },
//     {
//       title: "Delivery Address",
//       icon: assets.Location,
//       iconStyle: styles.logodelivery,
//       onPress: () => handleNavigation("DeliveryAddress"),
//     },
//     {
//       title: "Offers",
//       icon: assets.Offers,
//       onPress: () => handleNavigation("PromoCodeScreen"),
//     },
//     {
//       title: "Help",
//       icon: assets.help,
//       onPress: () => handleNavigation("HelpScreen"),
//     },
//     {
//       title: "About Us",
//       icon: assets.about,
//       onPress: () => handleNavigation("AboutSection"),
//     },
//     {
//       title: "Log Out",
//       icon: assets.Logout,
//       textStyle: styles.textlistlogout,
//       onPress: logout,
//     },
//   ];

//   const renderItem = ({ item, index }) => {
//     const { animatedStyle } = getItemScaleAndStyle(index);

//     return (
//       <Animated.View style={animatedStyle}>
//         <TouchableOpacity onPress={() => handleItemPress(item.onPress, index)}>
//           <View style={styles.secondsection}>
//             <View style={styles.logocontainer}>
// <Image
//   source={item.icon}
//   style={[
//     item.iconStyle || styles.logostyle,
//     {
//       tintColor:
//         item.icon === assets.Logout
//           ? Typography.Colors.red
//           : theme.text,
//     },
//   ]}
// />
//               <Animated.Text
//                 style={[
//                   item.textStyle || styles.textlist,
//                   item.title === "Log Out"
//                     ? { color: Typography.Colors.red }
//                     : animatedTextStyle,
//                 ]}
//               >
//                 {item.title}
//               </Animated.Text>
//             </View>
//             {item.title !== "Log Out" && (
//               <View style={styles.arrowstyleview}>
//                 <Image
//                   source={assets.rightarrow}
//                   style={[styles.arrowstyle, { tintColor: theme.text }]}
//                 />
//               </View>
//             )}
//           </View>
//         </TouchableOpacity>
//       </Animated.View>
//     );
//   };

//   return (
//     <Animated.View style={[styles.container, animatedBackgroundStyle]}>
//       {/* Main Content */}
//       <View style={styles.contentContainer}>
//         <TouchableOpacity onPress={() => handleNavigation("EditProfile")}>
//           <View style={styles.firstsection}>
//             <Image
//               source={
//                 user?.profilePicture
//                   ? { uri: user?.profilePicture }
//                   : assets.Demo
//               }
//               style={styles.profilepic}
//             />
//             <View style={styles.textcontainer}>
//               <Animated.Text style={[styles.textname, animatedTextStyle]}>
//                 {user?.name}
//               </Animated.Text>
//               <Animated.Text style={[styles.mailcontainer, animatedTextStyle]}>
//                 {user?.email}
//               </Animated.Text>
//             </View>
//             <View style={styles.modeContainer} ref={themeToggleRef}>
//               <ThemeToggle />
//             </View>
//           </View>
//         </TouchableOpacity>

//         <FlatList
//           data={menuItems}
//           keyExtractor={(item, index) => index.toString()}
//           renderItem={renderItem}
//           scrollEnabled={false}
//           showsVerticalScrollIndicator={true}
//         />

//         <View style={styles.tncstyle}>
//           <TouchableOpacity onPress={() => handleNavigation("PrivacyPolicy")}>
//             <Animated.Text style={[styles.policystyle, animatedTextStyle]}>
//               Privacy Policy
//             </Animated.Text>
//           </TouchableOpacity>
//           <Animated.View style={[styles.line, animatedTextStyle]} />
//           <TouchableOpacity
//             onPress={() => handleNavigation("TermsnConditions")}
//           >
//             <Animated.Text style={[styles.conditionstyle, animatedTextStyle]}>
//               Terms and Conditions
//             </Animated.Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Simple Ripple Wave Effect */}
//       <Animated.View
//         style={[styles.rippleContainer, rippleAnimatedStyle]}
//         pointerEvents="none"
//       >
//         <View
//           style={[
//             styles.rippleCircle,
//             {
//               backgroundColor: themeMode === "light"
//                 ? Typography.Colors.black
//                 : Typography.Colors.white,
//             }
//           ]}
//         />
//       </Animated.View>
//     </Animated.View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     paddingHorizontal: 20,
//     flex: 1,
//   },
//   contentContainer: {
//     flex: 1,
//   },

//   // Enhanced ripple effect
//   rippleContainer: {
//     position: "absolute",
//     width: 100,
//     height: 100,
//     zIndex: 998, // Behind content but visible
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   rippleCircle: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 50,
//     opacity: 0.9,
//   },

//   modeContainer: {
//     flexDirection: "row",
//     gap: 20,
//     flex: 1,
//     justifyContent: "flex-end",
//     alignItems: "center",
//   },
//   firstsection: {
//     paddingVertical: 35,
//     flexDirection: "row",
//   },
//   secondsection: {
//     paddingHorizontal: 14,
//     paddingVertical: 17,
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   textcontainer: {
//     marginLeft: 5,
//     marginTop: 2,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//   },
//   profilepic: {
//     borderRadius: 50,
//     height: 62,
//     width: 62,
//   },
//   textname: {
//     fontSize: 18,
//     fontFamily: Typography.font.bold,
//     fontWeight: "500",
//     textTransform: "capitalize",
//   },
//   mailcontainer: {
//     fontSize: 14,
//     fontFamily: Typography.font.regular,
//   },
//   iconStyle: {
//     color: Typography.Colors.white,
//   },
//   logostyle: {
//     tintColor: Typography.Colors.white,
//     marginTop: 5,
//     height: 20,
//     width: 20,
//   },
//   logodelivery: {
//     marginTop: 5,
//     height: 25,
//     width: 21.5,
//   },
//   logocontainer: {
//     flexDirection: "row",
//     gap: 20,
//   },
//   textlist: {
//     alignSelf: "center",
//     fontSize: 16,
//     fontWeight: "600",
//     fontFamily: Typography.font.medium,
//   },
//   textlistlogout: {
//     alignSelf: "center",
//     fontSize: 16,
//     fontWeight: "600",
//     fontFamily: Typography.font.medium,
//   },
//   arrowstyle: {
//     paddingVertical: 8.5,
//     height: 14,
//     width: 10,
//     alignSelf: "center",
//   },
//   arrowstyleview: {
//     alignSelf: "center",
//     paddingVertical: 8,
//   },
//   tncstyle: {
//     gap: 5,
//     flexDirection: "row",
//     alignSelf: "center",
//     paddingVertical: 20,
//   },
//   line: {
//     gap: 5,
//     height: 15,
//     alignSelf: "center",
//     borderWidth: 0.2,
//     opacity: 0.5,
//     color: Typography.Colors.white,
//   },
//   policystyle: {
//     paddingVertical: 1.5,
//   },
//   conditionstyle: {
//     paddingVertical: 1.5,
//     paddingBottom:90
//   },
// });

// export default ProfileScreen;

import {
  Image,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
} from "react-native";
import { Typography } from "../../theme/Colors";
import { assets } from "../../../assets/images";
import { useNavigation } from "@react-navigation/native";
import useAuthStore from "../../stores/useAuthStore";
import { ColorSchemeButton } from "../../components/theme/ColorSchemeButton";
import { darkTheme, lightTheme,  } from "../../components/theme/Theme";
import { useColorScheme } from "../../components/theme/ColorSchemeContext";

const ProfileScreen = () => {
  const themeMode = useAuthStore((state) => state.theme);
  // console.log(themeMode,'thyememeeee')
  const theme =
    themeMode === "dark"
      ? {
          background: Typography.Colors.black,
          text: Typography.Colors.white,
        }
      : {
          background: Typography.Colors.barColor,
          text: Typography.Colors.black,
        };
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const Navigation = useNavigation();

  const handleNavigation = (screen, params = {}) => {
    if (screen) Navigation.navigate(screen, params);
  };

  const menuItems = [
    {
      title: "My Orders",
      icon: assets.tote,
      onPress: () => handleNavigation("MyOrdersScreen"),
    },
    {
      title: "Wishlist",
      icon: assets.heart,
      onPress: () =>
        handleNavigation("WishlistNavigator", { screen: "WishlistScreen" }),
    },
    {
      title: "Delivery Address",
      icon: assets.Location,
      iconStyle: styles.logodelivery,
      onPress: () => handleNavigation("DeliveryAddress"),
    },
    {
      title: "Offers",
      icon: assets.Offers,
      onPress: () => handleNavigation("PromoCodeScreen"),
    },
    {
      title: "Help",
      icon: assets.help,
      onPress: () => handleNavigation("HelpScreen"),
    },
    {
      title: "About Us",
      icon: assets.about,
      onPress: () => handleNavigation("AboutSection"),
    },
    {
      title: "Log Out",
      icon: assets.Logout,
      textStyle: styles.textlistlogout,
      onPress: logout,
    },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={item.onPress}>
      <View style={styles.secondsection}>
        <View style={styles.logocontainer}>
          <Image
            source={item.icon}
            style={[
              item.iconStyle || styles.logostyle,
              {
                tintColor:
                  item.icon === assets.Logout
                    ? "red"
                    : theme.text
                    // ? darkTheme.colors.mainBackground
                    // : darkTheme.colors.mainForeground,
              },
            ]}
          />

          {/* <Image
                source={item.icon}
                style={[
                  item.iconStyle || styles.logostyle,
                  {
                    tintColor:
                      item.icon === assets.Logout
                        ? Typography.Colors.red
                        : theme.text,
                  },
                ]}
              /> */}
          <Text
            style={[
              styles.textlist,
              {
                color:theme.text
              },
              item.textStyle, // allow per-item text style override
            ]}
          >
            {item.title}
          </Text>
        </View>
        {item.title !== "Log Out" && (
          <View style={styles.arrowstyleview}>
            <Image source={assets.rightarrow} style={styles.arrowstyle} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
  const { colorScheme } = useColorScheme();
  // console.log(colorScheme,"colorSchemecolorSchemecolorScheme")
  return (
    // <ScrollView style={{ flex: 1, backgroundColor: Typography.Colors.white }}>
    <View
      style={[
        styles.container,
        {
          backgroundColor:theme.background
            // colorScheme === "light"
            //   ? darkTheme.colors.mainBackground
            //   : lightTheme.colors.mainBackground,
        },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={() => handleNavigation("EditProfile")}>
          <View style={styles.firstsection}>
            <Image
              source={
                user?.profilePicture
                  ? { uri: user?.profilePicture }
                  : assets.Demo
              }
              style={styles.profilepic}
            />
            <View style={styles.textcontainer}>
              <Text
                style={[
                  styles.textname,
                  {
                    color:theme.text
                      // colorScheme === "light"
                      //   ? darkTheme.colors.text
                      //   : lightTheme.colors.text,
                  },
                ]}
              >
                {user?.name}
              </Text>
              <Text style={styles.mailcontainer}>{user?.email}</Text>
            </View>
          </View>
        </TouchableOpacity>
        {/* <View style={{ backgroundColor:'red'}}> */}
        <ColorSchemeButton />
        {/* </View> */}
      </View>
      <FlatList
        data={menuItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        scrollEnabled={false}
        showsVerticalScrollIndicator={true}
      />

      <View style={styles.tncstyle}>
        <TouchableOpacity onPress={() => handleNavigation("PrivacyPolicy")}>
          <Text style={styles.policystyle}>Privacy Policy</Text>
        </TouchableOpacity>
        <View style={styles.line}></View>
        <TouchableOpacity onPress={() => handleNavigation("TermsnConditions")}>
          <Text style={styles.conditionstyle}>Terms and Conditions</Text>
        </TouchableOpacity>
      </View>
    </View>
    // </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop:20,
    flex: 1,
    backgroundColor: Typography.Colors.white,
  },
  HeaderStyle: {
    backgroundColor: Typography.Colors.white,
    paddingHorizontal: 20,
  },
  firstsection: {
    paddingVertical: 35,
    flexDirection: "row",
  },
  secondsection: {
    paddingHorizontal: 14,
    paddingVertical: 17,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textcontainer: {
    marginLeft: 5,
    marginTop: 2,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  profilepic: {
    borderRadius: 50,
    height: 62,
    width: 62,
  },
  textname: {
    fontSize: 18,
    fontFamily: Typography.font.bold,
    color: Typography.Colors.black,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  mailcontainer: {
    fontSize: 14,
    fontFamily: Typography.font.regular,
    color: Typography.Colors.lightgrey,
  },
  logostyle: {
    marginTop: 5,
    height: 20,
    width: 20,
  },
  logo: {
    marginTop: 5,
    height: 14,
    width: 20,
  },
  logodelivery: {
    marginTop: 5,
    height: 25,
    width: 21.5,
  },
  logocontainer: {
    flexDirection: "row",
    gap: 20,
  },
  textlist: {
    alignSelf: "center",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: Typography.font.medium,
    color: Typography.Colors.blackdim,
  },
  textlistlogout: {
    alignSelf: "center",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: Typography.font.medium,
    color: Typography.Colors.red,
  },
  textlistpayment: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: Typography.font.medium,
    color: Typography.Colors.blackdim,
  },
  arrowstyle: {
    paddingVertical: 8.5,
    height: 14,
    width: 10,
    alignSelf: "center",
  },
  arrowstyleview: {
    alignSelf: "center",
    paddingVertical: 8,
  },
  tncstyle: {
    gap: 5,
    flexDirection: "row",
    alignSelf: "center",
    paddingVertical: 20,
  },
  line: {
    gap: 5,
    height: 15,
    alignSelf: "center",
    borderWidth: 0.2,
    opacity: 0.5,
    color: Typography.Colors.lightgrey,
  },
  policystyle: {
    color: Typography.Colors.darksilver,
    paddingVertical: 1.5,
  },
  conditionstyle: {
    color: Typography.Colors.darksilver,
    paddingVertical: 1.5,
  },
});

export default ProfileScreen;
