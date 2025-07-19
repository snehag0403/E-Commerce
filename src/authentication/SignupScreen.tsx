import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Typography } from "../theme/Colors";
import { assets } from "../../assets/images";
import useAuthStore from "../stores/useAuthStore";
import { useNavigation } from "@react-navigation/native";
import { registerUser } from "./AuthApi";
import CustomButton from "../components/button/CustomButton";
import CustomTextInput from "../components/textInput/CustomTextInput";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { GoogleSign } from "../services/api/apiServices";

export default function SignupScreen() {
  const { setToken, setUser } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const Navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "682390120484-agk45uo1d6pi039acrraldll41jdj11h.apps.googleusercontent.com",
    });
  }, []);

  const signinwithGoogle = async () => {
    setIsGoogleLoading(true); // Start loading
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUserInfo(userInfo);
      if (userInfo?.type === "success") {
        await GoogleAuth(userInfo);
      } else {
        Alert.alert("Google Sign In Failed", "Please try again.");
      }
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Google Sign In Error",
        "Failed to sign in with Google. Please try again."
      );
    } finally {
      setIsGoogleLoading(false); // Stop loading
    }
  };

  const GoogleAuth = async (userInfo: any) => {
    try {
      console.log("userInfo.data.user.name", userInfo.data.user.name);
      console.log("userInfo.data.user.email", userInfo.data.user.email);
      console.log("userInfo.data.user.photo", userInfo.data.user.photo);

      // Call the Google Sign API
      const response = await GoogleSign(
        userInfo?.data?.user?.name,
        userInfo?.data?.user?.email,
        userInfo?.data?.user?.photo
      );
      console.log(response.data.access_token, "response from google sign in");

      // Handle the response similar to regular login
      if (response && response.data && response.data.access_token) {
        // Update auth store
        useAuthStore.setState({ isLoggedIn: true });
        setUser(
          response.data.userDetails || {
            name: userInfo.data.user.name,
            email: userInfo.data.user.email,
            photo: userInfo.data.user.photo,
          }
        );
        setToken(response.data.access_token);

        // Navigate to Home/BottomTabs
        Navigation.reset({
          index: 0,
          routes: [{ name: "BottomTabs" }],
        });
      } else {
        Alert.alert(
          "Google Sign In Failed",
          "Authentication failed. Please try again."
        );
      }
    } catch (error) {
      console.log("Error in Google authentication:", error);
      Alert.alert(
        "Authentication Error",
        error.message || "Google sign-in failed. Please try again."
      );
    }
  };
  const validateInputs = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Name is required.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return false;
    }
    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long.");
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleSignupPress = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    try {
      const response = await registerUser({ name, email, password });
      setUser(response.data.userDetails);
      Navigation.navigate("LoginScreen");
    } catch (error: any) {
      if (error.response?.status === 404) {
        Alert.alert(
          "Invalid Email ID or Password",
          "The Email ID or Password you entered is incorrect."
        );
      } else {
        Alert.alert(
          "Error",
          error.message || "Failed to verify OTP. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogInPress = () => {
    Navigation.goBack();
  };

  const handleSocialLoginPress = () => {
    console.log("Social login pressed");
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Loading Overlay for Google Sign In */}
      {isGoogleLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Typography.Colors.primary} />
            <Text style={styles.loadingText}>Signing in with Google...</Text>
          </View>
        </View>
      )}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <View style={styles.logoContainer}>
          <View style={styles.containerlogo}>
            <Image source={assets.logofirst} style={styles.diamond} />
          </View>
        </View>

        <View style={styles.welcomeandsignup}>
          <Text style={styles.welcomeText}>Welcome to E-Com!</Text>
          <Text style={styles.subText}>Let's make your account.</Text>
        </View>

        <CustomTextInput
          value={name}
          onChangeText={setName}
          placeholder="Name"
          keyboardType="default"
          iconname="person"
          iconsize={25}
          iconcolor={Typography.Colors.lightgrey}
        />

        <CustomTextInput
          value={email}
          onChangeText={setemail}
          placeholder="Enter Your Email"
          keyboardType="email-address"
          iconname="mail"
          iconsize={25}
          iconcolor={Typography.Colors.lightgrey}
        />

        <CustomTextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          iconname="lock"
          iconsize={25}
          iconcolor={Typography.Colors.lightgrey}
        />

        <CustomTextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm Password"
          secureTextEntry
          iconname="lock"
          iconsize={25}
          iconcolor={Typography.Colors.lightgrey}
        />

        <CustomButton
          title={isLoading ? "Signing up..." : "SignUp"}
          onPress={handleSignupPress}
          buttonStyle={styles.buttonstyle}
          disabled={isLoading}
        />

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.line} />
        </View>

        <Text style={styles.socialText}>Login using</Text>
        <View style={styles.socialButtons}>
          <TouchableOpacity onPress={handleSocialLoginPress}>
            <Image
              source={assets.facebooklogo}
              style={styles.socialIconfacebook}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={signinwithGoogle}>
            <Image
              source={assets.googlelogo}
              style={styles.socialIconfacebook}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Already have an account? </Text>
          <TouchableOpacity onPress={handleLogInPress}>
            <Text style={styles.registerLink}>Log In</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: Typography.Colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  containerlogo: {
    width: 72,
    height: 72,
    backgroundColor: Typography.Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  diamond: {
    width: 32,
    height: 32,
    transform: [{ rotate: "90deg" }],
  },
  welcomeandsignup: {
    alignItems: "center",
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 18,
    fontFamily: Typography.font.heavy,
    color: Typography.Colors.primary,
  },
  subText: {
    fontFamily: Typography.font.regular,
    fontSize: 18,
    color: Typography.Colors.lightgrey,
  },
  buttonstyle: {
    height: 52,
    marginTop: 10,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Typography.Colors.lightgrey,
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 15,
    fontWeight: "bold",
    color: Typography.Colors.darkgrey,
  },
  socialText: {
    textAlign: "center",
    fontFamily: Typography.font.regular,
    fontSize: 16,
    color: Typography.Colors.black,
    marginBottom: 16,
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  socialIconfacebook: {
    width: 35,
    height: 35,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: {
    fontSize: 14,
    color: Typography.Colors.lightgrey,
  },
  registerLink: {
    fontSize: 14,
    color: Typography.Colors.primary,
    fontWeight: "bold",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingContainer: {
    backgroundColor: Typography.Colors.white,
    padding: 30,
    borderRadius: 15,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: Typography.Colors.navyblue,
    fontFamily: Typography.font.regular,
  },
});
