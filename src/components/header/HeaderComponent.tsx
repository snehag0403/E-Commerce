import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { MainHeaderProps } from "../../models/HomePage.type";
import { assets } from "../../../assets/images";
import { Typography } from "../../theme/Colors";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import SearchNavigator from "../../navigation/SearchNavigator";
import WishlistNavigator from "../../navigation/WishlistNavigator";
import CartNavigator from "../../navigation/CartNavigator";
import useAuthStore from "../../stores/useAuthStore";

const HeaderComponent = ({
  id,
  onClick,
  onPress,
  Title,
  productType, // Add this prop for cart item count
}: MainHeaderProps) => {
   const themeMode = useAuthStore((state) => state.theme);
  const theme =
    themeMode === "dark"
      ? {
          background: Typography.Colors.black,
          text: Typography.Colors.white,
        }
      : {
          background: Typography.Colors.white,
          text: Typography.Colors.black,
        };
  const navigation = useNavigation();
  const cartQuantity = useAuthStore((state) => state.cart);

  const state = useNavigationState((state) => state);

  const onPressfunc = () => {
    if (state.routes[1]?.name === "ProductDetailPage") {
      navigation.navigate(SearchNavigator, {
        screen: "SearchScreen",
      });
      // navigation.navigate("SearchScreen");
    } else {
      navigation.navigate("SearchScreen");
    }
  };

  return (
      <View style={styles.container}>
        <View style={styles.UserContainer}>
          <Pressable onPress={onClick}>
            <Image source={themeMode==="dark"?assets.arrowBlack:assets.arrowWhite} style={[styles.backIcon]} />
          </Pressable>
          <Text numberOfLines={1} style={[styles.productType,{color:theme.text}]}>
            {Title}{" "}
          </Text>
        </View>

        <View style={styles.iconContainer}>
          <Pressable onPress={() => onPressfunc()}>
            <Image source={assets.MainSearch} style={[styles.icon,{tintColor:theme.text}]} />
          </Pressable>
          <Pressable
            onPress={() =>
              navigation.navigate(WishlistNavigator, {
                screen: "WishlistScreen",
              })
            }
          >
            <Image source={assets.HeartBlack} style={[styles.icon,{tintColor:theme.text}]} />
          </Pressable>
          <View style={styles.cartContainer}>
            <Pressable
              onPress={() =>
                navigation.navigate(CartNavigator, { screen: "CartScreen" })
              }
            >
              <Image source={assets.BagBlack} style={[styles.icon,{tintColor:theme.text}]} />
            </Pressable>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartQuantity}</Text>
              </View>
          </View>
        </View>
      </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  productType: {
    fontSize: 20,
    fontFamily: Typography.font.medium,
    color: Typography.Colors.black,
    paddingLeft: 13,
    // alignItems:"center"
  },
  iconContainer: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
  },
  icon: {
    height: 20,
    width: 20,
    color: Typography.Colors.lightblack,
  },
  UserContainer: {
    flex: 2,
    flexDirection: "row",
    alignItems:'center'
  },
  backIcon: {
    height: 34,
    width: 34,
  },
  cartContainer: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -6,
    backgroundColor: "#FF0000",
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default HeaderComponent;