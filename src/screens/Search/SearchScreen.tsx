import {
  View,
  Text,
  StyleSheet,
  Image,
  SectionList,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
  ImageBackground,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Typography } from "../../theme/Colors";
import { BannerProps } from "../../models/HomePage.type";
import CustomTextInput from "../../components/textInput/CustomTextInput";
import {
  Categories,
  searchProducts,
  SubCategories,
} from "../../services/api/apiServices";
import { TouchableWithoutFeedback } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { assets } from "../../../assets/images";
import TopHeaderComponent from "../../components/header/TopHeaderComponent";
import useAuthStore from "../../stores/useAuthStore";
import SearchScreenSkeleton from "../../components/skeleton/SearchScreenSkeleton";


const { width } = Dimensions.get("window");
const numColumns = 4;
const itemWidth = (width - 60) / numColumns;

const SearchScreen = () => {
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
  const [Category, setCategory] = useState<any[]>([]);
  const inputRef = useRef(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sections, setSections] = useState<
    { title: string; data: BannerProps[][] }[]
  >([]);

  const [loading, setLoading] = useState(true);
  const Navigation = useNavigation();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const categoryRes = await Categories();
        const allCategories = categoryRes?.data || [];
        setCategory(allCategories);

        const results = await Promise.all(
          allCategories.map((cat) => SubCategories(cat.name))
        );

        const formatted = results.map((res, index) => {
          const categoryData = res?.data || [];
          return {
            title: allCategories[index].name,
            data: formatData(categoryData, numColumns),
          };
        });

        setSections(formatted);
      } catch (error) {
        console.log("Error loading categories", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTouchButton = (
    categoryName: string,
    subCategory: BannerProps
  ) => {
    Navigation.navigate("ProductsPage", {
      category: subCategory,
      categoryName: categoryName,
    });
  };

  const formatData = (data: BannerProps[], numColumns: number) => {
    const rows = [];
    const fullRows = Math.floor(data.length / numColumns);
    for (let i = 0; i < fullRows * numColumns; i += numColumns) {
      rows.push(data.slice(i, i + numColumns));
    }
    const remaining = data.length % numColumns;
    if (remaining > 0) {
      const lastRow = data.slice(-remaining);
      while (lastRow.length < numColumns) {
        lastRow.push({ id: `blank-${lastRow.length}`, empty: true } as any);
      }
      rows.push(lastRow);
    }
    return rows;
  };

  const renderItem = ({
    item,
    section,
  }: {
    item: BannerProps[];
    section: { title: string; data: BannerProps[][] };
  }) => (
    <View style={styles.row}>
      {item.map((subItem, index) => {
        if (subItem.empty) {
          return (
            <View
              key={`empty-${index}`}
              style={[styles.itemContainer, { backgroundColor: "transparent" }]}
            />
          );
        }

        return (
          <TouchableOpacity
            key={subItem.id || `item-${index}`}
            onPress={() => handleTouchButton(section.title, subItem)}
          >
            <View style={styles.itemContainer}>
              <Image
                source={{ uri: subItem.image }}
                style={styles.Images}
                resizeMode="cover"
              />
              <Text
                numberOfLines={1}
                style={[styles.typeofCategory, { color: theme.text }]}
              >
                {subItem.name}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderHeader = () => (
    <>
      <Text style={styles.heading}></Text>
      <CustomTextInput
        value={search}
        onChangeText={(text) => {
          setSearch(text);
          if (inputRef.current) {
            inputRef.current.focus();
          }
          if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
          }
          debounceTimeoutRef.current = setTimeout(async () => {
            if (text.trim().length > 0) {
              setIsSearching(true);
              try {
                const res = await searchProducts(text);
                setSearchResults(res?.data || []);
              } catch (err) {
                console.error("Search error", err);
                setSearchResults([]);
              }
            } else {
              setIsSearching(false);
              setSearchResults([]);
            }
          }, 2000);
        }}
        placeholder="Search..."
        keyboardType="default"
        iconname="search"
        iconsize={25}
        iconcolor={Typography.Colors.black}
        containerStyle={styles.searchstyle}
        ref={inputRef}
      />
    </>
  );
  
  const renderSearchResults = () => (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      
      <View style={styles.viewaccount}>
        <TouchableOpacity
          onPress={() => {
            setIsSearching(false);
            setSearch("");
            setSearchResults([]);
          }}
        >
          <Image source={assets.left} style={styles.arrowstyle} />
        </TouchableOpacity>
        <Text style={styles.textstyle}>Search Results</Text>
      </View>

      {searchResults.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() =>
            Navigation.navigate("ProductsPage", {
              category: item,
              categoryName: "Men",
            })
          }
          style={{ marginBottom: 25 }}
        >
          <Image
            source={{ uri: item.image }}
            style={{ height: 180, width: "100%", borderRadius: 10 }}
            resizeMode="cover"
          />
          <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 8 }}>
            {item.name}
          </Text>
          <Text numberOfLines={3} style={{ color: "gray" }}>
            {item.description}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <ImageBackground source={themeMode === 'dark'? assets.BackgroundDark : assets.Background} style={{flex:1,}} resizeMode="cover">

    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 ,paddingHorizontal:20}}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        
        <SafeAreaView style={[styles.container]}>
          {loading ? (
            // Replace ActivityIndicator with SearchScreenSkeleton
            <SearchScreenSkeleton
             themeMode={themeMode} />
          ) : isSearching ? (
            renderSearchResults()
          ) : (
            <ImageBackground source={themeMode === 'dark'? assets.BackgroundDark : assets.Background} style={{flex:1,}} resizeMode="cover">

              <View
                style={[
                  styles.HeaderStyle,
                  // { backgroundColor: theme.background },
                ]}
              >
                <TopHeaderComponent />
              </View>
              <View style={{ flex: 1 }}>
                <View>{renderHeader()}</View>
                <SectionList
                  sections={sections}
                  keyExtractor={(_, index) => index.toString()}
                  renderSectionHeader={({ section: { title } }) => (
                    <Text style={[styles.title, { color: theme.text }]}>
                      {title} Fashion
                    </Text>
                  )}
                  renderItem={renderItem}
                  stickySectionHeadersEnabled={false}
                  keyboardShouldPersistTaps="handled"
                  keyboardDismissMode="interactive"
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.sectionListContent}
                />
              </View>
            </ImageBackground>
          )}
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
  },
  HeaderStyle: {
    // backgroundColor: Typography.Colors.white,
  },
  container: {
    flex: 1,
    // backgroundColor: Typography.Colors.white,
    paddingHorizontal: 20,
  },
  sectionListContent: {
    paddingBottom: 100,
    flexGrow: 1,
  },
  heading: {
    color: Typography.Colors.primary,
    fontFamily: Typography.font.bold,
    fontWeight: "800",
    fontSize: 24,
    paddingHorizontal: 10,
  },
  title: {
    color: Typography.Colors.primary,
    fontFamily: Typography.font.bold,
    fontSize: 16,
    paddingVertical: 15,
  },
  textstyle: {
    fontSize: 24,
    alignSelf: "center",
    marginBottom: 5,
    fontWeight: "800",
    fontFamily: Typography.font.bold,
    color: Typography.Colors.primary,
  },
  arrowstyle: {
    paddingVertical: 2,
    height: 35,
    width: 35,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  viewaccount: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 20,
    marginBottom: 20,
  },
  itemContainer: {
    width: itemWidth,
    alignItems: "center",
    paddingVertical: 10,
  },
  Images: {
    height: 70,
    width: 70,
    borderRadius: 35,
  },
  typeofCategory: {
    color: Typography.Colors.lightblack,
    fontFamily: Typography.font.medium,
    fontSize: 14,
    paddingTop: 7,
    textAlign: "center",
    maxWidth: itemWidth - 10,
  },
  searchstyle: {
    backgroundColor: Typography.Colors.grayy,
    borderRadius: 15,
    height: 55.5,
    width: width - 60,
  },
});