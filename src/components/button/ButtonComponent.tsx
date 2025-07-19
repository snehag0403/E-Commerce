import { Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { ButtonProps } from "../../models/HomePage.type";
import { Typography } from "../../theme/Colors";

const ButtonComponent = ({
  id,
  icon,
  buttonText,
  buttonStyle,
  TextStyle,
  onClick
}: ButtonProps) => {
  return (
    <View style={styles.buttonData}>
      <TouchableOpacity style={[styles.button, buttonStyle]} onPress={onClick}>
        <Text style={[styles.textstyle, TextStyle]}>{buttonText}</Text>
        <Image source={icon} style={styles.cartIcon} resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonData: {
    flex: 1,
    height: 38,
    width: 180,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // marginBottom: 15,
    gap: 18,
    borderRadius: 10,
    height: "100%",
    width: "100%",
  },
  cartIcon: {
    width: 15,
    height: 17,
    marginLeft: 5,
  },
  textstyle: {
    color: Typography.Colors.lightblack,
    fontSize: 14,
    fontFamily: Typography.font.regular,
  },
});
export default ButtonComponent;
