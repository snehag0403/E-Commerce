import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Pressable,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Typography } from "../../theme/Colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Delete from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  WishlistData,
  WishlistDelete,
  WishlistDeleteAll,
} from "../../services/api/apiServices";
import CustomButton from "../../components/button/CustomButton";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import useAuthStore from "../../stores/useAuthStore";
import WishlistSkeleton from "../../components/skeleton/WishlishSkeleton";
import { assets } from "../../../assets/images";

const WishlistScreen = () => {
  const themeMode = useAuthStore((state) => state.theme);
  const isDarkMode = themeMode === "dark";

  // Example of conditionally setting special text color
  const specialTextColor = isDarkMode
    ? Typography.Colors.blue
    : Typography.Colors.primary;

  const theme = {
    background: isDarkMode ? Typography.Colors.black : Typography.Colors.white,
    text: isDarkMode ? Typography.Colors.white : Typography.Colors.black,
    specialText: specialTextColor,
  };
  const { removeFromWishlist, clearWishlist } = useAuthStore();

  const navigation = useNavigation();
  const [Wishlist, setWislist] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const isFocus = useIsFocused();

  const WishlistApi = async () => {
    try {
      setIsLoading(true);
      const data = await WishlistData();
      setWislist(data?.data?.data);
    } catch (e) {
      console.log("no data");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    WishlistApi();
  }, [isFocus]);

  const deleteitem = async (item) => {
    const response = await WishlistDelete(item.id);
    if (response?.data) {
      removeFromWishlist(item.id);
      WishlistApi();
    }
  };
  const DeleteAll = async () => {
    const response = await WishlistDeleteAll();
    if (response?.data?.status === 200) {
      clearWishlist();
      setWislist([]);
    }
  };

  const wishlistData = ({ item }) => {
    return (
      <Pressable style={[styles.subContainer,{backgroundColor:theme.background}]}>
        <View style={styles.imageConatiner}>
          <Image source={{ uri: item.images[0] }} style={styles.Image} />
        </View>
        <View style={styles.productAmount}>
          <Text
            numberOfLines={2}
            style={[
              styles.title,
              {
                color: theme.specialText,
              },
            ]}
          >
            {item.title}
          </Text>
          <Text style={styles.brand}>{item.brand.name}</Text>
        </View>
        <View style={styles.amountIcon}>
          <Text style={[styles.amount, { color: theme.text }]}>
            Rs. {item.discountPrice}
          </Text>
          <Pressable
            onPress={() => {
              deleteitem(item);
            }}
          >
            <Delete
              name="delete"
              style={[styles.icon, { color: theme.text }]}
              size={20}
            />
          </Pressable>
        </View>
      </Pressable>
    );
  };

  const EmptyWishlist = () => {
    return (
      <View
        style={[styles.emptyContainer, { backgroundColor: theme.background }]}
      >
        <View style={styles.heartIconContainer}>
          <Ionicons name="heart" size={64} color={Typography.Colors.primary} />
        </View>

        <Text style={[styles.emptyTitle, { color: theme.specialText }]}>
          Your Wishlist is Empty
        </Text>
        <Text style={styles.emptyDescription}>
          Save items you love to your wishlist to keep track of them and get
          notified when they go on sale.
        </Text>
      </View>
    );
  };

  // Show skeleton while loading
  if (isLoading) {
    return <WishlistSkeleton theme={theme} itemCount={5} />;
  }

  return (
    <ImageBackground source={themeMode === 'dark'? assets.BackgroundDark : assets.Background} style={{flex:1,}} resizeMode="cover">

    <View style={styles.container}>
      <View style={[styles.header]}>
        <Text style={[styles.heading, { color: theme.specialText }]}>
          Wishlist
        </Text>
        {Wishlist && Wishlist.length > 0 && (
          <Pressable style={styles.deleteAll} onPress={DeleteAll}>
            <Text style={styles.deleteAllText}>Delete All</Text>
            <Icon
              name="delete-sweep"
              size={20}
              style={{ color: Typography.Colors.primary }}
            />
          </Pressable>
        )}
      </View>
      <FlatList
        data={Wishlist}
        renderItem={wishlistData}
        ListEmptyComponent={EmptyWishlist}
        contentContainerStyle={{ flexGrow: 1,paddingTop:20 }}
      />
      {Wishlist && Wishlist.length > 0 && (
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Add All to Cart"
            onPress={() => navigation.navigate("CartScreen")}
          />
        </View>
      )}
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal:20
    // backgroundColor: Typography.Colors.white,
  },
  heading: {
    fontFamily: Typography.font.bold,
    fontWeight: "800",
    fontSize: 22,
    color: Typography.Colors.primary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    paddingTop: 55,
    paddingBottom: 16,
  },
  Image: {
    height: 100,
    width: 100,
    borderRadius: 5,
    // paddingHorizontal: 16,
    borderTopLeftRadius:25,
    borderBottomLeftRadius:25
  },
  title: {
    fontFamily: Typography.font.bold,
    color: Typography.Colors.primary,
    fontSize: 14,
    fontWeight: "800",
  },
  brand: {
    fontFamily: Typography.font.bold,
    color: Typography.Colors.lightgrey,
    fontSize: 15,
  },
  amount: {
    fontFamily: Typography.font.bold,
    color: Typography.Colors.black,
    fontSize: 16,
    paddingTop: 5,
  },
  productAmount: {
    justifyContent: "center",
    gap: 8,
    flex: 1.3,
  },
  subContainer: {
    flexDirection: "row",
    // paddingHorizontal: 30,
    marginHorizontal:10,
    elevation: 3,
    gap:15,
    marginBottom:15,
    // paddingTop:15,
    // backgroundColor:Typography.Colors.white,
    borderRadius:25
    // borderTopLeftRadius:25.,
    // borderBottomLeftRadius:25
  },
  icon: {
    color: Typography.Colors.black,
  },
  imageConatiner: {
    // padding: 18,
    // backgroundColor:Typography.Colors.red,
    // borderTopLeftRadius:25,
    // borderBottomLeftRadius:25
  },
  amountIcon: {
    alignItems: "flex-end",
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingRight: 18,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#007bff",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  checked: {
    backgroundColor: "#007bff",
  },
  buttonContainer: {
    paddingHorizontal: 30,
    paddingBottom: 20,
  },

  // Updated Empty Wishlist Styles
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    margin: 30,
    backgroundColor: Typography.Colors.white,
    elevation: 3,
    marginBottom:120
  },
  heartIconContainer: {
    width: 110,
    height: 110,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffe5e8",
    borderRadius: 55,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontFamily: Typography.font.bold,
    fontWeight: "700",
    marginBottom: 12,
    color: Typography.Colors.primary,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: 15,
    fontFamily: Typography.font.regular,
    color: Typography.Colors.lightgrey,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  stepsContainer: {
    flexDirection: "column",
    width: "100%",
    marginBottom: 30,
  },
  step: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  stepIconContainer: {
    width: 46,
    height: 46,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffe5e8",
    borderRadius: 23,
    marginRight: 16,
  },
  stepTitle: {
    fontSize: 16,
    fontFamily: Typography.font.bold,
    color: Typography.Colors.primary,
    marginBottom: 4,
  },
  stepText: {
    fontSize: 14,
    fontFamily: Typography.font.regular,
    color: Typography.Colors.lightgrey,
    flex: 1,
  },
  startShoppingButton: {
    flexDirection: "row",
    backgroundColor: Typography.Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    width: "80%",
  },
  startShoppingText: {
    color: Typography.Colors.white,
    fontFamily: Typography.font.bold,
    fontWeight: "600",
    fontSize: 16,
    marginRight: 8,
  },
  deleteAll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#ffe5e8",
    padding: 10,
    borderRadius: 10,
  },
  deleteAllText: {
    color: Typography.Colors.primary,
    fontFamily: Typography.font.heavy,
  },
});

export default WishlistScreen;
