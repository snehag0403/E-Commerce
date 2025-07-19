import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  StyleSheet,
  ImageBackground,
  Animated,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState, useRef } from "react";
import HeaderComponent from "../../components/header/HeaderComponent";
import { assets } from "../../../assets/images";
import { SubCategories } from "../../services/api/apiServices";
import { CategoryProps } from "../../models/HomePage.type";
import { Typography } from "../../theme/Colors";
import { useNavigation } from "@react-navigation/native";
import useAuthStore from "../../stores/useAuthStore";

const { width } = Dimensions.get('window');

const Category = ({ route }) => {
  const { name, id } = route.params;
  const navigation = useNavigation();
  const themeMode = useAuthStore((state) => state.theme);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const theme =
    themeMode === "dark"
      ? {
          background: Typography.Colors.black,
          text: Typography.Colors.white,
          cardBackground: '#1a1a1a',
          shadowColor: '#ffffff20',
        }
      : {
          background: Typography.Colors.white,
          text: Typography.Colors.black,
          cardBackground: Typography.Colors.white,
          shadowColor: '#00000020',
        };

  const renderProductPage = (category) => {
    navigation.navigate("ProductsPage", {
      category: category,
      categoryName: name,
      categoryId: id
    });
  };

  const AnimatedPressable = ({ item, index }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View
        style={[
          styles.itemContainer,
          {
            transform: [{ scale: scaleAnim }],
            backgroundColor: theme.cardBackground,
            shadowColor: theme.shadowColor,
          }
        ]}
      >
        <Pressable
          onPress={() => renderProductPage(item)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.pressableContainer}
        >
          <View style={styles.subContainer}>
            <ImageBackground
              source={{ uri: item.image || item.imageUrl || item.photo }}
              defaultSource={assets.categoryImage}
              style={styles.backgroundContainer}
              imageStyle={styles.backgroundImage}
            >
              <View style={styles.halfOverlay}>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>
                    {item.name}
                  </Text>
                  <Ionicons 
                    name="arrow-forward" 
                    size={20} 
                    color={Typography.Colors.white} 
                    style={styles.arrowIcon}
                  />
                </View>
              </View>
            </ImageBackground>
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  const renderItem = ({ item, index }: { item: CategoryProps, index: number }) => {
    return <AnimatedPressable item={item} index={index} />;
  };

  const [Category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    SubCategories(name)
      .then((data) => {
        setCategory(data?.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e.message);
        setLoading(false);
      });
  }, []);

  const goback = () => {
    navigation.goBack();
  };

  return (
    <ImageBackground source={themeMode === 'dark'? assets.BackgroundDark : assets.Background} style={{flex:1,paddingHorizontal: 5,}} resizeMode="cover">

    <SafeAreaView style={[styles.container]}>
      <HeaderComponent onClick={goback} onPress={function (): void {
          throw new Error("Function not implemented.");
        } } />
      
      <Animated.View
        style={[
          styles.contentWrapper,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        <View style={styles.titleContainer}>
          <Text style={[styles.shopByText, { color: theme.text }]}>
            Shop by
          </Text>
          <Text style={[styles.categoryTitle, { color: theme.text }]}>
            {name}
          </Text>
          <View style={[styles.titleUnderline, { backgroundColor: theme.text }]} />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: theme.text }]}>
              Loading categories...
            </Text>
          </View>
        ) : (
          <FlatList
            data={Category}
            renderItem={renderItem}
            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
            numColumns={2}
            contentContainerStyle={styles.flatListContainer}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}
      </Animated.View>
    </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor:"red"
    // paddingHorizontal: 5,
    // paddingVertical:50
  },
  contentWrapper: {
    flex: 1,
  },
  titleContainer: {
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  shopByText: {
    fontFamily: Typography.font.regular,
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 5,
  },
  categoryTitle: {
    fontFamily: Typography.font.heavy,
    fontSize: 28,
    textAlign: "center",
    marginBottom: 10,
  },
  titleUnderline: {
    width: 60,
    height: 3,
    borderRadius: 2,
    opacity: 0.8,
  },
  flatListContainer: {
    // paddingHorizontal: 10,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  separator: {
    height: 15,
  },
  itemContainer: {
    width: (width - 40) / 2,
    marginHorizontal: 5,
    borderRadius: 20,
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginBottom: 15,
  },
  pressableContainer: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  subContainer: {
    height: 120,
    width: "100%",
    borderRadius: 20,
    overflow: "hidden",
  },
  backgroundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    borderRadius: 20,
    resizeMode: 'cover',
  },
  halfOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryName: {
    color: Typography.Colors.white,
    fontFamily: Typography.font.bold,
    fontSize: 14,
    flex: 1,
    marginRight: 10,
  },
  arrowIcon: {
    opacity: 0.9,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: Typography.font.regular,
    fontSize: 16,
    opacity: 0.7,
  },
});

export default Category;