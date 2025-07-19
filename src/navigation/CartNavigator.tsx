import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CartScreen from "../screens/Cart/CartScreen";
import OrderScreen from "../screens/Cart/OrderScreen";
import PromoCodeScreen from "../screens/Profile/OffersScreen";
import DeliveryAddress from "../screens/Profile/DeliverAddressScreen";
import AddAddressList from "../screens/Profile/AddAddressListScreen";
const Stack = createNativeStackNavigator();

const CartNavigator = () => {
  return (
    <Stack.Navigator
      // @ts-ignore: Suppress TypeScript error for 'id'
      id="CartNavigator"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="CartScreen" component={CartScreen} />
      <Stack.Screen name="OrderScreen" component={OrderScreen} />
      <Stack.Screen name="PromoCodeScreen" component={PromoCodeScreen} />
      <Stack.Screen name="DeliveryAddress" component={DeliveryAddress} />
      <Stack.Screen name="AddAddressList" component={AddAddressList} />
    </Stack.Navigator>
  );
};

export default CartNavigator;
