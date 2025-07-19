import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Pressable,
  Image,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import useAuthStore from "../../stores/useAuthStore";
import Icon from "react-native-vector-icons/AntDesign";
import { Typography } from "../../theme/Colors";
import CustomButton from "../../components/button/CustomButton";
import { updateUserdata } from "../../services/api/apiServices";
import { useState } from "react";
import TopHeaderComponent from "../../components/header/TopHeaderComponent";
import { assets } from "../../../assets/images";
import { useAppTheme } from "../../theme/useAppTheme";
import { SafeAreaView } from "react-native";

const DeliveryAddress = () => {
  const themeMode = useAuthStore((state) => state.theme);
  const isDarkMode = themeMode === "dark";

  // Example of conditionally setting special text color
  const specialTextColor = isDarkMode
    ? Typography.Colors.blue
    : Typography.Colors.primary;
    const theme = useAppTheme();
    // console.log(theme,'Theme')
  // const theme = {
  //   background: isDarkMode ? Typography.Colors.black : Typography.Colors.white,
  //   text: isDarkMode ? Typography.Colors.white : Typography.Colors.black,
  //   specialText: specialTextColor,
  // };
  const user = useAuthStore((state) => state.user);
  const Navigation = useNavigation();
  const [selectedIndex, setSelectedIndex] = useState(null);

  const onAddAddress = () => {
    Navigation.navigate("AddAddressList");
  };

  const onEditAddress = (address: any, index: number) => {
    Navigation.navigate("AddAddressList", { address: address, index: index });
  };

  const handlearrowbutton = () => {
    Navigation.goBack();
  };

  const handleaddAddress = () => {
    Navigation.navigate("AddAddressList");
  };


  const onDeleteAddress = async (index: number) => {
    const updatedAddresses = [...user.address];
    updatedAddresses.splice(index, 1);
    const updatedUser = {
      ...user,
      address: updatedAddresses,
    };
    await updateUserdata(user.id, updatedUser);

    Alert.alert("Success", "Address has been deleted.", [{ text: "OK" }]);
  };

  const AddressNavigate = (item, index) => {
    setSelectedIndex(index);
    Navigation.navigate("OrderScreen", { item: item });
  };
  // console.log(user, "snfi");
  const Listitem = ({ item, index }: { item: any; index: number }) => {
    const isSelected = selectedIndex === index;
    return (
        <TouchableOpacity
      onPress={() => AddressNavigate(item, index)}
      style={[
        styles.addressItem,
       
      ]}
    >
      {/* Top Row */}
      <View style={styles.addressHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          
          {/* 🔘 Radio Button */}
          <View

    style={[styles.radioButton,{borderColor: isSelected ? Typography.Colors.primary : '#888',}]}
          >
            {isSelected && (
              <View
                style={{
                  height: 12,
                  width: 12,
                  borderRadius: 8,
                  backgroundColor: Typography.Colors.primary,
                }}
              />
            )}
          </View>

          {/* 🏠 Icon and Address Info */}
          <Image source={assets.homeIcon} style={{ height: 32, width: 32 }} />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.sendText}>SEND TO:</Text>
            <Text style={[styles.addressText, { color: Typography.Colors.primary,fontSize:14 }]}>
              My Home
            </Text>
          </View>
        </View>

        {/* ✏️ Edit */}
        <TouchableOpacity onPress={() => onEditAddress(item, index)}>
          <Text style={[styles.editText]}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* 📍 Address */}
      <View style={styles.addressData  }>
        <Text style={styles.addressText}> {item.streetAddress}, </Text>
        <Text style={styles.addressText}>
          {item.city}, {item.state}, {item.zipCode}
        </Text>
        <Text style={styles.addressText}> {item.country}</Text>
      </View>

      {/* 📞 Phone */}
      <Text style={[styles.addressText,{paddingLeft:36}]}> Phone: {item.phoneNumber}</Text>
    </TouchableOpacity>
    );
  };

  const Emptylist = () => {
    return (
      <>
        <View style={styles.AddressContainer}>
          <Text style={styles.title}>🚚 No Delivery Address Found</Text>
          <Text style={styles.message}>
            Looks like we don’t have a delivery address for you yet.{"\n"}
            Please add one to make sure your orders arrive at the right place.
          </Text>
          <TouchableOpacity style={styles.button} onPress={onAddAddress}>
            <Icon size={25} color={Typography.Colors.white} name="plus" />
            <Text style={styles.buttonText}>Add Delivery Address</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  return (
    <ImageBackground source={themeMode === 'dark'? assets.BackgroundDark : assets.Background} style={{flex:1,paddingHorizontal:12}} resizeMode="cover">

    <SafeAreaView style={[styles.container]}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => Navigation.goBack()}>
          <Image
            source={themeMode==="dark"?assets.arrowBlack:assets.arrowWhite}
            style={[styles.backIcon]}
          />
        </Pressable>
        <Text
          numberOfLines={1}
          style={[styles.headerTitle, { color: theme.text }]}
        >
          Choose Delivery Address
        </Text>
        <Pressable style={{flex:1,alignItems:"flex-end",paddingRight:10}} onPress={() =>handleaddAddress()}>
          <Image
            source={themeMode==="dark"?assets.plus:assets.blackplus}
            style={[styles.backIcon,{height:28,width:28,tintColor:themeMode==="dark"?Typography.Colors.white:Typography.Colors.primary}]}
          />
        </Pressable>
      </View>
      <FlatList
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 20 }}
        data={user?.address || []}
        renderItem={({ item, index }) => <Listitem item={item} index={index} />}
        ListEmptyComponent={Emptylist}
        // ListFooterComponent={handlebutton}
      />
    </SafeAreaView>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    // backgroundColor: Typography.Colors.white,
  },
  containerm: {
    backgroundColor: Typography.Colors.white,
  },
  arrow: {
    marginTop: 3,
  },
  HeaderStyle: {
    backgroundColor: Typography.Colors.white,
    marginBottom: 10,
    // paddingHorizontal: 20,
  },
  UserContainer: {
    flex: 2,
    flexDirection: "row",
  },
  backIcon: {
    color: Typography.Colors.primary,
    height: 32,
    width: 32,
  },
  productType: {
    fontSize: 18,
    fontFamily: Typography.font.medium,
    color: Typography.Colors.black,
    paddingLeft: 13,
  },
  mainContainer: {
    marginTop: 10,
    alignSelf: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    gap: 20,
  },
  addressText: {
    fontSize: 13,
    fontWeight: "600",
    fontFamily: Typography.font.bold,
    color: Typography.Colors.darkgrey,
  },
  AddressContainer: {
    marginTop: "50%",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 16,
    color: Typography.Colors.black,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: Typography.Colors.greydark,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 22,
  },
  button: {
    flexDirection: "row",
    marginTop: 24,
    backgroundColor: Typography.Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 10,
  },
  buttonText: {
    marginTop: 1,
    textAlign: "center",
    color: Typography.Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  addressItem: {
    marginBottom: 20,
    padding: 18,

    // borderWidth: 2,
    // borderColor: Typography.Colors.primary,
    borderRadius: 18,
    backgroundColor:Typography.Colors.white,
    elevation:2,
    marginHorizontal:10

  },
  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  editText: {
    color: Typography.Colors.red,
    fontSize: 16,
    fontWeight: "600",
    textDecorationLine:'underline',
    
    // paddingRight:15
  },
  buttonstyleaddress: {
    alignSelf: "center",
    textAlign: "center",
    height: 57,
    width: 300,
    marginTop:230,
    borderRadius:30,
    backgroundColor: Typography.Colors.primary,
  },
  buttontextstyleaddress: {
    marginTop: 2,
    color: Typography.Colors.white,
  },
  headerRow: {
    paddingBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 13,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: Typography.font.bold,
    color: Typography.Colors.primary,
  },
  sendText:{
    fontSize: 13,
    fontWeight: "600",
    fontFamily: Typography.font.bold,
    color: Typography.Colors.lightgrey,
  },
  radioButton:{
    height:20,
    width: 20,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  addressData:{
    flexDirection: 'row', 
    flexWrap: 'wrap',
    paddingLeft:38,
    paddingTop:10
  }
});

export default DeliveryAddress;
