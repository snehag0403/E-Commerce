import { View, Text, StyleSheet, Pressable, ScrollView, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import RangeSlider from "../../components/slider/RangeSlider";
import { Typography } from "../../theme/Colors";
import Icon from "react-native-vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import SizeComponent from "../../components/product/SizeComponent";
import { Color, ProductFilters } from "../../services/api/apiServices";
import useAuthStore from "../../stores/useAuthStore";

const FilterScreen = ({ route }) => {
  const {
    category,
    categoryName,
    subCategoryId,
    categoryId,
    setFilterApplied,
    setFilterData,
  } = route.params;

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

  const navigation = useNavigation();
  const [applyfilter, setApplyFilter] = useState();
  const globalFilter = {
    amountMin: 0,
    amountMax: 100000,
    discountMin: 0,
    discountMax: 100,
  };
  const [filters, setFilters] = useState({
    amount: [
      globalFilter?.amountMin || 0,
      globalFilter?.amountMax || 100000,
    ] as [number, number],
    discount: [
      globalFilter?.discountMin || 0,
      globalFilter?.discountMax || 100,
    ] as [number, number],
    // Added selection states
    selectedCategory: null,
    selectedSize: null,
    selectedColor: null,
  });

  // Selection handlers
  const handleCategorySelect = (category) => {
    setFilters((prev) => ({
      ...prev,
      selectedCategory: prev.selectedCategory === category ? null : category,
    }));
  };

  const handleSizeSelect = (size) => {
    setFilters((prev) => ({
      ...prev,
      selectedSize: prev.selectedSize === size ? null : size,
    }));
  };

  const handleColorSelect = (colorId) => {
    setFilters((prev) => ({
      ...prev,
      selectedColor: prev.selectedColor === colorId ? null : colorId,
    }));
  };

  // Category options
  const categories = [
    "Men",
    "Women",
    "Kids",
    "Western Wear",
    "Traditional Wear",
  ];

  // Size options
  const sizes = ["S", "M", "L", "XL", "XXL"];

  // Color options
  const getColorHex = (colorName) => {
    const colorMap = {
      Black: "#000000",
      White: "#FFFFFF",
      Yellow: "#F2C94C",
      Red: "#E90000",
      Green: "#19B600",
    };
    return colorMap[colorName] || "#CCCCCC"; // Default gray if color not found
  };
  const [colorId, setColorId] = useState();

  useEffect(() => {
    Color()
      .then((item: any) => {
        setColorId(item.data);
      })
      .catch((e) => {
        console.log("no data");
      });
  }, []);

  const handleApplyFilter = () => {
    ProductFilters(
      filters.discount[1],
      filters.discount[0],
      filters.amount[1],
      filters.amount[0],
      filters.selectedColor,
      subCategoryId,
      categoryId
    )
      .then((data) => {
        console.log(data?.data, "=-=-=-=-=-=--");
        setFilterApplied(true);
        setFilterData(data?.data);
        navigation.goBack();
      })
      .catch((e) => {
        console.log("Filter API error:", e.message);
      });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.heading}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icon name="cross" size={24} style={styles.icon} />
        </Pressable>
        <Text style={[styles.headingText, { color: theme.specialText }]}>
          Filter Search
        </Text>
      </View>

      <View style={[styles.line, { borderBottomColor: theme.background }]} />

      <View style={styles.subContainer}>
        <Text style={[styles.priceTitle, { color: theme.specialText }]}>
          Size
        </Text>
        <View
          style={[styles.sizeContainer, { backgroundColor: theme.background }]}
        >
          {sizes.map((size, index) => (
            <Pressable
              key={index}
              style={[
                styles.sizeCircle,
                filters.selectedSize === size && styles.selectedSizeCircle,
              ]}
              onPress={() => handleSizeSelect(size)}
            >
              <Text
                style={[
                  styles.sizeText,
                  { color: theme.text },
                  filters.selectedSize === size && styles.selectedSizeText,
                ]}
              >
                {size}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={[styles.line, { borderBottomColor: theme.background }]} />

      <View style={styles.subContainer}>
        <Text style={[styles.priceTitle, { color: theme.specialText }]}>
          Color
        </Text>
        <View style={styles.colorContainer}>
          {colorId?.map((color) => (
            <Pressable
              key={color.id}
              style={[
                styles.colorCircle,
                filters.selectedColor === color.id &&
                  styles.selectedColorCircle,
              ]}
              onPress={() => handleColorSelect(color.id)}
            >
              <View
                style={[
                  styles.colorCircle1,
                  { backgroundColor: getColorHex(color.name) },
                ]}
              />
              {filters.selectedColor === color.id && (
                <View style={styles.colorCheckmark}>
                  <Icon
                    name="check"
                    size={16}
                    color={color.name === "#FFFFFF" ? "#000" : "#FFF"}
                  />
                </View>
              )}
            </Pressable>
          ))}
        </View>
      </View>

      <View style={[styles.line, { borderBottomColor: theme.background }]} />

      <View style={styles.subContainer}>
        <Text style={[styles.priceTitle, { color: theme.specialText }]}>
          Price Range
        </Text>
        <View style={styles.minmax}>
          <View style={styles.amountRange}>
            <Text
              numberOfLines={1}
              style={[styles.amountText, { color: theme.text }]}
            >
              Rs. {filters.amount[0]}
            </Text>
          </View>
          <View style={styles.amountRange}>
            <Text
              numberOfLines={1}
              style={[styles.amountText, { color: theme.text }]}
            >
              Rs. {filters.amount[1]}
            </Text>
          </View>
        </View>
        <RangeSlider
          values={filters.amount}
          setValues={(values) => {
            setFilters((prev) => ({
              ...prev,
              amount: values,
            }));
          }}
          minLimit={0}
          maxLimit={100000}
        />
        <View style={styles.minmaxText}>
          <Text style={styles.static}>MIN</Text>
          <Text style={styles.static}>MAX</Text>
        </View>
      </View>

      <View style={[styles.line, { borderBottomColor: theme.background }]} />

      <View style={styles.subContainer}>
        <Text style={[styles.priceTitle, { color: theme.specialText }]}>
          Discount
        </Text>
        <View style={styles.minmax}>
          <View style={styles.amountRange}>
            <Text
              numberOfLines={1}
              style={[styles.amountText, { color: theme.text }]}
            >
              {filters.discount[0]} %
            </Text>
          </View>
          <View style={styles.amountRange}>
            <Text
              numberOfLines={1}
              style={[styles.amountText, { color: theme.text }]}
            >
              {filters.discount[1]} %
            </Text>
          </View>
        </View>
        <RangeSlider
          values={filters.discount}
          setValues={(values) => {
            setFilters((prev) => ({
              ...prev,
              discount: values,
            }));
          }}
          minLimit={0}
          maxLimit={100}
        />
        <View style={styles.minmaxText}>
          <Text style={styles.static}>MIN</Text>
          <Text style={styles.static}>MAX</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.applyButton} onPress={handleApplyFilter}>
          <Text style={styles.buttonText}>Apply Filters</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Typography.Colors.white,
  },
  subContainer: {
    paddingHorizontal: 20,
  },
  heading: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 16,
    alignItems: "center",
  },
  icon: {
    color: Typography.Colors.greydark,
  },
  headingText: {
    color: Typography.Colors.navyblue,
    fontSize: 20,
    fontWeight: "800",
    fontFamily: Typography.font.heavy,
  },
  line: {
    height: 1,
    borderBottomWidth: 1,
    borderBottomColor: Typography.Colors.lightpurple,
    marginVertical: 10,
  },
  priceTitle: {
    paddingVertical: 10,
    fontFamily: Typography.font.bold,
    fontWeight: "700",
    fontSize: 16,
    color: Typography.Colors.navyblue,
  },
  // Category styles
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 10,
  },
  categoryItem: {
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 5,
    borderColor: Typography.Colors.lightgrey,
    minWidth: "45%",
  },
  selectedCategory: {
    borderColor: Typography.Colors.navyblue,
    backgroundColor: "#F0F5FF",
  },
  categoryText: {
    color: Typography.Colors.lightblack,
    fontSize: 14,
    fontFamily: Typography.font.regular,
    textAlign: "center",
  },
  selectedCategoryText: {
    color: Typography.Colors.navyblue,
    fontFamily: Typography.font.bold,
  },
  // Size styles
  sizeContainer: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 10,
  },
  sizeCircle: {
    height: 42,
    width: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    borderColor: Typography.Colors.lightgrey,
  },
  selectedSizeCircle: {
    borderColor: Typography.Colors.navyblue,
    backgroundColor: Typography.Colors.navyblue,
  },
  sizeText: {
    fontFamily: Typography.font.regular,
    fontSize: 14,
    color: Typography.Colors.lightblack,
  },
  selectedSizeText: {
    color: Typography.Colors.white,
    fontFamily: Typography.font.bold,
  },
  // Color styles
  colorContainer: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 10,
  },
  colorCircle: {
    height: 42,
    width: 42,
    borderRadius: 21,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#C1C1C1",
    position: "relative",
  },
  selectedColorCircle: {
    borderColor: Typography.Colors.navyblue,
  },
  colorCircle1: {
    height: 28,
    width: 28,
    borderRadius: 14,
    elevation: 3,
  },
  colorCheckmark: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  // Price range styles
  minmax: {
    flexDirection: "row",
    gap: 13,
    marginBottom: 10,
  },
  amountRange: {
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 5,
    borderColor: Typography.Colors.lightgrey,
  },
  minmaxText: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    paddingBottom: 5,
  },
  amountText: {
    color: Typography.Colors.lightblack,
    fontSize: 12,
    fontFamily: Typography.font.regular,
  },
  static: {
    fontFamily: Typography.font.bold,
    fontWeight: "700",
    color: Typography.Colors.lightgrey,
    fontSize: 16,
  },
  // Button styles
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  applyButton: {
    backgroundColor: Typography.Colors.navyblue,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: Typography.Colors.white,
    fontSize: 16,
    fontFamily: Typography.font.bold,
    fontWeight: "700",
  },
});

export default FilterScreen;
