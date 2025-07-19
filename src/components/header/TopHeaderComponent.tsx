import { Image, StyleSheet, Text, View } from "react-native";
import { Typography } from "../../theme/Colors";
import useAuthStore from "../../stores/useAuthStore";
import { assets } from "../../../assets/images";
import { useNavigation } from "@react-navigation/native";
import { useAppTheme } from "../../theme/useAppTheme";

const TopHeaderComponent = () => {
  const { user } = useAuthStore();
  const navigation = useNavigation();
  const themeMode = useAuthStore((state) => state.theme);
  const theme =
    themeMode === "dark"
      ? {
          background: Typography.Colors.black,
          text: Typography.Colors.white,
        }
      : {
          background: Typography.Colors.white,
          text: Typography.Colors.black,
        };
  return (
    
    <View style={styles.container}>
      <View style={styles.UserContainer}>
        <Image
          source={
            user?.profilePicture ? { uri: user?.profilePicture } : assets.Demo
          }
          style={styles.userImage}
        />
      <Text
          numberOfLines={1}
          style={[styles.userName, { color: theme.text }]}
        >
         PocketCart
          {/* {user?.name} */}
        </Text>
      <Image
        source={
          themeMode === 'dark'
            ? assets.Notification : assets.NotificationLight
        }
        style={{ height: 32, width: 32 }}
      />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    // paddingTop:50
    // paddingVertical:15
  },
  userImage: {
    height: 40,
    width: 40,
    borderWidth:2,
    borderRadius: 20,
    resizeMode: "cover",
    overflow: "hidden",
  },
  userName: {
    fontSize: 22,
    fontFamily: Typography.font.medium,
    textAlign: "center",
  },
  iconContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  icon: {
    height: 22,
    width: 22,
    color: Typography.Colors.lightblack,
  },
  UserContainer: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 7,
    gap: 13,
    justifyContent:'space-between'
  },
});

export default TopHeaderComponent;
