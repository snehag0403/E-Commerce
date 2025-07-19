import React from "react";
import {
  Image,
  Text,
  View,
  StyleSheet,
  Dimensions,
  Pressable,
} from "react-native";
import { TrendingProps } from "../../models/HomePage.type";
import { Typography } from "../../theme/Colors";
import useAuthStore from "../../stores/useAuthStore";

const { width } = Dimensions.get("window");

const CardComponent = ({
  id,
  img,
  productImgStyle,
  logo,
  offer,
  productType,
  amount,
  staticContainer,
  onClick,
}: TrendingProps) => {
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
    <Pressable style={[styles.container, staticContainer]} onPress={onClick}>
      <View style={[styles.imgView, productImgStyle]}>
        <Image source={img} style={styles.imgStyles} />
      </View>
      <View style={styles.dataView}>
        {productType ? (
          <Text
            numberOfLines={1}
            style={[styles.productTypeStyle, { color: theme.text }]}
          >
            {productType}
          </Text>
        ) : (
          <View style={styles.logoImgContainer}>
            <Image source={logo} style={styles.logoStyle} resizeMode="cover" />
          </View>
        )}
      </View>
      <View style={styles.dataView}>
        {offer ? (
          <Text
            style={[styles.offerStyle, { paddingTop: 10, color: theme.text }]}
          >
            Min {offer}% Off
          </Text>
        ) : (
          <Text style={[styles.offerStyle, { color: theme.text }]}>
            Under Rs. {amount}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        paddingTop:2,
        flex: 1,
        marginVertical:4,
        // elevation:1,
        // backgroundColor:"#FAF9F6",
        borderRadius:10
    },
    imgView:{
        flex:1,
        height: 270,
        width: 216,
        // borderTopLeftRadius: 5,
        // borderTopRightRadius: 5,
        paddingLeft:2
    },
    dataView:{
        flex:1,
        alignItems:'center',
        marginBottom:2
    },
    imgStyles: {
        width:'99%',
        height:'100%',
        borderRadius:8,
        // borderTopLeftRadius:8
       
    },
    logoImgContainer:{
        height: 23,
        width: 35,
        margin:5
    },
    logoStyle: {
        marginTop: 7,
        alignSelf: 'center',
        height:"100%",
        width:"100%"
    },
    offerStyle: {
        fontSize: 16.5,
        fontFamily: Typography.font.medium,
        color: Typography.Colors.lightblack,
    },
    productTypeStyle: {
        fontSize: 14,
        fontFamily: Typography.font.regular,
        color: Typography.Colors.lightblack,
        paddingVertical: 4
    }
})

export default CardComponent;
