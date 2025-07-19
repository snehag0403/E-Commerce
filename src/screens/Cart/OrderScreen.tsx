import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Dimensions,
  FlatList,
  Alert,
  Linking,
  ImageBackground,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { assets } from "../../../assets/images";
import { Typography } from "../../theme/Colors";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { CartData, Payment } from "../../services/api/apiServices";
import { Button } from "@react-navigation/elements";
import ButtonComponent from "../../components/button/ButtonComponent";
import CustomButton from "../../components/button/CustomButton";
import useAuthStore from "../../stores/useAuthStore";

const { width } = Dimensions.get("window");

const OrderScreen = ({ route }) => {
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
  const { item } = route.params;
  const isFocus = useIsFocused();

  const [cartData, setCartData] = useState([]);
  const [priceData, setpriceData] = useState({
    subtotal: 0,
    shippingPrice: 0,
    gstAmount: 0,
    totalPrice: 0,
  });

  const GetCartData = async () => {
    try {
      const data = await CartData();
      const items = data?.data?.cartDetails?.items || [];
      setCartData(items);
    } catch (e) {
      console.log("Error fetching cart data:", e);
      setCartData([]);
    }
  };

  const GetCartPrice = async () => {
    try {
      const data = await CartData();
      setpriceData(
        data?.data?.cartDetails || {
          subtotal: 0,
          shippingPrice: 0,
          gstAmount: 0,
          totalPrice: 0,
        }
      );
    } catch (e) {
      console.log("Error fetching price data:", e);
      setpriceData({
        subtotal: 0,
        shippingPrice: 0,
        gstAmount: 0,
        totalPrice: 0,
      });
    }
  };
  useEffect(() => {
    if (isFocus) {
      GetCartData();
      GetCartPrice();
    }
  }, [isFocus]);
  const navigation = useNavigation();

  const renderData = ({ item }) => {
    return (
      <Pressable
        style={[styles.CartContainer, { backgroundColor: theme.background }]}
      >
        <View style={styles.imageConatiner}>
          <Image source={{ uri: item.productImage[0] }} style={styles.Image} />
        </View>
        <View style={styles.dataContainer}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
            {item?.productName}
          </Text>
          <Text style={[styles.quantity, { color: theme.text }]}>
            Quantity: {item?.quantity}
          </Text>
          <Text style={[styles.particularPrice, { color: theme.specialText }]}>
            Rs. {item?.price * item?.quantity}
          </Text>
        </View>
      </Pressable>
    );
  };

  const [isLoading, setIsLoading] = useState(false);

  const [paymentToggle, setPaymentToggle] = useState(false);

  const handlePayment = async () => {
    try {
      setIsLoading(true);

      const response = await Payment(
        item?.streetAddress,
        item?.city,
        item?.country,
        item?.zipCode
      );

      setPaymentToggle(!paymentToggle);
      if (response?.data?.paymentLink) {
        await Linking.openURL(response.data.paymentLink);
      } else {
        Alert.alert("Error", "Payment link not received");
      }
    } catch (error) {
      console.error("Payment error:", error);
      Alert.alert("Payment Error", "Failed to process payment");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <ImageBackground
      source={themeMode === "dark" ? assets.BackgroundDark : assets.Background}
      style={{ flex: 1 ,paddingHorizontal:12}}
      resizeMode="cover"
    >
      <SafeAreaView style={[styles.container]}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}>
            <Image
              source={themeMode==="dark"?assets.arrowBlack:assets.arrowWhite}
              style={[styles.backIcon]}
            />
          </Pressable>
          <Text style={[styles.headerText, { color: theme.text }]}>
            Order Summary
          </Text>
        </View>
        <View>
          {/* <FlatList
          data={cartData}
          renderItem={renderData}
          keyExtractor={(item) => item.productId}
          showsVerticalScrollIndicator={false}
        /> */}
          <Image
            source={
              themeMode === "dark" ? assets.OrderBlack : assets.OrderImage
            }
            style={{ width: "100%", height: 150 }}
            resizeMode="contain"
          />
        </View>

        <View style={[styles.deliveryContainer,{backgroundColor:theme.background}]}>
          <Text style={[styles.heading, { color: theme.text }]}>
            Delivery Address
          </Text>
          <View style={styles.subContainer}>
            <View style={{ flex: 1 }}>
              <Text
                style={[styles.details, { color: theme.text }]}
                numberOfLines={4}
              >
                {item?.firstName} {item?.lastName} , {item?.streetAddress}{" "}
                {item?.city}, {item?.state}, {item?.country} {item?.zipCode},{" "}
                {item?.phoneNumber}{" "}
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.deliveryContainer,{backgroundColor:theme.background}]}>
          <Text style={[styles.heading, { color: theme.text }]}>
            Payment Method
          </Text>
          <Pressable style={styles.paymentContainer}>
            <Image source={assets.Razorpay} style={styles.paymentImage} />
            <Text style={[styles.details, { color: theme.text }]}>
              Pay With Rozorpay Pay
            </Text>
            <View style={styles.arrowConatiner}></View>
          </Pressable>
        </View>
        {/* <View style={styles.horizonLine} /> */}
        {/* <View style={{ paddingHorizontal: 20 }}> */}
        <View style={[styles.mainAmountContainer,{backgroundColor:theme.background}]}>
          <View style={styles.amountContainer}>
            <Text style={[styles.text1,{color:theme.text}]}>Items ({cartData?.length})</Text>
            <Text style={[styles.perItemAmount, { color: theme.text }]}>
              Rs.{priceData?.breakdown?.subtotal}
            </Text>
          </View>
          <View style={styles.anotherline}></View>
          <View style={styles.amountContainer}>
            <Text style={[styles.text1,{color:theme.text}]}>Shipping </Text>
            <Text style={[styles.perItemAmount, { color: theme.text }]}>
              Rs.{priceData?.breakdown?.shippingPrice}
            </Text>
          </View>
          <View style={styles.anotherline}></View>
          <View style={styles.amountContainer}>
            <Text style={[styles.text1,{color:theme.text}]}>Promo Code </Text>
            <Text style={[styles.perItemAmount, { color: theme.text }]}>
              Rs.{priceData?.discount || 0}
            </Text>
          </View>
          <View style={styles.anotherline}></View>
          <View style={styles.amountContainer}>
            <Text style={[styles.text1,{color:theme.text}]}>Import Charges </Text>
            <Text style={[styles.perItemAmount, { color: theme.text }]}>
              Rs.{priceData?.breakdown?.gstAmount}
            </Text>
          </View>
        </View>
        <View
          style={{
            flex:0.5,
            // backgroundColor:'red',
            flexDirection: "row",
            paddingBottom: 20,
            paddingHorizontal: 20,
            // alignItems:'flex-end'
          }}
        >
          <View style={{ flex: 1, justifyContent: "flex-end",paddingBottom:10 }}>
            <Text
              style={{
                color: theme.specialText,
                fontSize: 20,
                fontWeight: "800",
              }}
            >
              Rs. {priceData.totalPrice.toFixed(3)}{" "}
            </Text>
          </View>
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <CustomButton title="Pay Now" onPress={handlePayment} buttonStyle={{borderRadius:10}}/>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: Typography.Colors.white,
    // paddingHorizontal: 12,
  },
  subContainer: {
    flexDirection: "row",
  },
  backIcon: {
    height: 32,
    width: 32,
  },
  header: {
    flexDirection: "row",
    paddingTop: 20,
    paddingBottom: 10,
    gap: 12,
    alignItems: "center",
  },
  headerText: {
    fontFamily: Typography.font.medium,
    fontSize: 20,
    color: Typography.Colors.lightblack,
  },
  track: {
    height: 24,
    width: 24,
    borderRadius: 15,
    backgroundColor: Typography.Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  trackText: {
    color: Typography.Colors.white,
  },
  line: {
    height: 1,
    width: width / 5.2,
    borderColor: Typography.Colors.primary,
    borderBottomWidth: 2,
    paddingVertical: 5.8,
  },
  text: {
    paddingHorizontal: 22,
    justifyContent: "space-between",
  },
  trackerText: {
    fontSize: 12,

    color: Typography.Colors.lightblack,
    fontFamily: Typography.font.regular,
  },
  CartContainer: {
    flex: 1,
    flexDirection: "row",
    borderRadius: 25,
    // borderWidth:1,
    // backgroundColor:Typography.Colors.white,
    // borderColor:Typography.Colors.lightgrey
    elevation: 1,
  },
  imageConatiner: {
    // paddingVertical: 18,
    // paddingLeft: 18,
    flex: 1,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
  },
  Image: {
    height: 111,
    width: 115,
    borderRadius: 5,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
  },
  dataContainer: {
    flex: 2,
    paddingVertical: 18,
    paddingRight: 18,
  },
  iconContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: 5,
    gap: 5,
  },
  title: {
    fontFamily: Typography.font.bold,
    color: Typography.Colors.black,
    fontSize: 14,
    fontWeight: "800",
  },
  quantity: {
    fontFamily: Typography.font.regular,
    color: Typography.Colors.black,
    fontSize: 14,
    paddingVertical: 8,
  },
  particularPrice: {
    fontFamily: Typography.font.bold,
    color: Typography.Colors.primary,
    fontSize: 16,
    fontWeight: "800",
  },
  deliveryContainer: {
    flex:0.5,
    paddingHorizontal: 20,
    paddingTop: 10,
    borderRadius: 20,
    // backgroundColor: Typography.Colors.white,
    elevation: 2,
    paddingVertical: 10,
    marginBottom: 20,
  },
  details: {
    fontFamily: Typography.font.medium,
    color: Typography.Colors.lightblack,
    fontSize: 16,
    paddingBottom: 6,
  },
  heading: {
    fontFamily: Typography.font.bold,
    color: Typography.Colors.lightblack,
    fontSize: 18,
    fontWeight: "700",
    paddingVertical: 10,
  },
  arrow: {
    height: 21,
    width: 21,
  },
  horizonLine: {
    borderBottomWidth: 1,
    borderColor: Typography.Colors.lightpurple,
    paddingVertical: 10,
  },
  paymentImage: {
    height: 27,
    width: 27,
  },
  paymentContainer: {
    flexDirection: "row",
    gap: 20,
    paddingTop: 10,
    alignItems: "center",
  },
  arrowConatiner: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    flex: 1,
  },
  text1: {
    fontFamily: Typography.font.medium,
    color: Typography.Colors.greydark,
    fontSize: 14,
  },
  perItemAmount: {
    fontFamily: Typography.font.medium,
    color: Typography.Colors.primary,
    fontSize: 14,
  },
  amountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
  },
  anotherline: {
    borderWidth: 0.3,
    borderBottomColor: "#E8E8E8",
  },
  mainAmountContainer: {
    paddingHorizontal: 30,
    paddingTop: 10,
    // elevation: 3,
    backgroundColor: Typography.Colors.white,
    borderRadius:25
    // borderRadius:25,
    // borderTopRightRadius: 25,
    // borderTopLeftRadius: 25,
    // paddingBottom:30
  },
});
export default OrderScreen;
