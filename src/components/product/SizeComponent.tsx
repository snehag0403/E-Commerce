import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { sizeProps } from '../../models/HomePage.type'
import { Typography } from '../../theme/Colors'
import useAuthStore from '../../stores/useAuthStore'

const SizeComponent = ({
    size,
    onClick,
    selectedSize
}: sizeProps) => {
    const themeMode = useAuthStore((state) => state.theme);
  const theme =
    themeMode === "dark"
      ? {
          background: Typography.Colors.charcol,
          text: Typography.Colors.white,
        }
      : {
          background: Typography.Colors.white,
          text: Typography.Colors.black,
        };
    return (
        <Pressable 
            style={[styles.sizeBox,selectedSize && styles.selectedSize,{backgroundColor:theme.background}]} 
            onPress={onClick}
        >
            <Text style={[styles.sizeText,{color:theme.text}]}>{size}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    sizeBox: {
        // backgroundColor: Typography.Colors.white,
        height: 42,
        width: 42,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        borderWidth: 1,
        borderColor: Typography.Colors.white,
        margin: 5,
        borderRadius: 20,
    },
    selectedSize: {
        borderWidth: 3,
        borderColor: Typography.Colors.green,
    },
    sizeText: {
        color: Typography.Colors.lightblack,
        fontSize: 14,
        fontFamily: Typography.font.regular,
    },
})

export default SizeComponent