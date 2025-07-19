import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { assets } from "../../../assets/images";
import { TrendingProps } from "../../models/HomePage.type";
import { BannerData, DealData } from "../../constant";
import Carousel from "react-native-reanimated-carousel";
import CardComponent from "../../components/card/CardComponent";
import ProductComponent from "../../components/product/ProductComponent";
import TopHeaderComponent from "../../components/header/TopHeaderComponent";
import { useNavigation } from "@react-navigation/native";
import { Typography } from "../../theme/Colors";
import { Platform, Alert, PermissionsAndroid } from "react-native";

import {
  CarousalData,
  Categories,
  Collection,
} from "../../services/api/apiServices";
import useAuthStore from "../../stores/useAuthStore";
import SkeletonLoader from "../../components/product/HomeScreenSkeleton";
import messaging from "@react-native-firebase/messaging";

// Import Notifee
import notifee, { AndroidImportance } from "@notifee/react-native";
import { useTheme } from "@shopify/restyle";
import { useAppTheme } from "../../theme/useAppTheme";
import { SafeAreaView } from "react-native";

const { width } = Dimensions.get("window");

const HomeScreen = () => {
  const navigation = useNavigation();
  const themes = useTheme();
  const theme = useAppTheme();
// console.log(theme,'themeaaaathemeaaaathemeaaaa')
  //Dark theme
  const themeMode = useAuthStore((state) => state.theme);
  // console.log(themeMode,'thyememeeee')
  // const theme =
  //   themeMode === "dark"
  //     ? {
  //         background: Typography.Colors.black,
  //         text: Typography.Colors.white,
  //       }
  //     : {
  //         background: Typography.Colors.white,
  //         text: Typography.Colors.black,
  //       };

  // Initialize Notifee
  const initializeNotifee = async () => {
    try {
      // Request notification permissions
      await notifee.requestPermission();

      // Create notification channel for Android
      if (Platform.OS === "android") {
        await notifee.createChannel({
          id: "default",
          name: "Default Channel",
          importance: AndroidImportance.HIGH,
          sound: "default",
          vibration: true,
          badge: true,
        });

        // Create high priority channel
        await notifee.createChannel({
          id: "high-priority",
          name: "High Priority Notifications",
          importance: AndroidImportance.HIGH,
          sound: "default",
          vibration: true,
          badge: true,
        });
      }

      // console.log('Notifee initialized successfully');
    } catch (error) {
      console.error("Error initializing Notifee:", error);
    }
  };

  // Display notification using Notifee
  const displayNotification = async (title, body, data = {}) => {
    try {
      await notifee.displayNotification({
        title: title || "New Notification",
        body: body || "You have a new message",
        data: data,
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
          sound: "default",
          // badge: 1,
          // categoryId: "default",
          // attachments: [
          //   {
          //     url: 'https://i.postimg.cc/Kzj511xK/120.png',
          //   },
          // ],
        },
      });
    } catch (error) {
      console.error("Error displaying notification:", error);
    }
  };

  // Push Notification
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      // console.log("Authorization status:", authStatus);
      getFcmToken(); // call function to get token
    } else {
      Alert.alert(
        "Permission required",
        "Please enable push notifications in settings."
      );
    }
  };

  const getFcmToken = async () => {
    const token = await messaging().getToken();
    // console.log("FCM Token:", token);
    // You can send this token to your server
  };

  const requestAndroidPermission = async () => {
    if (Platform.OS === "android" && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Notification permission denied");
      }
    }
  };

  // Initialize everything
  useEffect(() => {
    // Initialize Notifee first
    initializeNotifee();
    testNotification();
    // Then request permissions
    requestUserPermission();
    requestAndroidPermission();

    // Handle foreground messages - THIS IS THE KEY FIX
    // const unsubscribeForeground = messaging().onMessage(
    //   async (remoteMessage) => {
    //     console.log("Foreground message received:", remoteMessage);

    //     const { notification, data } = remoteMessage;

    //     if (notification) {
    //       // Display notification using Notifee
    //       await displayNotification(
    //         notification.title,
    //         notification.body,
    //         data
    //       );
    //     }
    //   }
    // );

    // Handle notification press events
    const unsubscribePress = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === "press") {
        console.log("User pressed notification", detail.notification);

        // Handle navigation based on notification data
        const notificationData = detail.notification?.data;
        if (notificationData?.screen) {
          navigation.navigate(notificationData.screen, notificationData);
        } else if (notificationData?.productId) {
          // Navigate to product detail page
          navigation.navigate("ProductDetailPage", {
            data: { id: notificationData.productId },
          });
        }
      }
    });

    // Handle background notification events
    notifee.onBackgroundEvent(async ({ type, detail }) => {
      // console.log(type, "+");

      if (type === "press") {
        console.log("Background notification press:", detail.notification);
        // Handle background press if needed
      }
    });

    // Handle notification when app is opened from background
    // messaging().onNotificationOpenedApp((remoteMessage) => {
    //   console.log("App opened by notification from background:", remoteMessage);

    //   // Handle navigation
    //   const { data } = remoteMessage;
    //   if (data?.screen) {
    //     navigation.navigate(data.screen, data);
    //   }
    // });

    // Handle notification when app is opened from closed state
    // messaging()
    //   .getInitialNotification()
    //   .then((remoteMessage) => {
    //     if (remoteMessage) {
    //       console.log(
    //         "App opened by notification from closed state:",
    //         remoteMessage
    //       );

    //       // Handle navigation
    //       const { data } = remoteMessage;
    //       if (data?.screen) {
    //         navigation.navigate(data.screen, data);
    //       }
    //     }
    //   });

    // Cleanup subscriptions
    return () => {
      // unsubscribeForeground();
      unsubscribePress();
    };
  }, []);

  // Test notification function (for debugging)
  const testNotification = async () => {
    await displayNotification(
      "Test Notification",
      "This is a test notification from your app!",
      { screen: "ProductDetailPage", productId: "123" }
    );
  };

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [Category, setCategory] = useState([]);
  const [CarouselData, setCarouselData] = useState([]);
  const [ourCollection, setOurCollection] = useState([]);

  const animations = useRef(
    BannerData.map(() => new Animated.Value(2))
  ).current;

  // Load all data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [categoriesData, carouselData, collectionData] =
          await Promise.all([Categories(), CarousalData(), Collection()]);

        setCategory(categoriesData?.data || []);
        setCarouselData(carouselData?.data?.data || []);
        setOurCollection(collectionData?.data || []);
      } catch (error) {
        console.log("Error loading data:", error);
      } finally {
        // Add a minimum loading time for better UX
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };

    loadData();
  }, []);

  // Show skeleton while loading
  if (isLoading) {
    return <SkeletonLoader />;
  }

  const renderCategoryPage = (id, name) => {
    navigation.navigate("Category", { id: id, name: name });
  };

  // Category Render Item
  const renderItem = ({ item }) => {
    return (
      <Pressable
        style={styles.subContainer}
        onPress={() => renderCategoryPage(item.id, item.name)}
      >
        <Image source={{ uri: item.image }} style={styles.flatlistImage} />
        <Text
          style={[styles.text, { paddingTop: 12, color: theme.text }]}
          numberOfLines={1}
        >
          {item.name}
        </Text>
      </Pressable>
    );
  };

  // Carousel Render Item
  const CarouselRenderItem = ({ item }) => {
    return (
      <ImageBackground
        source={{ uri: item.image }}
        style={styles.imageBackground}
        imageStyle={styles.imagestyle}
      >
        {/* <View style={styles.overlay}>
          <Image
            style={styles.logostyle}
            source={{ uri: item.logoURL }}
            resizeMode="contain"
          /> */}
          {/* <Text style={styles.text1}>{item.description}</Text> */}
          {/* <Text style={styles.text1}>{item.offer}</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Explore</Text>
          </TouchableOpacity> */}
        {/* </View> */}
      </ImageBackground>
    );
  };

  const animateDot = (index: number, isActive: boolean) => {
    Animated.timing(animations[index], {
      toValue: isActive ? 8 : 8,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const TrendingRenderItem = ({ item }) => {
    return (
      <View style={styles.container}>
        <CardComponent
          img={{ uri: item.images[0] ? item.images[0] : item.images[1] }}
          logo={{ uri: item.brand.logo }}
          offer={item.discountPrice}
          productType={item.productType}
          onClick={() => renderProductPage(item)}
        />
      </View>
    );
  };

  //Deal of the day Render item
  const DealRenderItem = ({ item }: { item: TrendingProps }) => {
    return (
      <Pressable style={styles.dealView}>
        <CardComponent
          staticContainer={styles.staticContainer}
          img={item.img}
          amount={item.amount}
          productType={item.productType}
          productImgStyle={styles.productImage}
          onClick={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      </Pressable>
    );
  };

  const renderProductPage = (data: any) => {
    navigation.navigate("ProductDetailPage", { data: data });
  };

  //Product Render item
  const ProductRenderItem = ({ item }) => {
    return (
      <View style={styles.container}>
        <ProductComponent
          images={item.images}
          productName={item.title}
          brandName={item?.brand?.name}
          initialRate={item.discountPrice}
          rate={item.price}
          discount={item.discountPercentage}
          onClick={() => renderProductPage(item)}
        />
      </View>
    );
  };

  const ListHeader = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    return (
      <SafeAreaView>
        {/* Header View */}
        <View
          style={[styles.HeaderStyle]}
        >
          <TopHeaderComponent />
        </View>

        {/* Test Notification Button - Remove this in production */}
        {/* <TouchableOpacity 
          style={styles.testButton} 
          onPress={testNotification}
        >
          <Text style={styles.testButtonText}>Test Notification</Text>
        </TouchableOpacity> */}

        {/* Category View */}
        <View style={styles.cateoryContainer}>
          <View style={styles.mainImage}>
            <View style={styles.categoryImageContainer}>
              <Image
                source={assets.category}
                style={styles.categoryImage}
                resizeMode="contain"
              />
            </View>
            <Text
              numberOfLines={1}
              style={[styles.text, { color: theme.text }]}
            >
              Categories
            </Text>
          </View>
          <View style={styles.categorySubContainer}>
            <FlatList
              data={Category}
              renderItem={renderItem}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>

        {/* Carousel */}
        <View style={styles.carousel}>
          <View style={{ position: "relative" }}>
            <Carousel
              loop
              autoPlay
              autoPlayInterval={3000}
              width={width}
              height={250.67}
              onSnapToItem={(index) => {
                setCurrentIndex(index);
              }}
              data={CarouselData}
              scrollAnimationDuration={1000}
              renderItem={CarouselRenderItem}
            />
            <View style={styles.paginationContainer}>
              {CarouselData?.map((_, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.dot,
                    {
                      // width: animations[index],
                      backgroundColor:
                        currentIndex === index
                          ? Typography.Colors.lightblack
                          : Typography.Colors.offwhite,
                    },
                  ]}
                />
              ))}
            </View>
          </View>
        </View>
        {/* Trending Cards */}
        <View style={styles.trendContainer}>
          <Text
            numberOfLines={1}
            style={[
              styles.TrendingText,
              { paddingLeft: 10, color: theme.text },
            ]}
          >
            Trending Offers
          </Text>
          <FlatList
            data={ourCollection.slice(5, 10)}
            renderItem={TrendingRenderItem}
            keyExtractor={(item) => item?.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 20 }}
          />
          <View style={{paddingVertical:20 ,height:200,width:width-20}} >
            <Image source={themeMode==='dark'? assets.bannerDark:assets.bannerLight} style={styles.bannerSize} resizeMode="cover" />
          </View>
        </View>

        <View style={styles.dealContainer}>
          <Text
            numberOfLines={1}
            style={[styles.TrendingText, { paddingLeft: 5, color: theme.text }]}
          >
            Deals Of The Day
          </Text>
        </View>
      </SafeAreaView>
    );
  };

  const listFooter = () => {
    return (
      <>
        <View style={styles.dealContainer}>
          <Text style={[styles.TrendingText, { color: theme.text }]}>
            Our Collection
          </Text>
          <FlatList
            data={ourCollection?.slice(0, 10)}
            renderItem={ProductRenderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
      </>
    );
  };

  return (
    <ImageBackground source={themeMode === 'dark'? assets.BackgroundDark : assets.Background} style={{flex:1,}} resizeMode="cover">
    <FlatList
      data={DealData.slice(0, 4)}
      renderItem={DealRenderItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      contentContainerStyle={{ gap: 10}}
      columnWrapperStyle={styles.row}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={ListHeader}
      ListHeaderComponentStyle={{
        flex: 1,
        // backgroundColor: theme.background,
      }}
      ListFooterComponent={listFooter}
      ListFooterComponentStyle={{
        flex: 1,
        // backgroundColor: theme.background,
      }}
    />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Test button style - Remove in production
  testButton: {
    backgroundColor: "#FF6B6B",
    padding: 10,
    margin: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  testButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  //HeaderStyle
  HeaderStyle: {
    paddingHorizontal: 20,
    // paddingTop:40
  },

  //Category Style
  cateoryContainer: {
    paddingTop: 11,
    flexDirection: "row",
  },
  categoryImageContainer: {
    height: 65,
    width: 65,
    backgroundColor: Typography.Colors.skyblue,
    alignItems: "center",
    borderRadius: 40,
    justifyContent: "center",
  },
  mainImage: {
    paddingLeft: 8,
    flex: 0.18,
  },
  categorySubContainer: {
    flex: 0.8,
  },
  categoryImage: {
    height: 25,
    width: 25,
  },
  flatlistImage: {
    height: 62,
    width: 62,
    objectFit: "cover",
    borderRadius: 30,
  },
  text: {
    fontSize: 14,
    paddingTop: 10,
    fontFamily: Typography.font.regular,
    color: Typography.Colors.lightblack,
  },
  subContainer: {
    width: 90,
    alignItems: "center",
  },

  //Carousel Style
  carousel: {
    paddingTop: 40,

    // paddingHorizontal:20
  },
  imageBackground: {
    // width: width-80,
    height: 209.67,
    // backgroundColor:'green',
    marginHorizontal:20
  },
  imagestyle: {
    // borderWidth: 5,
    borderRadius:30,
    borderColor: Typography.Colors.white,
  },
  // overlay: {
  //   height: "100%",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   backgroundColor: Typography.Colors.lightblack,
  //   opacity: 0.6,
  //       // borderWidth: 5,
  //   borderRadius:30,
  // },
  logostyle: {
    width: 175,
    height: 29,
  },
  text1: {
    color: Typography.Colors.white,
    fontSize: 24,
    fontFamily: Typography.font.bold,
    textAlign: "center",
    paddingTop: 18,
  },
  button: {
    backgroundColor: "transparent",
    borderColor: Typography.Colors.white,
    borderWidth: 2,
    borderRadius: 10,
    marginTop: 27,
    padding: 6,
    paddingHorizontal: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: Typography.Colors.white,
    fontSize: 18,
    fontFamily: Typography.font.regular,
  },

  //TrendingStyle
  trendContainer: {
    paddingTop: 20,
    paddingLeft: 11,
  },
  bannerSize:{
    // flex:1,
    width:'100%',
    height:'100%',
  },
  TrendingText: {
    fontWeight: "500",
    fontSize: 20,
  },

  //Deal of the day
  staticContainer: {
    flex: 1,
    paddingTop: 10,
  },
  dealView: {
    height: 251,
    width: "47%",
  },
  productImage: {
    width: "100%",
    flex: 7,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  dealContainer: {
    paddingHorizontal: 20,
    justifyContent: "center",
    paddingTop: 20,
    flex: 1,
  },
  row: {
    alignSelf: "center",
    gap: 20,
    marginHorizontal: 20,
  },
  buttonStyle: {
    backgroundColor: Typography.Colors.white,
    borderWidth: 1,
    borderColor: Typography.Colors.primary,
  },
  buttonView: {
    flex: 1,
    gap: 13,
    paddingHorizontal: 13,
    flexDirection: "row",
  },
  textStyle: {
    color: Typography.Colors.white,
  },
  paginationContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    height: 8,
    width:8,
    borderRadius: 90,
    marginHorizontal: 3,
  },
  textstyle: {
    fontSize: 14,
    color: Typography.Colors.black,
    fontWeight: "bold",
    padding: 10,
    textAlign: "center",
  },
  buttonstyle: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Typography.Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
