import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  ImageBackground,
  SafeAreaView,
  Dimensions,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { Typography } from "../../theme/Colors";
import Icon from "react-native-vector-icons/AntDesign";
import CustomTextInput from "../../components/textInput/CustomTextInput";
import CustomButton from "../../components/button/CustomButton";
import { useFocusEffect, useIsFocused, useNavigation } from "@react-navigation/native";
import {
  AddToCart,
  CartData,
  CartDelete,
  PromoCode,
  QuantityDelete,
} from "../../services/api/apiServices";
import useAuthStore from "../../stores/useAuthStore";
import { assets } from "../../../assets/images";
const { width } = Dimensions.get("window");

const CartScreen = () => {
  const [appliedPromoCode, setAppliedPromoCode] = useState("");
  const [promoResponseData, setPromoResponseData] = useState(null);
  const { setCart } = useAuthStore();
  const navigation = useNavigation();
  const isFocus = useIsFocused();
  const [cartData, setCartData] = useState([]);
  const [priceData, setpriceData] = useState({
    subtotal: 0,
    shippingPrice: 0,
    gstAmount: 0,
    totalPrice: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [hasCheckedCart, setHasCheckedCart] = useState(false); 
  const [coupon, setCoupon] = useState("");
  const [promoData, setPromoData] = useState({ discount: 0 });
  const themeMode = useAuthStore((state) => state.theme);
  const isDarkMode = themeMode === "dark";
  const specialTextColor = isDarkMode 
    ? Typography.Colors.blue
    : Typography.Colors.primary;
  const theme = {
    background: isDarkMode ? '#171b21' : Typography.Colors.white,
    text: isDarkMode ? Typography.Colors.white : Typography.Colors.black,
    specialText: specialTextColor,
  };
  const flatListRef = useRef(null);
const [shouldScrollToFooter, setShouldScrollToFooter] = useState(false);




  const GetCartData = async () => {
    // setIsLoading(true);
    try {
      const data = await CartData();
      const items = data?.data?.cartDetails?.items || [];
      setCartData(items);
      setCart(items.length);
      setHasCheckedCart(true);
      setIsLoading(false);
    } catch (e) {
      console.log("Error fetching cart data:", e);
      setCartData([]);
      setHasCheckedCart(true);
    }
  };

  // Get cart price summary
  const GetCartPrice = async () => {
    try {
      const data = await CartData();
      setpriceData(
        data?.data?.cartDetails?.breakdown || {
          subtotal: 0,
          shippingPrice: 0,
          gstAmount: 0,
          totalPrice: 0,
        }
      );
      if (data?.data?.cartDetails && coupon) {
        const response = await PromoCode(coupon);
        setPromoData(response?.data);
      }
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

  // Load cart data when screen is focused
  useEffect(() => {
    if (isFocus) {
      GetCartData();
      GetCartPrice();
    }
  }, [isFocus]);

  useFocusEffect(
    React.useCallback(() => {
      if (shouldScrollToFooter) {
        const timer = setTimeout(() => {
          if (flatListRef.current && cartData.length > 0) {
            flatListRef.current.scrollToEnd({ animated: true });
          }
          setShouldScrollToFooter(false); 
        }, 300); 
  
        return () => clearTimeout(timer);
      }
    }, [shouldScrollToFooter, cartData.length])
  );
  

  // Increment quantity handler
  const handleIncrementQuantity = async (item) => {
    try {
      const newQuantity = item.quantity + 1;
      setCartData((prev) =>
        prev.map((cartItem) =>
          cartItem.productId === item.productId
            ? { ...cartItem, quantity: newQuantity }
            : cartItem
        )
      );

      // Then call API
      await AddToCart(
        item.productId,
        1,
        item.productColorId,
        item.productSizeId
      );

      GetCartPrice();
    } catch (error) {
      console.log("Error updating quantity:", error);
      GetCartData();
    }
  };

  // Delete item from cart
  const deleteQuantity = async (item) => {
    try {
      const response = await QuantityDelete(item.productId);
      if (response.data) {
      }
    } catch (error) {
      console.log("Error deleting item:", error);
    }
  };

  const handleDecrementQuantity = async (item) => {
    try {
      if (item.quantity > 1) {
        const newQuantity = item.quantity - 1;
        setCartData((prev) =>
          prev.map((cartItem) =>
            cartItem.productId === item.productId
              ? { ...cartItem, quantity: newQuantity }
              : cartItem
          )
        );

        await deleteQuantity(item);
        GetCartPrice();
      } else {
        deleteItem(item);
      }
    } catch (error) {
      console.log("Error updating quantity:", error);
      GetCartData();
    }
  };

  // Delete item from cart
  const deleteItem = async (item) => {
    try {
      const response = await CartDelete(item.productId);
      if (response.data) {
        GetCartData();
        GetCartPrice();
      }
    } catch (error) {
      console.log("Error deleting item:", error);
    }
  };

  const renderData = useCallback(
    ({ item }) => {
      // console.log("item", item);
      return (
        <View style={{ flex: 1 }}>
          <Pressable style={[styles.subContainer]}>
            <View style={styles.imageConatiner}>
              <Image
                source={{ uri: item.productImage[0] }}
                style={styles.Image}
                resizeMode="cover"
              />
            </View>
            <View
              style={[
                styles.dataContainer,
                { backgroundColor: theme.background },
              ]}
            >
              <View style={styles.dataSubConatiner}>
                <View style={styles.innerContainer}>
                  <Text
                    style={[styles.title, { color: theme.text }]}
                    numberOfLines={1}
                  >
                    {item?.productName}
                  </Text>
                </View>
                <Pressable
                  onPress={() => deleteItem(item)}
                  style={styles.iconContainer}
                >
                  <Icon name="delete" color={theme.text} size={18} />
                </Pressable>
              </View>
              <View style={[styles.dataSubConatiner]}>
                <Text
                  style={styles.productText}
                >
                  Size : {item.productSize}
                </Text>
              </View>
              <View style={styles.dataSubConatiner}>
                <Text
                  style={{ fontSize: 14, fontWeight: "600", color: theme.text }}
                >
                  Color: {item.productColor}
                </Text>
              </View>
              <View style={styles.priceContainer}>
                <View style={styles.priceSubContainer}>
                  <Text style={[styles.price, { color: theme.specialText }]}>
                    Rs. {item.price}
                  </Text>
                </View>
                <View
                  style={[
                    styles.quantityContainer,
                    { backgroundColor: theme.background },
                  ]}
                >
                  <Pressable
                    style={styles.quantityButton}
                    onPress={() => handleDecrementQuantity(item)}
                  >
                    <Text
                      style={[
                        styles.quantityText,
                        { color: theme.specialText },
                      ]}
                    >
                      -
                    </Text>
                  </Pressable>

                  <Text
                    style={[
                      styles.quantityText,
                      { paddingHorizontal: 6, color: theme.text },
                    ]}
                  >
                    {item.quantity}
                  </Text>
                  <Pressable
                    style={styles.quantityButton}
                    onPress={() => handleIncrementQuantity(item)}
                  >
                    <Text
                      style={[
                        styles.quantityText,
                        { color: theme.specialText },
                      ]}
                    >
                      +
                    </Text>
                  </Pressable>
                </View>
              </View>
              <View
                style={[
                  styles.dataSubConatiner,
                  { paddingLeft: 7, paddingTop: 4 },
                ]}
              >
                <Image
                  source={
                    themeMode === "dark"
                      ? assets.exchangeWhite
                      : assets.exchange
                  }
                  style={{ height: 18, width: 18 }}
                />
                <Text
                  style={{ fontSize: 12, paddingLeft: 2, color: theme.text }}
                >
                  Exchange Only
                </Text>
              </View>
            </View>
          </Pressable>
        </View>
      );
    },
    [cartData]
  );

  const EmptyCartView = () => {
    return (
      <ImageBackground
        source={
          themeMode === "dark" ? assets.BackgroundDark : assets.Background
        }
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <View style={styles.emptyCartContainer}>
          <Icon
            name="shoppingcart"
            size={80}
            color={Typography.Colors.greydark}
          />
          <Text style={[styles.emptyCartTitle, { color: theme.specialText }]}>
            Your cart is empty
          </Text>
          <Text style={styles.emptyCartText}>
            Looks like you haven't added anything to your cart yet.
          </Text>
        </View>
      </ImageBackground>
    );
  };



  const shouldShowEmptyCart =
    hasCheckedCart && !isLoading && (!cartData || cartData.length === 0);



  if (shouldShowEmptyCart) {
    return <EmptyCartView />;
  }

  const listFooter = () => {
    return (
      <View style={[styles.mainAmountContainer]}>
        <View>
          <Text
            style={{
              paddingVertical: 10,
              paddingHorizontal: 30,
              fontSize: 16,
              color: theme.text,
            }}
          >
            Coupons
          </Text>
        </View>
        <View
          style={[
            styles.amountContainer,
            {
              flexDirection: "column",
              alignItems: "stretch",
              marginBottom: 10,
              backgroundColor: theme.background,

            },
          ]}
        >
          <View style={[styles.glassOfferContainer]}>
            <View style={{ flexDirection: "row", paddingVertical: 10,alignItems:'center' }}>
              <Image
                source={themeMode==="light"?assets.offerGif:assets.offerWhite}
                style={{ height: 26, width: 26}}
              />
              <Text style={[styles.couponText, { color: theme.text }]}>
                Apply Coupons
              </Text>
            </View>

            <Pressable
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() =>
                navigation.navigate("PromoCodeScreen", {
                  onApplyPromo: (promoCode, responseData) => {
                    setAppliedPromoCode(promoCode);
                    setPromoResponseData(responseData);
                    setPromoData(responseData);
                    setShouldScrollToFooter(true);
                    GetCartData();
                    GetCartPrice();
                  },
                })
              }
            >
              <Text
                style={{
                  paddingRight: 8,
                  color: theme.specialText,
                  fontSize: 15,
                }}
              >
                All Coupons
              </Text>
              <Image
                source={assets.rightarrow}
                style={{
                  height: 11,
                  width: 11,
                  tintColor: specialTextColor,
                }}
                resizeMode="contain"
              />
            </Pressable>
          </View>
        </View>
        <View
          style={{ backgroundColor: theme.background, paddingHorizontal: 30 }}
        >
          <View style={[styles.amountContainer, , { paddingTop: 10 }]}>
            <Text style={{ paddingBottom: 6, color: theme.text }}>
              PRICE DETAILS ({cartData?.length} Item)
            </Text>
          </View>
          <View style={styles.line} />
          <View style={[styles.amountContainer, , { paddingTop: 10 }]}>
            <Text style={styles.text1}>Total MRP</Text>
            <Text style={[styles.perItemAmount, { color: theme.specialText }]}>
              Rs.{priceData?.subtotal?.toFixed(2)}
            </Text>
          </View>
          {/* <View style={styles.line}></View> */}
          <View style={styles.amountContainer}>
            <Text style={styles.text1}>Shipping</Text>
            <Text style={[styles.perItemAmount, { color: theme.specialText }]}>
              Rs.{priceData?.shippingPrice}
            </Text>
          </View>

          <View style={styles.amountContainer}>
            <Text style={styles.text1}>Promo Code</Text>
            <Text style={[styles.perItemAmount, { color: theme.specialText }]}>
              (- Rs. {promoData?.discount?.toFixed(2)} )
            </Text>
          </View>

          <View style={styles.amountContainer}>
            <Text style={styles.text1}>Import Charges</Text>
            <Text style={[styles.perItemAmount, { color: theme.specialText }]}>
              Rs.{priceData?.gstAmount?.toFixed(2)}
            </Text>
          </View>
          <View style={styles.line} />

          <View style={styles.totalAmount}>
            <Text style={[styles.totalPriceText, { color: theme.text }]}>
              Total Amount
            </Text>
            <Text style={styles.totalPrice}>
              Rs.{" "}
              {promoData?.updatedCart?.totalPrice
                ? promoData.updatedCart.totalPrice.toFixed(2)
                : priceData.totalPrice.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  const listHeader = () => (
    <>
      <View
        style={{
          height: 120,
          width:width,
          marginBottom: 20,
          paddingHorizontal: 20,
          borderRadius: 20,
        }}
      >
        <Image
          source={themeMode === "dark" ? assets.bigSale : assets.bigSale1}
          style={{ height: "100%", width: "100%", borderRadius: 20 }}
          resizeMode="contain"
        />
      </View>
      <View>
        <Text
          style={{
            paddingBottom: 20,
            paddingHorizontal: 30,
            fontSize: 16,
            color: theme.text,
          }}
        >
          Products ({cartData?.length})
        </Text>
      </View>
    </>
  );


  return (
    <ImageBackground
      source={themeMode === "dark" ? assets.BackgroundDark : assets.Background}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView style={[styles.container]}>
        <View style={styles.header}>
          <Text style={[styles.heading, { color: theme.specialText }]}>
            Your Cart
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <FlatList
          ref={flatListRef}
            data={cartData}
            renderItem={renderData}
            keyExtractor={(item) => item.productId}
            ListHeaderComponent={listHeader}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={listFooter}
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: 20,
            }}
          />
        </View>

        <View
          style={{
            paddingTop: 10,
            paddingBottom: 70,
            paddingHorizontal: 20,
          }}
        >
          <CustomButton
            title={"Proceed to checkout"}
            textStyle={{ fontWeight: "800", fontSize: 18 }}
            onPress={() => navigation.navigate("DeliveryAddress")}
            buttonStyle={{ borderRadius: 25 }}
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    fontFamily: Typography.font.medium,
    fontWeight: "700",
    fontSize: 22,
    color: Typography.Colors.primary,
    paddingHorizontal: 28,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingTop: 25,
    paddingBottom: 16,
  },
  Image: {
    height: "100%",
    width: "100%",
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  dataContainer: {
    flex: 2,
    paddingVertical: 18,
    paddingRight: 18,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    // backgroundColor:Typography.Colors.white,
    elevation: 1,
  },
  title: {
    fontFamily: Typography.font.bold,
    color: Typography.Colors.black,
    fontSize: 14,
    fontWeight: "800",
  },
  price: {
    fontFamily: Typography.font.bold,
    color: Typography.Colors.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  amount: {
    fontFamily: Typography.font.bold,
    fontWeight: "800",
    color: Typography.Colors.black,
    fontSize: 16,
    paddingTop: 5,
  },
  productAmount: {
    justifyContent: "center",
    gap: 8,
    flex: 1,
    flexDirection: "row",
  },
  subContainer: {
    flexDirection: "row",
    // borderWidth: 0.2,
    marginBottom: 18,
    borderRadius: 10,
    marginTop: 4,
    paddingHorizontal: 22,

    // elevation:2
  },
  imageConatiner: {

    flex: 1,
    backgroundColor: Typography.Colors.white,
    elevation: 1,
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
    height: 150,
    width: 100,
  },
  quantityButton: {
    width: 20,
    alignItems: "center",
  },
  quantity: {
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Typography.Colors.lightpurple,
    backgroundColor: Typography.Colors.lightpurple,
  },
  quantityContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 50,
    height: 24,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  innerContainer: {
    flex: 2,
  },
  iconContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: 5,
    gap: 5,
  },
  dataSubConatiner: {
    flex: 1,
    flexDirection: "row",
    paddingLeft: 10,
  },
  priceContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
  },
  priceSubContainer: {
    flex: 1,
  },
  quantityText: {
    textAlign: "center",
    fontFamily: Typography.font.medium,
    color: Typography.Colors.primary,
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },

  offers: {
    alignItems: "flex-end",
    paddingVertical: 15,
  },
  text1: {
    fontFamily: Typography.font.medium,
    color: Typography.Colors.greydark,
    fontSize: 14,
    paddingVertical: 4,
  },
  perItemAmount: {
    fontFamily: Typography.font.medium,
    color: Typography.Colors.primary,
    fontSize: 14,
  },
  mainAmountContainer: {

    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,

  },
  amountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  totalAmount: {
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalPriceText: {
    fontFamily: Typography.font.bold,
    fontWeight: "700",
    color: Typography.Colors.black,
    fontSize: 18,
  },
  totalPrice: {
    fontFamily: Typography.font.bold,
    fontWeight: "700",
    color: Typography.Colors.nature,
    fontSize: 18,
  },

  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyCartTitle: {
    fontFamily: Typography.font.bold,
    fontSize: 24,
    color: Typography.Colors.primary,
    marginTop: 20,
    marginBottom: 10,
  },
  emptyCartText: {
    fontFamily: Typography.font.medium,
    fontSize: 16,
    color: Typography.Colors.greydark,
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  startShoppingButton: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    backgroundColor: Typography.Colors.primary,
    marginTop: 10,
    width: "80%",
  },
  startShoppingText: {
    fontFamily: Typography.font.bold,
    fontSize: 16,
  },
  loadingText: {
    fontFamily: Typography.font.medium,
    fontSize: 16,
    color: Typography.Colors.primary,
  },
  line: {
    borderWidth: 0.3,
    borderBottomColor: "#E8E8E8",
  },

  glassOfferContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 30,
    justifyContent: "space-between",
    borderRadius: 6,
    paddingVertical: 10,

  },
  couponText: {
    paddingLeft: 8,
    alignItems: "center",
    paddingTop: 2,
    fontWeight: "500",
    fontSize: 15,
  },
  productText:{
    fontSize: 14,
    fontWeight: "600",
    backgroundColor: Typography.Colors.lightpurple,
    padding: 3,
  }
});

export default CartScreen;
