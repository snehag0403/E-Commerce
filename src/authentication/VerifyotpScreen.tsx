import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import { Typography } from "../theme/Colors";
import { useNavigation } from "@react-navigation/native";
import { verifyOtpService } from "../services/api/apiServices";
import CustomTextInput from "../components/textInput/CustomTextInput";
import CustomButton from "../components/button/CustomButton";

export default function VerifyotpScreen({ route }) {
  const { email } = route.params;
  // const [email, setemail] = useState("");
  const [otp, setotp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const Navigation = useNavigation();

  const SendverificationOTP = async () => {
    if (!otp.trim()) {
      Alert.alert("Error", "Please enter OTP.");
      return;
    }

    setIsLoading(true);
    try {
      await verifyOtpService({ email, OTP: otp });
      Alert.alert("Success", "OTP verified successfully!");
      Navigation.navigate("Passwordchange", { email });
    } catch (error: any) {
      console.error("OTP Verification Error:", error);

      if (error.response?.status === 404) {
        Alert.alert("Invalid OTP", "The OTP you entered is incorrect.");
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

  return (
    <View style={styles.container}>
      <View style={styles.welcomeandsignup}>
        <Text style={styles.welcomeText}>Enter Verification Code</Text>
        <Text style={styles.subText}>
          We will send you a message to set or reset your new
        </Text>
        <Text style={styles.subsubtext}>password</Text>
      </View>

      <CustomTextInput
        value={otp}
        onChangeText={setotp}
        placeholder="Enter OTP here"
        keyboardType="number-pad"
        maxLength={6910}
      />

      <CustomButton
        title={isLoading ? "Verifying..." : "Confirm"}
        onPress={SendverificationOTP}
        buttonStyle={styles.buttonstyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 200,
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: Typography.Colors.white,
  },
  welcomeText: {
    fontSize: 18,
    fontFamily: Typography.font.heavy,
    color: Typography.Colors.primary,
    marginTop: 10,
    marginBottom: 5,
  },
  subText: {
    fontFamily: Typography.font.regular,
    fontSize: 15,
    color: Typography.Colors.lightgrey,
  },
  subsubtext: {
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
