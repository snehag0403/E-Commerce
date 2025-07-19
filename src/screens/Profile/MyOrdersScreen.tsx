import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { orders } from "../../services/api/apiServices";
import { useNavigation } from "@react-navigation/native";
import { Typography } from "../../theme/Colors";
import useAuthStore from "../../stores/useAuthStore";

const MyOrdersScreen = () => {
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
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const Navigation = useNavigation();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orders();
      if (response.status === 200) {
        setOrderData([response.data.orderDetails]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const product = item.items[0];
    return (
      <View style={[styles.card, { backgroundColor: theme.background }]}>
        <Image source={{ uri: product.productImage[0] }} style={styles.image} />
        <View style={styles.details}>
          <View style={styles.rowSpaceBetween}>
            <Text style={[styles.productTitle, { color: theme.text }]}>
              {product.productName}
            </Text>
          </View>
          <Text style={[styles.price, { color: theme.text }]}>
            Rs.{product.price}
          </Text>
          <Text style={styles.date}>
            Order Placed on: {new Date(item.createdAt).toDateString()}
          </Text>
          <Text style={styles.ship}>Ship To: Saurav Gupta</Text>
          <View style={styles.buttonRow}>
            <Text style={styles.orderNumber}>Order #: {item.id.slice(-8)}</Text>
            <TouchableOpacity>
              <Text style={[styles.viewDetails, { color: theme.specialText }]}>
                View Order Details
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={{padding:15}}>
      <Text style={styles.header}>
        <Text style={[styles.boldText, { color: theme.text }]}>My Orders</Text>{" "}
        ({orderData.length} Item
        {orderData.length > 1 ? "s" : ""})
      </Text>
      <FlatList
        data={orderData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: Typography.Colors.white,
    flex: 1,
  },
  header: {
    fontSize: 20,
    marginBottom: 15,
    fontFamily: Typography.font.regular,
    color: Typography.Colors.black,
  },
  boldText: {
    fontFamily: Typography.font.bold,
    color: Typography.Colors.primary,
  },
  card: {
    backgroundColor: Typography.Colors.white,
    shadowColor: Typography.Colors.black,
    borderWidth: 3,
    borderColor: Typography.Colors.white,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    flexDirection: "row",
    padding: 10,
    borderRadius: 8,
    elevation: 2,
    marginBottom: 15,
    gap: 12,
    opacity: 0.9,
  },
  image: {
    width: 100,
    height: 120,
    borderRadius: 6,
  },
  details: {
    flex: 1,
    justifyContent: "space-between",
  },
  rowSpaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  productTitle: {
    fontSize: 16,
    flex: 1,
    flexWrap: "wrap",
    fontFamily: Typography.font.bold,
    color: Typography.Colors.black,
  },
  brand: {
    fontSize: 14,
    marginVertical: 2,
    fontFamily: Typography.font.regular,
    color: Typography.Colors.darkgrey,
  },
  price: {
    fontSize: 16,
    fontFamily: Typography.font.bold,
    marginVertical: 2,
    color: Typography.Colors.black,
  },
  date: {
    fontSize: 13,
    fontFamily: Typography.font.regular,
    color: Typography.Colors.lightgrey,
  },
  ship: {
    fontSize: 13,
    fontFamily: Typography.font.regular,
    color: Typography.Colors.lightgrey,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 8,
    alignItems: "center",
    gap: 10,
  },
  button: {
    backgroundColor: Typography.Colors.white,
    borderWidth: 1,
    borderColor: Typography.Colors.black,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  buttonText: {
    fontSize: 13,
    fontFamily: Typography.font.medium,
    color: Typography.Colors.black,
  },
  cancelText: {
    fontSize: 13,
    fontFamily: Typography.font.regular,
    color: Typography.Colors.red,
  },
  orderNumber: {
    fontSize: 12,
    fontFamily: Typography.font.regular,
    textAlign: "right",
    color: Typography.Colors.greydark,
  },
  viewDetails: {
    fontSize: 12,
    fontFamily: Typography.font.medium,
    color: Typography.Colors.primary,
    textAlign: "right",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MyOrdersScreen;
