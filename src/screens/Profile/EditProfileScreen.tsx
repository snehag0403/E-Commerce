import { Alert, Image, Linking, StyleSheet, Text, View } from "react-native";
import { Typography } from "../../theme/Colors";
import { TouchableOpacity } from "react-native";
import { assets } from "../../../assets/images";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/AntDesign";
import useAuthStore from "../../stores/useAuthStore";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import RNFS from "react-native-fs";
import { profilechange, updateUserdata } from "../../services/api/apiServices";
import { useState } from "react";

const EditProfileScreen = () => {
  const [image, setImage] = useState();
  const Navigation = useNavigation();
  const user = useAuthStore((state) => state.user);
  const themeMode = useAuthStore((state) => state.theme);
  const isDarkMode = themeMode === "dark";

  // Example of conditionally setting special text color
  const specialTextColor = isDarkMode
    ? Typography.Colors.blue
    : Typography.Colors.primary;

  const theme = {
    background: isDarkMode ? Typography.Colors.black : Typography.Colors.white,
    text: isDarkMode ? Typography.Colors.white : Typography.Colors.black,
    specialText: specialTextColor,
  };
  const handlepasswordchange = () => {
    // Navigation.navigate("Passwordchange", { email: user?.email });
    Navigation.navigate("ChangePasswordScreen");
  };

  const handleImageChange = () => {
    Alert.alert("Choose Image", undefined, [
      { text: "Cancel", style: "cancel" },
      { text: "Gallery", onPress: handleGallery },
      { text: "Camera", onPress: handleCamera },
    ]);
  };

  const uploadImage = async (uri: string) => {
    try {
      const formData = new FormData();
      formData.append("files", {
        uri,
        name: "profile.jpg",
        type: "image/jpeg",
      } as any);

      const uploadResponse = await profilechange(formData);
      const imageUrl = uploadResponse?.data?.files?.[0];
      if (!imageUrl) throw new Error("No image URL returned");

      await updateUserdata(user?.id, {
        profilePicture: imageUrl,
      });

      useAuthStore.getState().setUser({
        ...user,
        profilePicture: imageUrl,
      });
    } catch (error: any) {
      console.error(" Upload error:", error.response?.data || error.message);
    }
  };

  const handleCamera = () => {
    launchCamera({ mediaType: "photo" }, (response) => {
      if (response.assets && response.assets[0]) {
        const uri = response.assets[0].uri || "";
        setImage(uri);
        uploadImage(uri);
      }
    });
  };

  const handleGallery = () => {
    launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (response.assets && response.assets[0]) {
        const uri = response.assets[0].uri || "";
        setImage(uri);
        uploadImage(uri);
      }
    });
  };

  const gobacknav = () => {
    Navigation.goBack();
  };
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.viewaccount}>
        <TouchableOpacity onPress={gobacknav}>
          <Image source={assets.left} style={styles.arrowstyle} />
        </TouchableOpacity>
        <Text style={[styles.textstyle, { color: theme.specialText }]}>
          My Account
        </Text>
      </View>
      <View style={styles.firstsection}>
        <TouchableOpacity onPress={handleImageChange}>
          <Image
            source={
              image
                ? { uri: `${image}?t=${Date.now()}` }
                : user?.profilePicture
                ? { uri: `${user.profilePicture}?t=${Date.now()}` }
                : assets.Demo
            }
            style={styles.profilepic}
          />
          {/* <Image
            source={image ? { uri: image } : assets.Demo}
            style={styles.profilepic}
          /> */}
        </TouchableOpacity>
        <View style={styles.textcontainer}>
          <Text style={[styles.textname, { color: theme.text }]}>
            {user?.name}
          </Text>
          <Text style={styles.mailcontainer}>{user?.email}</Text>
        </View>
      </View>
      <View>
        <View style={styles.detailcontainer}>
          <View style={styles.mindetailstyle}>
            <Image
              source={assets.name}
              style={[styles.imgstyle, { tintColor: theme.specialText }]}
            />
            <Text style={[styles.staticstyle, { color: theme.specialText }]}>
              Name
            </Text>
          </View>
          <Text style={styles.dynamicstyle}>{user?.name}</Text>
        </View>

        <View style={styles.detailcontainer}>
          <View style={styles.mindetailstyle}>
            <Image
              source={assets.message}
              style={[styles.imgstyle, { tintColor: theme.specialText }]}
            />
            <Text style={[styles.staticstyle, { color: theme.specialText }]}>
              Email
            </Text>
          </View>
          <Text style={styles.dynamicstyle}>{user?.email}</Text>
        </View>

        <TouchableOpacity onPress={handlepasswordchange}>
          <View style={styles.detailcontainer}>
            <View style={styles.mindetailstyle}>
              <Image
                source={assets.password}
                style={[styles.imgstyle, { tintColor: theme.specialText }]}
              />
              <Text style={[styles.staticstyle, { color: theme.specialText }]}>
                Change Password
              </Text>
            </View>
            <Icon
              name="right"
              size={25}
              color={Typography.Colors.lightgrey}
              style={styles.arrowstyle}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Typography.Colors.white,
    padding: 10,
  },
  firstsection: {
    paddingHorizontal: 30,
    paddingVertical: 44,
    flexDirection: "row",
  },
  profilepic: {
    borderRadius: 50,
    height: 62,
    width: 62,
  },
  textcontainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  textname: {
    fontSize: 18,
    fontFamily: Typography.font.bold,
    color: Typography.Colors.black,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  mailcontainer: {
    fontSize: 14,
    fontFamily: Typography.font.regular,
    color: Typography.Colors.lightgrey,
  },
  arrowstyle: {
    fontWeight: "bold",
    paddingVertical: 2,
    height: 35,
    width: 35,
  },
  textstyle: {
    fontSize: 20,
    alignSelf: "center",
    marginBottom: 5,
    fontWeight: "700",
    fontFamily: Typography.font.bold,
    color: Typography.Colors.primary,
  },
  viewaccount: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 20,
  },
  imgstyle: {
    height: 24,
    width: 24,
  },
  detailcontainer: {
    height: 54,
    width: 370,
    flexDirection: "row",
    justifyContent: "space-between",
    // marginRight: ,
  },
  mindetailstyle: {
    justifyContent: "center",
    gap: 14,
    flexDirection: "row",
  },
  staticstyle: {
    // backgroundColor: "black",
    marginBottom: 5,
    color: Typography.Colors.primary,
    fontFamily: Typography.font.regular,
    fontWeight: "600",
    fontSize: 17,
  },
  dynamicstyle: {
    marginTop: 6,
    fontFamily: Typography.font.regular,
    color: Typography.Colors.lightgrey,
    fontSize: 15,
    fontWeight: "600",
  },
});

export default EditProfileScreen;

// function setSelectedImage(arg0: string) {
//   throw new Error("Function not implemented.");
// }
