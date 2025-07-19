import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SearchScreen from "../screens/Search/SearchScreen";
import ProductsPage from "../screens/Home/ProductsPage";
import ProductDetailPage from "../screens/Home/ProductDetailPage";

const Stack = createNativeStackNavigator();

const SearchNavigator = () => {
  return (
    <Stack.Navigator
      // @ts-ignore: Suppress TypeScript error for 'id'
      id="SearchNavigator"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="ProductsPage" component={ProductsPage} />
      <Stack.Screen name="ProductDetailPage" component={ProductDetailPage} />
    </Stack.Navigator>
  );
};

export default SearchNavigator;
