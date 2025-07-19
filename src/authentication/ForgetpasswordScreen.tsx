import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import { Typography } from "../theme/Colors";
import { assets } from "../../assets/images";
import { useNavigation } from "@react-navigation/native";
import { forgotPasswordService } from "../services/api/apiServices";
import CustomButton from "../components/button/CustomButton";
import CustomTextInput from "../components/textInput/CustomTextInput";

export default function ForgetpasswordScreen() {
  const [validationError, setValidationError] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const Navigation = useNavigation();

  const SendverificationEmail = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError("Please enter a valid email address");
      return;
    }

    setValidationError("");
    setIsLoading(true);
    try {
      await forgotPasswordService({ email });
      Alert.alert("Success", "Verification email sent successfully!");
      Navigation.navigate("Verifyotp", { email });
    } catch (error: any) {
      console.error("Forgot Password Error:", error);

      if (error.response?.status === 404) {
        Alert.alert(
          "Email Not Registered",
          "Please sign up to create an account."
        );
      } else {
        Alert.alert(
          "Error",
          error.message ||
            "Failed to send verification email. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.containerlogo}>
          <View style={styles.diamond}>
            <Image source={assets.logofirst} style={styles.diamond} />
          </View>
        </View>
      </View>

      <View style={styles.welcomeandsignup}>
        <Text style={styles.welcomeText}>Forgot Password</Text>
        <Text style={styles.subText}>
          We will send you a message to set or reset your new{" "}
        </Text>
        <Text style={styles.subsubText}>password</Text>
      </View>
      <CustomTextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your Email"
        keyboardType="email-address"
        iconname="mail"
        iconsize={25}
        iconcolor={Typography.Colors.lightgrey}
        error={validationError}
        setError={setValidationError}
        onValidate={(val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)}
      />

      <CustomButton
        title={isLoading ? "Sending..." : "Send Verification"}
        onPress={SendverificationEmail}
        buttonStyle={styles.buttonstyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: Typography.Colors.white,
  },
  errorText: {
    color: Typography.Colors.red,
    fontFamily: Typography.font.regular,
    fontSize: 13,
    marginTop: 5,
    marginBottom: 10,
  },

  welcomeText: {
    fontSize: 18,
    fontFamily: Typography.font.heavy,
    color: Typography.Colors.primary,
    marginTop: 20,
    marginBottom: 5,
  },
  subText: {
    fontFamily: Typography.font.regular,
    fontSize: 15,
    color: Typography.Colors.lightgrey,
  },
  subsubText: {
    fontFamily: Typography.font.regular,
    fontSize: 15,
    color: Typography.Colors.lightgrey,
    marginBottom: 30,
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
    transform: [{ rotate: "45deg" }],
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 42,
  },
  welcomeandsignup: {
    alignItems: "center",
    marginTop: 15,
    paddingBottom: 48,
  },
  buttonstyle: {
    height: 52,
  },
});
