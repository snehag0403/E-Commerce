import Carousel from "react-native-reanimated-carousel";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Image,
  Animated,
  TouchableOpacity,
  Pressable,
  FlatList,
  Alert,
  Platform,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { BannerData } from "../../constant";
import { assets } from "../../../assets/images";
import Toast from "react-native-toast-message";
import HeaderComponent from "../../components/header/HeaderComponent";
import { useNavigation } from "@react-navigation/native";
import { Typography } from "../../theme/Colors";
import Collapsible from "react-native-collapsible";
import {
  AddToCart,
  AddToWishlist,
  Products,
} from "../../services/api/apiServices";
import SizeComponent from "../../components/product/SizeComponent";
import Icon from "react-native-vector-icons/FontAwesome";
import ButtonComponent from "../../components/button/ButtonComponent";
import useAuthStore from "../../stores/useAuthStore";
import notifee, {
  AndroidImportance,
  AndroidStyle,
} from "@notifee/react-native";
import { AuthorizationStatus } from "@react-native-firebase/messaging";

const width = Dimensions.get("window").width;

const ProductDetailPage = ({ route }) => {
  const themeMode = useAuthStore((state) => state.theme);
  const theme =
    themeMode === "dark"
      ? {
          background: Typography.Colors.white,
          text: Typography.Colors.white,
        }
      : {
          background: "#CDCAC9",
          text: Typography.Colors.black,
        };
  const navigation = useNavigation();
  const { data } = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);

  const [collapsed, setCollapsed] = useState(true);
  const [collapsed1, setCollapsed1] = useState(true);
  const [collapsed2, setCollapsed2] = useState(true);

  const { isInWishlist, toggleWishlist } = useAuthStore();
  const wishlistToggle = isInWishlist(data.id.toString());

  const [selectedSize, setSelectedSize] = useState(
    data?.productSize?.length > 0 ? 0 : null
  );
  const [selectSize, setSelectSize] = useState(
    data?.productSize?.length > 0 ? data.productSize[0]?.id : ""
  );

  const handleSizeAddToCart = (index, sizeId) => {
    setSelectedSize(index);
    setSelectSize(sizeId);
  };

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(
    data?.productColor?.length > 0 ? data.productColor[0]?.id : ""
  );

  const handleColorAddToCart = (index, colorId) => {
    setSelectedColorIndex(index);
    setSelectedColor(colorId);
  };

  useEffect(() => {
    if (data?.productColor?.length > 0) {
      setSelectedColor(data.productColor[0]?.id);
    }

    if (data?.productSize?.length > 0) {
      setSelectSize(data.productSize[0]?.id);
    }
  }, [data]);

  // Function to create notification channel
  const createNotificationChannel = async () => {
    await notifee.createChannel({
      id: "shopping",
      name: "Shopping Notifications",
      importance: AndroidImportance.HIGH,
      sound: "default",
      vibration: true,
      badge: true,
    });
  };

  // Function to show wishlist notification
  const showWishlistNotification = async (isAdded) => {
    await createNotificationChannel();
    const title = isAdded ? " Added to Wishlist" : " Removed from Wishlist";
    const body = isAdded
      ? `${data.title} has been added to your wishlist!`
      : `${data.title} has been removed from your wishlist.`;

    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: "shopping",
        importance: AndroidImportance.HIGH,
        smallIcon: "ic_launcher",
        style: {
          type: AndroidStyle.BIGTEXT,
          text: body,
        },
      },
      ios: {
        categoryId: "shopping",
        attachments: data?.images?.[0]
          ? [
              {
                url: data.images[0],
                thumbnailHidden: false,
              },
            ]
          : [],
      },
    });
  };

  // Function to show cart notification
  // const showCartNotification = async () => {
  //   await createNotificationChannel();

  //   const selectedSizeName =
  //     data?.productSize?.find((size) => size.id === selectSize)?.name || "";
  //   const selectedColorName =
  //     data?.productColor?.find((color) => color.id === selectedColor)?.name ||
  //     "";

  //   await notifee.displayNotification({
  //     title: "🛍️ Added to Cart",
  //     body: `${data.title} (${selectedColorName}, ${selectedSizeName}) has been added to your cart!`,
  //     android: {
  //       channelId: "shopping",
  //       importance: AndroidImportance.HIGH,
  //       smallIcon: "ic_launcher",
  //       style: {
  //         type: AndroidStyle.BIGTEXT,
  //         text: `${data.title}\nColor: ${selectedColorName}\nSize: ${selectedSizeName}\nPrice: Rs. ${data.discountPrice}`,
  //       },
  //     },
  //     ios: {
  //       categoryId: "shopping",
  //       attachments: data?.images?.[0]
  //         ? [
  //             {
  //               url: data.images[0],
  //               thumbnailHidden: false,
  //             },
  //           ]
  //         : [],
  //     },
  //   });
  // };
  // import notifee, { AuthorizationStatus } from '@notifee/react-native';

  // useEffect(() => {
  //   async function requestPermission() {
  //     const settings = await notifee.requestPermission();

  //     if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
  //       console.log('✅ iOS notifications allowed');
  //     } else {
  //       console.warn('❌ iOS notifications denied');
  //     }
  //   }

  //   requestPermission();
  // }, []);

  const handleAddToWishlist = async () => {
    try {
      if (wishlistToggle) {
        const response = await notifee.displayNotification({
          title: "💜 Already in Wishlist",
          body: `${data.title} is already in your wishlist!`,

          android: {
            channelId: "default",
            importance: AndroidImportance.HIGH,
            pressAction: {
              id: "default",
            },
            smallIcon: "ic_launcher", // Make sure this icon exists
            color: Typography.Colors.primary, // Your app's primary color
            badge: 1,
            sound: "default",
            vibrationPattern: [300, 500],
          },
          ios: {
            // sound: "default",
            // largeIcon: "https://i.postimg.cc/Kzj511xK/120.png",
            // badge: 1,
            // iconUrl: "AppIcon",
            // icon
            // categoryId: "default",
            attachments: [
              {
                // iOS resource
                url: "https://i.postimg.cc/Kzj511xK/120.png",
                thumbnailHidden: true,
              },
            //   {
            //     url: "https://i.postimg.cc/Kzj511xK/120.png", // 👈 Your image/logo
            //     options: {
            //       typeHint: "public.png", // 👈 important for PNG
            //       hideThumbnail: false,   // 👈 show image on left
            //     },
            //   },
            ],
        
            // attachments: [
            //   {
            //     url: 'https://i.postimg.cc/Kzj511xK/120.png',
            //     options: {
            //       typeHint: 'public.png',
            //       hideThumbnail: false,
            //     }
            //   },
            // ],
          },
        });
      console.log( "Notification Displayed Successfully:", response)
        return;
      }

      // Item is not in wishlist, add it
      const response = await AddToWishlist(data.id);
      toggleWishlist(data.id.toString());

      const message = "Added to wishlist";

      // Show both alert and notification
      // Alert.alert("Success", message);
      await showWishlistNotification(true);
    } catch (error) {
      console.error("Error handling wishlist:", error);
      // Alert.alert("Error", "Already in wishlist");

      // Show error notification
      await notifee.displayNotification({
        title: "❌ Wishlist Error",
        body: "Already in wishlist.",
        ...(Platform.OS === "android"
          ? {
              android: {
                channelId: "shopping",
                importance: AndroidImportance.HIGH,
                smallIcon: "ic_launcher",
              },
            }
          : {
              ios: {
                sound: "default",
              },
            }),
        //   android: {
        //     channelId: "shopping",
        //     importance: AndroidImportance.HIGH,
        //     smallIcon: "ic_launcher",
        //   },
      });
    }
  };

  const [cartToggle, setCartToggle] = useState(false);

  const handleAddToCart = async () => {
    try {
      if (!selectedColor) {
        Toast.show({
          type: "error",
          text1: "Please select a color",
        });
        return;
      }

      if (!selectSize) {
        Toast.show({
          type: "error",
          text1: "Please select a size",
        });
        return;
      }

      const response = await AddToCart(data?.id, 1, selectedColor, selectSize);
      setCartToggle(!cartToggle);

      // Success toast
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Product added to cart",
        topOffset: 60,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);

      Toast.show({
        type: "error",
        text1: "Cart Error",
        text2: "Failed to add product to cart. Please try again.",
      });

      // await notifee.displayNotification({
      //   title: "❌ Cart Error",
      //   body: "Failed to add product to cart. Please try again.",
      //   android: {
      //     channelId: "shopping",
      //     importance: AndroidImportance.HIGH,
      //     smallIcon: "ic_launcher",
      //   },
      // });
    }
  };

  const handleBackButton = () => {
    navigation.goBack();
  };

  const toggleExpanded = () => {
    setCollapsed(!collapsed);
  };

  const toggleExpanded1 = () => {
    setCollapsed1(!collapsed1);
  };

  const toggleExpanded2 = () => {
    setCollapsed2(!collapsed2);
  };

  const SpecificationRenderItem = ({ item }) => {
    return (
      <View style={styles.specificContainer}>
        <Text style={[styles.specificationName, { color: theme.text }]}>
          {item.name}
        </Text>
        <Text style={[styles.specificationValue, { color: theme.text }]}>
          {item.value}
        </Text>
        <View style={styles.line} />
      </View>
    );
  };

  const CarouselRenderItem = (item) => {
    return (
      <View style={{ position: "static", flex: 1 }}>
        <ImageBackground
          // resizeMode="contain"
          source={{ uri: item.item }}
          style={[
            styles.imageBackground,
            { backgroundColor: theme.background },
          ]}
          imageStyle={[
            styles.imagestyle,
            { backgroundColor: theme.background },
          ]}
        ></ImageBackground>
        <View style={styles.IconsAboveCarousal}>
          <Pressable onPress={handleBackButton}>
            <Image
              style={styles.IconsAboveCarousalSize}
              source={assets.backArrow}
            />
          </Pressable>
          <Pressable onPress={handleAddToWishlist}>
            <Image
              style={styles.IconsAboveCarousalSize}
              source={
                wishlistToggle ? assets.redHeart : assets.blackOutlineHeart
              }
            />
          </Pressable>
        </View>
      </View>
    );
  };

  const animateDot = (index, isActive) => {
    Animated.timing(animations[index], {
      toValue: isActive ? 8 : 8,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const animations = useRef(
    BannerData.map(() => new Animated.Value(8))
  ).current;

  const handleSnap = (index) => {
    animateDot(currentIndex, false);
    animateDot(index, true);
    setCurrentIndex(index);
  };

  const renderStars = (rating) => {
    const numRating = Number(rating);
    const totalStars = 5;
    const stars = [];

    for (let i = 1; i <= totalStars; i++) {
      if (i <= numRating) {
        stars.push(
          <Icon
            key={i}
            name="star"
            size={28}
            style={[styles.icon, { color: theme.text }]}
          />
        );
      } else {
        stars.push(
          <Icon
            key={i}
            name="star-o"
            size={28}
            style={[styles.icon, { color: theme.text }]}
          />
        );
      }
    }
    return stars;
  };

  const renderYellowStars = (rating) => {
    const numRating = Number(rating);
    const totalStars = 5;
    const stars = [];

    for (let i = 1; i <= totalStars; i++) {
      if (i <= numRating) {
        stars.push(
          <Icon
            key={i}
            name="star"
            size={17}
            style={[styles.icon1, { color: Typography.Colors.yellow }]}
          />
        );
      } else {
        stars.push(
          <Icon
            key={i}
            name="star-o"
            size={17}
            style={[styles.icon1, { color: theme.text }]}
          />
        );
      }
    }
    return stars;
  };

  const ratingData = ({ item }) => {
    return (
      <>
        <View style={styles.reviews}>
          {renderYellowStars(data.averageRating)}
          <Text style={[styles.Reviews, { color: theme.text }]}>
            {item.rating}
          </Text>
        </View>
        <Text style={[styles.reviewsComment, { color: theme.text }]}>
          {item.comment}
        </Text>
        <View style={{ flexDirection: "row", gap: 9 }}>
          {item?.images?.map((img, index) => (
            <Image
              key={index}
              source={{ uri: img }}
              style={styles.reviewImage}
            />
          ))}
        </View>
      </>
    );
  };
  return (
    <ScrollView style={styles.container} nestedScrollEnabled={true}>
      {/* CAROUSEL */}

      <SafeAreaView
        style={{
          backgroundColor:
            themeMode === "dark"
              ? Typography.Colors.charcol
              : Typography.Colors.white,
        }}
      >
        <View>
          <View style={{ position: "static" }}>
            <Carousel
              loop
              autoPlay
              autoPlayInterval={2000}
              width={width}
              onSnapToItem={handleSnap}
              height={width * 1.3}
              data={data?.images}
              scrollAnimationDuration={1000}
              renderItem={(item) => CarouselRenderItem(item)}
            />
            <View style={[styles.paginationContainer]}>
              {data?.images?.map((_, index) => {
                return (
                  <Animated.View
                    key={index}
                    style={[
                      styles.dot,
                      {
                        width: animations[index],
                        backgroundColor:
                          currentIndex === index
                            ? Typography.Colors.white
                            : Typography.Colors.charcol,
                      },
                    ]}
                  />
                );
              })}
            </View>
          </View>
        </View>
        <View
          style={[
            styles.dataContainer,
            {
              backgroundColor:
                themeMode === "dark"
                  ? Typography.Colors.black
                  : Typography.Colors.white,
            },
          ]}
        >
          <View style={styles.shareContainer}>
            <Text
              numberOfLines={1}
              style={[styles.productName, { color: theme.text }]}
            >
              {data.brand.name}
            </Text>
            <Image
              source={assets.Share}
              style={[styles.ShareIcon, { tintColor: theme.text }]}
            />
          </View>
          <View>
            <Text
              numberOfLines={1}
              style={[styles.brandName, { color: theme.text }]}
            >
              {data.title}
            </Text>
          </View>
          <View style={styles.ratingBox}>
            <Text style={styles.ratingText}>{data.averageRating}</Text>
            <Text style={{ paddingLeft: 3, color: Typography.Colors.white }}>
              ★
            </Text>
          </View>
          <View style={styles.amountTimer}>
            <View style={styles.Amount}>
              <Text
                numberOfLines={1}
                style={[styles.rate, { color: theme.text }]}
              >
                ₹{data.discountPrice}
              </Text>
              <Text style={styles.initialRate}>MRP </Text>
              <Text style={styles.initialRate1}>₹{data.price}</Text>
              <Text numberOfLines={1} style={styles.discount}>
                {data.discountPercentage}% Off
              </Text>
            </View>
            <View style={styles.timer}>
              <Image source={assets.Clock} style={styles.clockIcon} />
              <Text style={styles.timerText}>13 hours left</Text>
            </View>
          </View>
          <View
            style={{
              borderWidth: 0.8,
              borderBottomColor: themeMode === "dark" ? "#23262F" : "#F5F5F5",
            }}
          ></View>
          {/* color set */}
          <View style={[styles.colour]}>
            <Text style={[styles.productName, { color: theme.text }]}>
              Color
            </Text>
            {/* <Text style={[styles.colorText, { color: theme.text }]}>
            {data?.productColor[selectedColorIndex]?.name}
          </Text> */}

            <View style={styles.circle}>
              {data.productColor.map((colorItem, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleColorAddToCart(index, colorItem?.id)}
                >
                  {selectedColorIndex === index ? (
                    <View style={styles.colorCircle}>
                      <View
                        style={[
                          styles.colorCircle1,
                          { backgroundColor: colorItem.hexCode },
                        ]}
                      />
                    </View>
                  ) : (
                    <View
                      style={[
                        styles.colorCircle1,
                        { backgroundColor: colorItem.hexCode },
                      ]}
                    />
                  )}
                </Pressable>
              ))}
            </View>
          </View>

          {/* size set */}
          <View style={[styles.size]}>
            <View style={[styles.sizeView]}>
              <Text
                style={[
                  styles.brandName,
                  { fontFamily: Typography.font.medium, color: theme.text },
                ]}
              >
                Select Size
              </Text>
            </View>

            <View style={[styles.sizeData]}>
              {data.productSize.map((sizeItem, index) => (
                <SizeComponent
                  key={index}
                  size={sizeItem.name}
                  selectedSize={selectedSize === index}
                  onClick={() => handleSizeAddToCart(index, sizeItem?.id)}
                />
              ))}
            </View>
          </View>

          {/* button */}
          <View style={[styles.buttonView]}>
            <ButtonComponent
              onClick={handleAddToCart}
              icon={assets.BagBlue}
              buttonText="Add to Cart"
              TextStyle={styles.textStyle}
              buttonStyle={[
                styles.buttonStyle,
                { backgroundColor: theme.background, height: 40 },
              ]}
            />
          </View>
          {/* accordion */}
          <View style={{ paddingTop: 10 }}>
            <Pressable onPress={toggleExpanded} style={styles.header1}>
              <View>
                {collapsed ? (
                  <View
                    style={[
                      styles.accordionHeading,
                      { borderBottomWidth: 1, borderBottomColor: "#EAEAEA" },
                    ]}
                  >
                    <Text
                      style={[styles.accordionTitle, { color: theme.text }]}
                    >
                      Product Details
                    </Text>
                    <Image source={assets.Down} style={styles.accordionIcon} />
                  </View>
                ) : (
                  <View style={styles.accordionHeading}>
                    <Text
                      style={[styles.accordionTitle, { color: theme.text }]}
                    >
                      Product Details
                    </Text>
                    <Image source={assets.Up} style={styles.accordionIcon} />
                  </View>
                )}
              </View>
            </Pressable>

            <Collapsible collapsed={collapsed}>
              <View style={styles.content}>
                <Text
                  numberOfLines={4}
                  style={[styles.accordionText, { color: theme.text }]}
                >
                  {data.description}
                </Text>
              </View>
            </Collapsible>
          </View>

          <View>
            <Pressable onPress={toggleExpanded1} style={styles.header1}>
              <View>
                {collapsed1 ? (
                  <View
                    style={[
                      styles.accordionHeading,
                      { borderBottomWidth: 1.5, borderBottomColor: "#EAEAEA" },
                    ]}
                  >
                    <Text
                      style={[styles.accordionTitle, { color: theme.text }]}
                    >
                      Specifications
                    </Text>
                    <Image source={assets.Down} style={styles.accordionIcon} />
                  </View>
                ) : (
                  <View style={styles.accordionHeading}>
                    <Text
                      style={[styles.accordionTitle, { color: theme.text }]}
                    >
                      Specifications
                    </Text>
                    <Image source={assets.Up} style={styles.accordionIcon} />
                  </View>
                )}
              </View>
            </Pressable>

            <Collapsible collapsed={collapsed1}>
              <View style={styles.content}>
                <FlatList
                  data={data.specifications}
                  renderItem={SpecificationRenderItem}
                  numColumns={2}
                  scrollEnabled={false}
                  nestedScrollEnabled={false}
                />
              </View>
            </Collapsible>
          </View>

          <View>
            <Pressable onPress={toggleExpanded2} style={styles.header1}>
              <View>
                {collapsed2 ? (
                  <View
                    style={[
                      styles.accordionHeading,
                      { borderBottomWidth: 1.5, borderBottomColor: "#EAEAEA" },
                    ]}
                  >
                    <Text
                      style={[styles.accordionTitle, { color: theme.text }]}
                    >
                      Ratings & Reviews
                    </Text>
                    <Image source={assets.Down} style={styles.accordionIcon} />
                  </View>
                ) : (
                  <View style={styles.accordionHeading}>
                    <Text
                      style={[styles.accordionTitle, { color: theme.text }]}
                    >
                      Ratings & Reviews
                    </Text>
                    <Image source={assets.Up} style={styles.accordionIcon} />
                  </View>
                )}
              </View>
            </Pressable>

            <Collapsible collapsed={collapsed2}>
              <View style={styles.ratingContainer}>
                <View style={styles.rating}>
                  <Text style={[styles.averageRating, { color: theme.text }]}>
                    {data.averageRating}
                  </Text>
                  {renderStars(data.averageRating)}
                </View>
                <FlatList
                  data={data.reviews}
                  renderItem={ratingData}
                  scrollEnabled={false}
                  nestedScrollEnabled={false}
                />
              </View>
            </Collapsible>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Typography.Colors.white,
    // paddingBottom:30
  },
  header: {
    backgroundColor: Typography.Colors.white,
    paddingVertical: 20,
    paddingHorizontal: 14,
  },
  imageBackground: {
    width: "100%",
    height: "100%",
    // position:'static'
  },
  imagestyle: {
    borderWidth: 2,
    borderColor: Typography.Colors.white,
  },
  // dataContainer: {
  //   paddingTop: 15,
  //   paddingHorizontal: 20,
  //   paddingBottom: 15,
  //   // backgroundColor: "black",
  //   // flex: 1,
  //   borderTopRightRadius: 25,
  //   borderTopLeftRadius: 25,
  //   elevation: 5,
  //   position: "absolute",
  //   top: 530,
  //   width: width,
  // },
  dataContainer: {
    paddingTop: 15,
    paddingHorizontal: 30,
    paddingBottom: 20,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    elevation: 5,
    marginTop: -45,
    zIndex: 1,
  },
  Amount: {
    flexDirection: "row",
    paddingTop: 7,
    flex: 2,
  },
  productName: {
    fontSize: 20,
    fontFamily: Typography.font.regular,
    fontWeight: "bold",
    color: Typography.Colors.lightblack,
    paddingBottom: 5,
  },
  brandName: {
    fontSize: 18,
    fontFamily: Typography.font.regular,
    color: Typography.Colors.lightblack,
    fontWeight: "bold",
  },
  initialRate: {
    fontSize: 18,
    alignSelf: "center",
    paddingLeft: 17,
    fontFamily: Typography.font.regular,
    color: "#848484",
    // textDecorationLine: "line-through",
  },
  initialRate1: {
    fontSize: 16,
    alignSelf: "center",
    // paddingLeft:17,
    fontFamily: Typography.font.regular,
    color: "#848484",
    textDecorationLine: "line-through",
  },
  rate: {
    fontSize: 20,
    // paddingLeft: 17,
    fontFamily: Typography.font.regular,
    color: Typography.Colors.lightblack,
  },
  discount: {
    fontSize: 14,
    fontFamily: Typography.font.regular,
    color: Typography.Colors.lightgreen,
    paddingLeft: 10,
    alignSelf: "center",
  },
  shareContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    // paddingHorizontal:10,
    paddingTop: 20,
    alignContent: "center",
  },
  ShareIcon: {
    height: 24,
    width: 24,
    alignSelf: "center",
  },
  timer: {
    flexDirection: "row",
    flex: 1,
    paddingTop: 7,
    justifyContent: "flex-end",
    gap: 6,
  },
  clockIcon: {
    height: 14,
    width: 14,
  },
  timerText: {
    color: "#FF4646",
    fontSize: 12,
    fontFamily: Typography.font.medium,
  },
  amountTimer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    paddingBottom: 10,
  },
  colour: {
    paddingTop: 10,
    // paddingHorizontal: 20,
  },
  circle: {
    flexDirection: "row",
    gap: 17,
    paddingTop: 7,
    alignItems: "center",
  },
  colorCircle: {
    height: 42,
    width: 42,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#C1C1C1",
  },
  colorCircle1: {
    height: 28,
    width: 28,
    borderRadius: 20,
    elevation: 5,
  },
  colorText: {
    color: Typography.Colors.lightblack,
    fontSize: 12,
    fontFamily: Typography.font.regular,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 70,
    left: 180,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  size: {
    paddingVertical: 20,
  },
  sizeView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textStyle: {
    fontSize: 16,
    fontFamily: Typography.font.regular,
    color: Typography.Colors.black,
  },
  sizeData: {
    flexDirection: "row",
    gap: 17,
    paddingTop: 7,
  },
  buttonView: {
    flex: 1,
    // gap: 13,
    // paddingHorizontal: 13,
    flexDirection: "row",
  },
  buttonStyle: {
    borderWidth: 1,
    borderColor: Typography.Colors.white,
    // padding:20
  },
  header1: {
    // paddingHorizontal: 20,
  },
  content: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  accordionHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  accordionTitle: {
    fontSize: 18,
    fontFamily: Typography.font.medium,
    color: Typography.Colors.lightblack,
    paddingVertical: 10,
    textAlign: "center",
  },
  accordionIcon: {
    height: 21,
    width: 21,
    justifyContent: "center",
  },
  accordionText: {
    fontFamily: Typography.font.regular,
    fontSize: 14,
    color: Typography.Colors.black,
  },
  specificationName: {
    fontFamily: Typography.font.regular,
    color: Typography.Colors.lightgrey,
    fontSize: 14,
  },
  specificContainer: {
    justifyContent: "space-between",
    flex: 1,
  },
  specificationValue: {
    fontFamily: Typography.font.regular,
    fontSize: 14,
    color: Typography.Colors.black,
    paddingVertical: 7,
  },
  line: {
    height: 1.5,
    width: "70%",
    backgroundColor: "#EAEAEA",
    marginVertical: 7,
  },
  icon: {
    paddingTop: 3,
    paddingLeft: 5,
  },
  icon1: {
    paddingTop: 3,
    paddingRight: 5,
  },
  rating: {
    flexDirection: "row",
    paddingVertical: 15,
    alignItems: "center",
  },
  averageRating: {
    fontFamily: Typography.font.medium,
    fontSize: 28,
    color: Typography.Colors.lightblack,
  },
  ratingContainer: {
    paddingHorizontal: 20,
  },
  reviews: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 9,
  },
  Reviews: {
    fontFamily: Typography.font.regular,
    fontSize: 14,
    color: Typography.Colors.black,
  },
  reviewImage: {
    height: 91,
    width: 95,
    borderRadius: 10,
    marginVertical: 9,
  },
  reviewsComment: {
    fontFamily: Typography.font.regular,
    color: Typography.Colors.lightblack,
    fontSize: 14,
    paddingTop: 9,
  },
  ratingBox: {
    backgroundColor: Typography.Colors.lightgreen,
    padding: 2,
    marginTop: 10,
    borderRadius: 4,
    width: "15%",
    flexDirection: "row",
  },
  ratingText: {
    fontFamily: Typography.font.regular,
    color: Typography.Colors.white,
    fontSize: 16,
    paddingLeft: 5,
  },
  IconsAboveCarousal: {
    flex: 2,
    // backgroundColor:'red',
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: width,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  IconsAboveCarousalSize: {
    height: 40,
    width: 40,
  },
});

export default ProductDetailPage;
