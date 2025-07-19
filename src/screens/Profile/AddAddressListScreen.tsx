import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Pressable,
  Image
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import * as Yup from "yup";
import useAuthStore from "../../stores/useAuthStore";
import { updateUserdata } from "../../services/api/apiServices";
import { Typography } from "../../theme/Colors";
import Iconarrow from "react-native-vector-icons/Feather";
import CustomButton from "../../components/button/CustomButton";
import CustomTextInput from "../../components/textInput/CustomTextInput";
import { assets } from "../../../assets/images";

const AddAddressList = ({ route }) => {
   const themeMode = useAuthStore((state) => state.theme);
  const theme =
    themeMode === "dark"
      ? {
          background: Typography.Colors.black,
          text: Typography.Colors.lightgrey,
        }
      : {
          background: Typography.Colors.white,
          text: Typography.Colors.primary,
        };
  const { address, index } = route.params || {};
  const validationSchema = Yup.object().shape({
    country: Yup.string().required("Country is required"),
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    streetAddress: Yup.string().required("Street Address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State/Province/Region is required"),
    zipCode: Yup.string().required("Zip Code is required"),
    phoneNumber: Yup.string().required("Phone Number is required"),
  });

  const Navigation = useNavigation();
  const handlearrowbutton = () => Navigation.goBack();
  const user = useAuthStore((state) => state.user);

  const handleAddAddresspress = async (values: any, index?: number) => {
    try {
      const newAddress = {
        firstName: values.firstName,
        lastName: values.lastName,
        streetAddress: values.streetAddress,
        city: values.city,
        state: values.state,
        zipCode: values.zipCode,
        phoneNumber: values.phoneNumber,
        country: values.country,
        addId: address?.addId,
      };

      let updatedAddresses = user.address ? [...user.address] : [];

      if (typeof index === "number") {
        updatedAddresses[index] = newAddress;
      } else {
        updatedAddresses.push(newAddress);
      }

      const updatedUser = {
        address: updatedAddresses,
      };
      // console.log("first");
      const response = await updateUserdata(user.id, updatedUser);
      useAuthStore
        .getState()
        .setUser({ ...user, ...response, id: response?.id || user.id });
      Alert.alert(
        "Success",
        index !== undefined
          ? "Address updated successfully!"
          : "Address added successfully!",
        [
          {
            text: "OK",
            onPress: () => Navigation.navigate("DeliveryAddress"),
          },
        ],
        { cancelable: false }
      );
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Failed to add address.",
        [{ text: "OK" }],
        { cancelable: false }
      );
    }
  };

  const handleDeleteAddress = () => {
    try {
      const user = useAuthStore.getState().user;
      if (!user || !user.address) {
        throw new Error("No addresses found to delete.");
      }
      let updatedAddresses = [...user.address];
      if (typeof index === "number") {
        updatedAddresses.splice(index, 1);
      }

      const updatedUser = {
        ...user,
        address: updatedAddresses,
      };

      useAuthStore.getState().setUser(updatedUser);

      Alert.alert("Success", "Address deleted successfully!", [
        { text: "OK", onPress: () => Navigation.navigate("DeliveryAddress") },
      ]);
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to delete address.", [
        { text: "OK" },
      ]);
    }
  };

  return (
    <ScrollView>
          <ImageBackground source={themeMode === 'dark'? assets.BackgroundDark : assets.Background} style={{flex:1,}} resizeMode="cover">

      <View style={[styles.container]}>
        <View style={styles.mainContainer}>
          <Pressable onPress={handlearrowbutton}>
            <Image 
              source={themeMode==="dark"?assets.arrowBlack:assets.arrowWhite}
              style={[styles.arrow]}
            />
          </Pressable>
          <Text style={[styles.addressText,{color:theme.text}]}>Add Address</Text>
        </View>

        <Formik
          initialValues={{
            country: address?.country || "",
            firstName: address?.firstName || "",
            lastName: address?.lastName || "",
            streetAddress: address?.streetAddress || "",
            city: address?.city || "",
            state: address?.state || "",
            zipCode: address?.zipCode || "",
            phoneNumber: address?.phoneNumber || "",
          }}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={(values) => handleAddAddresspress(values, index)}
        >
          {({ handleChange, values, errors, handleSubmit, touched }) => {
            // console.log("formik errors:", errors);
            return (
              <>
                <View style={styles.boxstyle}>
                  <View>
                    <Text style={[styles.textstyle,{color:theme.text}]}>Country</Text>
                    {renderField(
                      "Country",
                      "country",
                      values,
                      handleChange,
                      errors,
                      touched
                    )}
                  </View>
                  <View>
                    <Text style={[styles.textstyle,{color:theme.text}]}>First Name</Text>
                    {renderField(
                      "First Name",
                      "firstName",
                      values,
                      handleChange,
                      errors,
                      touched
                    )}
                  </View>
                  <View>
                    <Text style={[styles.textstyle,{color:theme.text}]}>Last Name</Text>
                    {renderField(
                      "Last Name",
                      "lastName",
                      values,
                      handleChange,
                      errors,
                      touched
                    )}
                  </View>
                  <View>
                    <Text style={[styles.textstyle,{color:theme.text}]}>Street Address</Text>
                    {renderField(
                      "Street Address",
                      "streetAddress",
                      values,
                      handleChange,
                      errors,
                      touched
                    )}
                  </View>
                  <View>
                    <Text style={[styles.textstyle,{color:theme.text}]}>City</Text>
                    {renderField(
                      "City",
                      "city",
                      values,
                      handleChange,
                      errors,
                      touched
                    )}
                  </View>
                  <View>
                    <Text style={[styles.textstyle,{color:theme.text}]}>State/Province/Region</Text>

                    {renderField(
                      "State/Province/Region",
                      "state",
                      values,
                      handleChange,
                      errors,
                      touched
                    )}
                  </View>
                  <View>
                    <Text style={[styles.textstyle,{color:theme.text}]}>Zip Code</Text>
                    {renderField(
                      "Zip Code",
                      "zipCode",
                      values,
                      handleChange,
                      errors,
                      touched,
                      "number-pad",
                      6
                    )}
                  </View>
                  <View>
                    <Text style={[styles.textstyle,{color:theme.text}]}>Phone Number</Text>

                    {renderField(
                      "Phone Number",
                      "phoneNumber",
                      values,
                      handleChange,
                      errors,
                      touched,
                      "number-pad",
                      10
                    )}
                  </View>
                </View>

                <View style={styles.buttonviewstyle}>
                  <CustomButton
                    title={"Delete"}
                    onPress={handleDeleteAddress}
                    buttonStyle={styles.buttonstyle}
                    textStyle={styles.buttontextstyle}
                  />
                  <CustomButton
                    title={"Add Address"}
                    onPress={() => {
                      // console.log("first");
                      handleSubmit();
                    }}
                    buttonStyle={styles.buttonstyleaddress}
                    textStyle={styles.buttontextstyleaddress}
                  />
                </View>
              </>
            );
          }}
        </Formik>
      </View>
      </ImageBackground>
    </ScrollView>
  );
};

const renderField = (
  label: string,
  name: string,
  values: any,
  handleChange: any,
  errors: any,
  touched: any,
  keyboardType: any = "default",
  maxLength?: number
) => (
  <View style={{ marginBottom: 12 }}>
    <CustomTextInput
      value={values[name]}
      onChangeText={handleChange(name)}
      placeholder={label}
      keyboardType={keyboardType}
      containerStyle={styles.borderstyle}
      maxLength={maxLength}
    />
    {touched[name] && errors[name] && (
      <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
        {errors[name]}
      </Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flex: 1,
    // backgroundColor: Typography.Colors.white,
  },
  boxstyle: {
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 20,
  },
  buttontextstyle: {
    color: Typography.Colors.red,
  },
  buttontextstyleaddress: {
    marginTop: 2,
    color: Typography.Colors.white,
  },
  borderstyle: {
    opacity: 0.8,
    borderColor: Typography.Colors.primary,
  },
  arrow: {
    marginTop: 3,
    height:36,
    width:36
  },
  buttonstyle: {
    textAlign: "center",
    height: 57,
    width: 167,
    borderWidth: 1,
    backgroundColor: Typography.Colors.white,
    borderColor: Typography.Colors.red,
  },
  buttonstyleaddress: {
    textAlign: "center",
    height: 57,
    width: 167,
    backgroundColor: Typography.Colors.primary,
  },
  buttonviewstyle: {
    marginHorizontal: 18,
    flexDirection: "row",
    gap: 10,
  },
  mainContainer: {
    marginTop: 10,
    alignSelf: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    gap: 20,
  },
  addressText: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: Typography.font.bold,
  },
  textstyle: {
    color: Typography.Colors.primary,
    fontFamily: Typography.font.bold,
    fontSize: 18,
    fontWeight: "700",
    paddingVertical: 5,
    paddingHorizontal: 2,
  },
});

export default AddAddressList;
