import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../authentication/LoginScreen";
import SignupScreen from "../authentication/SignupScreen";
import ForgetpasswordScreen from "../authentication/ForgetpasswordScreen";
import VerifyotpScreen from "../authentication/VerifyotpScreen";
import PasswordchangeScreen from "../authentication/PasswordchangeScreen";

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      // @ts-ignore: Suppress TypeScript error for 'id'
      id="AuthNavigator"
      screenOptions={{ headerShown: false }}
      initialRouteName="LoginScreen"
    >
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Forgetpassword" component={ForgetpasswordScreen} />
      <Stack.Screen name="Verifyotp" component={VerifyotpScreen} />
      <Stack.Screen name="Passwordchange" component={PasswordchangeScreen} />
    </Stack.Navigator>
  );
}
