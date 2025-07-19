import React from "react";
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import { Typography } from "../theme/Colors";
import { assets } from "../../assets/images";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import {
  PasswordChangeService,
} from "../services/api/apiServices";
import CustomTextInput from "../components/textInput/CustomTextInput";
import CustomButton from "../components/button/CustomButton";
import { Formik } from "formik";
import * as Yup from "yup";

export default function PasswordchangeScreen({ route }) {
  const { email } = route.params;
  const Navigation = useNavigation();

  const passwordSchema = Yup.object().shape({
    newPassword: Yup.string()
      .min(7, "Password must be at more than 8 characters")
      .required("Password is required"),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords do not match")
      .required("Confirm Password is required"),
  });

  const handleChangePassword = async (values, { setSubmitting, resetForm }) => {
    try {
      await PasswordChangeService({
        email,
        password: values.newPassword,
        confirmPassword: values.confirmNewPassword,
      });

      Alert.alert("Success", "Password changed successfully!");
      resetForm();
      Navigation.navigate("LoginScreen");
    } catch (error) {
      console.error(
        "Password Change Error:",
        error.response?.data || error.message
      );
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to change password.";
      Alert.alert("Error", message);
    } finally {
      setSubmitting(false);
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
        <Text style={styles.welcomeText}>New Password</Text>
        <Text style={styles.subText}>Set new password for your account</Text>
      </View>

      <Formik
        initialValues={{ newPassword: "", confirmNewPassword: "" }}
        validationSchema={passwordSchema}
        onSubmit={handleChangePassword}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isSubmitting,
        }) => (
          <>
            <CustomTextInput
              value={values.newPassword}
              onChangeText={handleChange("newPassword")}
              onBlur={handleBlur("newPassword")}
              placeholder="Password"
              secureTextEntry
              iconname="lock"
              iconsize={25}
              iconcolor={Typography.Colors.lightgrey}
              error={touched.newPassword}
            />

            <CustomTextInput
              value={values.confirmNewPassword}
              onChangeText={handleChange("confirmNewPassword")}
              onBlur={handleBlur("confirmNewPassword")}
              placeholder="Confirm Password"
              secureTextEntry
              iconname="lock"
              iconsize={25}
              iconcolor={Typography.Colors.lightgrey}
              error={touched.confirmNewPassword}
            />

            <CustomButton
              title={isSubmitting ? "Changing..." : "Change Password"}
              onPress={handleSubmit}
              buttonStyle={styles.buttonstyle}
              disabled={isSubmitting}
            />
          </>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: Typography.Colors.white,
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
