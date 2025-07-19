import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WishlistScreen from '../screens/Wishlist/WishlistScreen';
import CartScreen from '../screens/Cart/CartScreen';


const Stack = createNativeStackNavigator();


const WishlistNavigator = () => {
  return (
    <Stack.Navigator
    // @ts-ignore: Suppress TypeScript error for 'id'
    id="WishlistNavigator"
    screenOptions={{ headerShown: false }}>
    <Stack.Screen name="WishlistScreen" component={WishlistScreen} />
    <Stack.Screen name="CartScreen" component={CartScreen} />
  </Stack.Navigator>
  )
}

export default WishlistNavigator