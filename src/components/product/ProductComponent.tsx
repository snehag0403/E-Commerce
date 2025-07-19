import React from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";

import { ProductProps } from "../../models/HomePage.type";
import { Typography } from "../../theme/Colors";
import useAuthStore from "../../stores/useAuthStore";

const ProductComponent = ({
  images,
  productName,
  brandName,
  initialRate,
  rate,
  discount,
  onClick,
}: ProductProps) => {
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
    <View style={styles.mainContainer}>
      <View style={styles.photoContainer}>
        <View style={styles.Container}>
          <Image
            source={{ uri: images[0] }}
            style={styles.Collection}
          />
        </View>
        <View style={[styles.Container, { gap: 15 }]}>
          <View style={styles.Container}>
            <Image
              source={{ uri: images[1].toString() }}
              style={styles.Collection}
            />
          </View>

          <Pressable style={styles.backgroundContainer} onPress={onClick}>
            <ImageBackground
              source={{ uri: images[2].toString() }}
              style={styles.subConatiner}
            >
              <Text style={styles.numberText}>+{images.length - 2}</Text>
              <View style={styles.overlay} />
            </ImageBackground>
          </Pressable>
        </View>
      </View>

      <View style={styles.dataContainer}>
        <Text
          numberOfLines={1}
          style={[styles.productName, { color: theme.text }]}
        >
          {productName}
        </Text>
        <Text
          numberOfLines={1}
          style={[styles.brandName, { color: theme.text }]}
        >
          {brandName}
        </Text>
        <View style={styles.Amount}>
          <Text style={styles.initialRate}>Rs. {initialRate}</Text>
          <Text numberOfLines={1} style={[styles.rate, { color: theme.text }]}>
            Rs.{rate}
          </Text>
          <Text numberOfLines={1} style={styles.discount}>
            ({discount}% Off)
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    height: 328,
    marginVertical: 20,
  },
  photoContainer: {
    flexDirection: "row",
    height: "70%",
    gap: 15,
  },
  Container: {
    flex: 1,
  },
  Collection: {
    height: "100%",
    width: "100%",
    borderRadius: 10,
  },
  subConatiner: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    overflow: "hidden",
    // borderRadius:200
  },
  dataContainer: {
    // flex: 1,
    paddingLeft: 8,
    paddingBottom: 15,
    // backgroundColor: 'pink'
  },

  numberText: {
    color: Typography.Colors.white,
    fontFamily: Typography.font.bold,
    fontSize: 33,
    // alignSelf: 'center',
    textAlign: "center",
    position: "absolute",
    zIndex: 99,
  },

  overlay: {
    backgroundColor: Typography.Colors.lightblack,
    opacity: 0.7,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    borderRadius: 10,
  },

  Amount: {
    flexDirection: "row",
    paddingTop: 7,
    // flex: 1,
    // backgroundColor:'red'
  },
  productName: {
    paddingTop: 16,
    fontSize: 20,
    fontFamily: Typography.font.medium,
    color: Typography.Colors.lightblack,
  },
  brandName: {
    fontSize: 18,
    fontFamily: Typography.font.regular,
    // color: Typography.Colors.lightblack,
  },
  initialRate: {
    fontSize: 15,
    alignSelf: "center",
    fontFamily: Typography.font.regular,
    color: Typography.Colors.lightgrey,
    textDecorationLine: "line-through",
  },
  rate: {
    fontSize: 20,
    paddingLeft: 17,
    fontFamily: Typography.font.regular,
    color: Typography.Colors.lightblack,
  },
  discount: {
    fontSize: 14,
    fontFamily: Typography.font.regular,
    color: Typography.Colors.lightgreen,
    paddingLeft: 10,
    alignSelf: "center",
  },
  backgroundContainer: {
    flex: 1,
    borderRadius: 30,
  },
});
export default ProductComponent;
