import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
  Image,
  ImageBackground,
  Alert,
  Animated,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { Typography } from "../../theme/Colors";
import { PromoCode, promocode } from "../../services/api/apiServices";
import { useNavigation, useRoute } from "@react-navigation/native";
import { assets } from "../../../assets/images";
import useAuthStore from "../../stores/useAuthStore";
const { width } = Dimensions.get("window");

// Optimized Skeleton Component with reduced re-renders
const SkeletonPlaceholder = React.memo(({ width, height, borderRadius = 8, skeletonColor }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 800, 
          useNativeDriver: true, 
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: skeletonColor,
          opacity: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0.3, 0.7],
          }),
        },
      ]}
    />
  );
});

// Memoized Skeleton Offer Component
const SkeletonOffer = React.memo(({ theme }) => (
  <View style={styles.OfferView}>
    <ImageBackground
      source={assets.OfferBackground}
      style={styles.offerBackground}
      resizeMode="contain"
    >
      <View style={styles.subContainer}>
        {/* Discount Box Skeleton */}
        <View style={[styles.Box, { backgroundColor: theme.skeletonColor }]}>
          <SkeletonPlaceholder 
            width={50} 
            height={30} 
            borderRadius={4} 
            skeletonColor={theme.skeletonColor}
          />
        </View>
        
        {/* Content Section Skeleton */}
        <View style={styles.contentSection}>
          <SkeletonPlaceholder 
            width={120} 
            height={18} 
            borderRadius={4} 
            skeletonColor={theme.skeletonColor}
          />
          <View style={{ marginVertical: 6 }}>
            <SkeletonPlaceholder 
              width={100} 
              height={15} 
              borderRadius={4} 
              skeletonColor={theme.skeletonColor}
            />
          </View>
          <SkeletonPlaceholder 
            width={80} 
            height={16} 
            borderRadius={4} 
            skeletonColor={theme.skeletonColor}
          />
        </View>
        
        {/* Date Section Skeleton */}
        <View style={styles.dateSection}>
          <SkeletonPlaceholder 
            width={30} 
            height={12} 
            borderRadius={4} 
            skeletonColor={theme.skeletonColor}
          />
          <View style={{ marginTop: 4 }}>
            <SkeletonPlaceholder 
              width={20} 
              height={14} 
              borderRadius={4} 
              skeletonColor={theme.skeletonColor}
            />
          </View>
          <View style={{ marginTop: 2 }}>
            <SkeletonPlaceholder 
              width={25} 
              height={14} 
              borderRadius={4} 
              skeletonColor={theme.skeletonColor}
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  </View>
));


const OfferItem = React.memo(({ item, index, colors, getDiscount, saleName, onCodeApplied }) => (
  <View style={styles.OfferView}>
    <ImageBackground
      source={assets.OfferBackground}
      style={styles.offerBackground}
      resizeMode="contain"
    >
      <Pressable style={styles.subContainer} onPress={() => onCodeApplied(item)}>
        <View
          style={[{ backgroundColor: colors[index % colors.length] }, styles.Box]}
        >
          <Text selectable={true} style={styles.codeBox}>
            {getDiscount[item]}
          </Text>
        </View>
        <View style={{ flex: 2,justifyContent:"center" }}>
          <Text style={styles.saleName}>{saleName[index]}</Text>
          <Text style={[styles.description]}>
            Sale of {getDiscount[item]}
          </Text>
          <Text style={styles.codeName}>Code: {item}</Text>
        </View>
        <View style={{ flex: 0.5, alignItems: 'center',justifyContent:'center' }}>
          <Text style={styles.dateHeading}>Exp.</Text>
          <Text style={styles.date}>31</Text>
          <Text style={styles.date}>Dec</Text>
        </View>
      </Pressable>
    </ImageBackground>
  </View>
));

const PromoCodeScreen = () => {
  const themeMode = useAuthStore((state) => state.theme);
  
  // Memoize theme to prevent unnecessary re-renders
  const theme = useMemo(() => 
    themeMode === "dark"
      ? {
          background: Typography.Colors.black,
          text: Typography.Colors.white,
          skeletonColor: '#2A2A2A',
        }
      : {
          background: Typography.Colors.white,
          text: Typography.Colors.black,
          skeletonColor: '#E1E9EE',
        },
    [themeMode]
  );

  const navigation = useNavigation();
  const [promoCodeData, setPromoCodeData] = useState();
  const [loading, setLoading] = useState(true);

  const route = useRoute();
  const onApplyPromo = route.params?.onApplyPromo;

  // Memoize static data
  const colors = useMemo(() => ["#23262f", "#777E90", "#B1B5B3"], []);
  
  const getDiscount = useMemo(() => ({
    SAVE10: "10%",
    SAVE20: "20%",
    SAVE30: "30%",
    SAVE40: "40%",
    SAVE50: "50%",
    SAVE60: "60%",
  }), []);

  const saleName = useMemo(() => 
    ["Holiday Sale", "First order", "Summer Sale", "Black Friday", "Hot Deals", "Mega Sale"],
    []
  );


  const skeletonData = useMemo(() => Array(6).fill().map((_, i) => ({ id: `skeleton-${i}` })), []);


  const handleCodeApplied = useCallback(async (promoCode) => {
    try {
      const response = await PromoCode(promoCode);

      if (onApplyPromo) {
        onApplyPromo(promoCode, response.data);
      }

      navigation.goBack();
    } catch (error) {
      console.error(
        "Error applying promo code:",
        error.response?.data || error.message
      );
      Alert.alert("Error", "Failed to apply promo code. Please try again.");
    }
  }, [onApplyPromo, navigation]);

  const renderSkeletonOffer = useCallback(() => (
    <SkeletonOffer theme={theme} />
  ), [theme]);

  const renderOffer = useCallback(({ item, index }) => (
    <OfferItem
      item={item}
      index={index}
      colors={colors}
      getDiscount={getDiscount}
      saleName={saleName}
      onCodeApplied={handleCodeApplied}
    />
  ), [colors, getDiscount, saleName, handleCodeApplied]);


  const keyExtractor = useCallback((item, index) => 
    loading ? `skeleton-${index}` : index.toString(),
    [loading]
  );

  const getItemLayout = useCallback((data, index) => ({
    length: 140,
    offset: 140 * index,
    index,
  }), []);

  useEffect(() => {
    const fetchPromoCode = async () => {
      try {
        const response = await promocode();
        setPromoCodeData(response.data);
      } catch (error) {
        console.error(
          "Failed to fetch promo code",
          error.response?.data || error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPromoCode();
  }, []);

  // Memoized background source
  const backgroundSource = useMemo(() => 
    themeMode === "dark" ? assets.BackgroundDark : assets.Background,
    [themeMode]
  );

  return (
    <ImageBackground
      source={backgroundSource}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView>
      <View style={styles.headerRow}>
        <Pressable onPress={() => navigation.goBack()}>
          <Image
            source={assets.arrowWhite}
            style={[styles.backIcon]}
          />
        </Pressable>
        <Text
          numberOfLines={1}
          style={[styles.headerTitle, { color: theme.text }]}
        >
          Coupons
        </Text>
      </View>

      <FlatList
        data={loading ? skeletonData : (promoCodeData || [])}
        keyExtractor={keyExtractor}
        renderItem={loading ? renderSkeletonOffer : renderOffer}

        getItemLayout={getItemLayout} 

      />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default PromoCodeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  HeaderStyle: {
    backgroundColor: Typography.Colors.white,
    paddingHorizontal: 20,
  },
  header: {
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 12,
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderColor: Typography.Colors.lightgrey,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  offerContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: Typography.Colors.greydark,
  },
  codeBox: {
    fontWeight: "bold",
    fontSize: 30,
    color: Typography.Colors.white,
  },
  description: {
    marginVertical: 6,
    fontSize: 15,
    color: Typography.Colors.lightgrey
  },
  expires: {
    fontSize: 12,
    color: Typography.Colors.red,
    marginTop: 4,
  },
  warning: {
    fontSize: 12,
    color: "red",
    marginTop: 2,
  },
  backIcon: {
    color: Typography.Colors.primary,
    height: 28,
    width: 28,
  },
  headerRow: {
    paddingBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 13,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: Typography.font.bold,
    color: Typography.Colors.primary,
  },
  OfferView: {
    height: 130,
    width: width-40,
    marginBottom: 10,
  },
  offerBackground: {
    height: '100%',
    width: '100%'
  },
  subContainer: {
    flexDirection: "row",
    paddingVertical: 20,
    flex: 1,
    paddingLeft: 15
  },
  Box: {
    flex: 1,
    borderRadius: 10,
    marginHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    marginVertical:5
  },
  saleName: {
    fontSize: 18,
    fontWeight: '600'
  },
  codeName: {
    fontSize: 16,
    fontWeight: '600'
  },
  date: {
    fontSize: 14,
    fontWeight: '600'
  },
  dateHeading: {
    paddingBottom: 22,
    color: Typography.Colors.lightgrey
  },
  contentSection: {
    flex: 2,
    justifyContent: 'center',
  },
  dateSection: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});