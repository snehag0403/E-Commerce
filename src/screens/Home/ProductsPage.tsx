import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  Dimensions,
  ImageBackground,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import HeaderComponent from "../../components/header/HeaderComponent";
import { assets } from "../../../assets/images";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import ProductComponent from "../../components/product/ProductComponent";
import ButtonComponent from "../../components/button/ButtonComponent";
import { Typography } from "../../theme/Colors";
import { Products } from "../../services/api/apiServices";
import useAuthStore from "../../stores/useAuthStore";
const { width } = Dimensions.get("window");
// console.log(width,"width");

// Skeleton Component
const SkeletonPlaceholder = ({ width, height, style }) => {
  const opacity = useSharedValue(0.3);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 1000 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: '#E1E9EE',
          borderRadius: 4,
        },
        style,
        animatedStyle,
      ]}
    />
  );
};

const ProductsPage = ({ route }) => {
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
  const handleBackButton = () => {
    navigation.goBack();
  };
  const { category, categoryName, categoryId } = route.params;
  const [filterApplied, setFilterApplied] = useState(false);
  const [Category, setCategory] = useState();
  const [filterData, setFilterData] = useState([]);
  const [cartToggle, setCartToggle] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    Products(categoryName, category.name, categoryId)
      .then((data) => {
        setCategory(data?.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log("no data");
        setLoading(false);
      });
  }, []);
  
  const [refresh, setRefresh] = useState(false);
  
  const renderProduct = (data) => {
    return navigation.navigate("ProductDetailPage", { data: data });
  };
  
  // Function to prepare data with empty placeholder for odd items
  const prepareDisplayData = (data) => {
    if (!data || data.length === 0) return data;
    
    // If odd number of items, add an empty placeholder at the end
    if (data.length % 2 !== 0) {
      return [...data, { id: 'empty-placeholder', isEmpty: true }];
    }
    return data;
  };
  
  const ProductRenderItem = ({ item, index }) => {
    if (loading) {
      // Skeleton version matching the actual product UI
      return (
        <View style={[styles.imageContainer,{backgroundColor:theme.background}]}>
          <SkeletonPlaceholder 
            width={width/2.5} 
            height={220} 
            style={{ borderRadius: 8 }} 
          />
          <View style={styles.skeletonTextContainer}>
            <SkeletonPlaceholder width="80%" height={16} style={{ marginTop: 10 }} />
            <SkeletonPlaceholder width="50%" height={14} style={{ marginTop: 4 }} />
          </View>
        </View>
      );
    }
    // Return empty view for placeholder (invisible but maintains grid structure)
    if (item.isEmpty) {
      return <View style={[styles.imageContainer, { opacity: 0 }]} />;
    }
    return (
      <Pressable onPress={() => renderProduct(item)} style={[styles.imageContainer,{elevation:themeMode==='dark'?0:1,backgroundColor:themeMode==='dark'?Typography.Colors.charcol:Typography.Colors.white}]}>
        <Image 
          source={{ uri: item.images[0]}}
          style={styles.productImage}
        />
        <Text numberOfLines={1} style={[styles.productName,{color:theme.text}]}>{item.title}</Text>
        <Text style={[styles.productPrice,{color:theme.text}]}>Rs. {item.discountPrice}</Text>
      </Pressable>
    );
  };

  const ListHeader = () => {
    if (loading) {
      // Skeleton version of header matching the actual header UI
      return (
        <View style={[styles.header]}>
          <View style={styles.skeletonHeaderContainer}>
            <View style={styles.skeletonHeaderTop}>
              <SkeletonPlaceholder width={24} height={24} />
              <SkeletonPlaceholder width="40%" height={20} style={{ marginLeft: 16 }} />
            </View>
            <View style={styles.skeletonFilterContainer}>
              <SkeletonPlaceholder width={50} height={16} />
              <SkeletonPlaceholder width={17} height={17} style={{ marginLeft: 6 }} />
            </View>
          </View>
        </View>
      );
    }

    return (
<>
        <HeaderComponent onClick={handleBackButton} Title={category.name} />
        <View style={styles.subContainer}>
          <Pressable
            style={styles.subContainer}
            onPress={() =>
              navigation.navigate("FilterScreen", {
                category: category,
                categoryName: categoryName,
                subCategoryId: category.id,
                categoryId: categoryId,
                setFilterApplied: setFilterApplied,
                setFilterData: setFilterData,
              })
            }
          >
            <Text style={[styles.text, { color: theme.text }]}>Filters</Text>
            <Image source={assets.Filter} style={[styles.SubIcon, { tintColor: theme.text }]} />
          </Pressable>
        </View>
      </>
    );
  };

  // Create skeleton data when loading or prepare actual data
  const rawData = loading 
    ? Array.from({ length: 6 }, (_, index) => ({ id: `skeleton-${index}` }))
    : (filterApplied ? filterData?.products : Category);
  
  const displayData = prepareDisplayData(rawData);

  return (

    <ImageBackground source={themeMode === 'dark'? assets.BackgroundDark : assets.Background} style={{flex:1}} resizeMode="cover">
    <SafeAreaView style={[styles.mainContainer]}>
      <FlatList
        data={displayData}
        renderItem={ProductRenderItem}
        onRefresh={() => {
          setFilterApplied(false);
          setRefresh(false);
        }}
        numColumns={2}
        refreshing={refresh}
        keyExtractor={(item) => item.id?.toString()}
        ListHeaderComponent={ListHeader}
        ListHeaderComponentStyle={[styles.header]}
        columnWrapperStyle={styles.row}
      />
    </SafeAreaView>
    </ImageBackground>

  );
};

const styles = StyleSheet.create({
  header: {
    // backgroundColor: Typography.Colors.white,
    paddingTop: 10,
    paddingHorizontal: 14,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: Typography.Colors.white,
  },
  buttonView: {
    flex: 1,
    gap: 13,
    paddingHorizontal: 13,
    flexDirection: "row",
  },
  buttonStyle: {
    backgroundColor: Typography.Colors.white,
    borderWidth: 1,
    borderColor: Typography.Colors.primary,
  },
  textStyle: {
    color: Typography.Colors.white,
  },
  product: {
    paddingHorizontal: 20,
  },
  mainContainer: {
    // backgroundColor: Typography.Colors.white,
    flex: 1,
    paddingHorizontal:10
  },
  subContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    paddingTop: 10,
    paddingRight: 10,
  },
  text: {
    fontSize: 14,
    fontFamily: Typography.font.regular,
  },
  SubIcon: {
    height: 17,
    width: 17,
  },
  // Row style for FlatList columns
  row: {
    justifyContent: 'flex-start',
    paddingHorizontal: 0,
  },
  // Skeleton-specific styles
  skeletonTextContainer: {
    alignItems: "flex-start",
    width: '100%',
  },
  skeletonHeaderContainer: {
    paddingBottom: 16,
  },
  skeletonHeaderTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  skeletonFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 10,
  },
  productImage:{
    width: width/2.5, 
    height: 220,
    borderRadius: 8,
    // tintColor:'#F2F2F2'
    // backgroundColor:'gray',
  },
  imageContainer:{
    // backgroundColor:'#FFFFFF',
    // backgroundColor:'red',
    // elevation:2,
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
    padding:10,
    margin:10,
    borderRadius:8,
    // maxWidth: '48%', // Ensures proper column width
  },
  productName:{
    fontSize:16,
    fontFamily:Typography.font.regular,
    color:Typography.Colors.black,
    textAlign: 'left',
    // backgroundColor:'red',
    width: '100%',
    paddingLeft: 12,
    paddingTop: 10
  },
  productPrice: {
    fontSize: 14,
    fontFamily: Typography.font.regular,
    color:Typography.Colors.black,
    marginTop:4,
    textAlign: 'left',
    // backgroundColor:'red',
    width:'100%',
    paddingLeft:12
  }
});

export default ProductsPage;