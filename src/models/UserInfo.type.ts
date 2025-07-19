import { ImageSourcePropType, ImageStyle, StyleProp } from "react-native"

export type HeaderProps = {
    userImage?: ImageSourcePropType,
    userName?: string,
    icon?: ImageSourcePropType,
    icon1?: ImageSourcePropType,
    icon2?: ImageSourcePropType,
    imgStyle?:StyleProp<ImageStyle>
}