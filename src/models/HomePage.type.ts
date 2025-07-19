import {
  ImageProps,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  TextProps,
  TextStyle,
} from "react-native";
import { boolean } from "zod";

export type CategoryProps = {
  id: string;
  image: string;
  name: string;
};

export type BannerProps = {
  name: ReactNode;
  empty: any;
  id: string;
  image: ImageSourcePropType;
  logoImage: ImageSourcePropType;
  brand: string;
  event: string;
  discount: string;
};

export type TrendingProps = {
  id?: string;
  img?: ImageSourcePropType;
  logo?: ImageSourcePropType;
  offer?: number;
  productType?: string;
  amount?: number;
  onClick: () => void;
  productImgStyle?: StyleProp<ImageStyle>;
  staticContainer?: StyleProp<ImageStyle>;
};

export type ProductProps = {
  id?: string;
  images?: ImageSourcePropType;
  productName?: string;
  brandName?: string;
  initialRate?: number;
  rate?: number;
  discount?: number;
  onClick: () => void;
};

export type ButtonProps = {
  id?: string;
  icon?: ImageSourcePropType;
  buttonText?: string;
  buttonStyle?: StyleProp<ImageStyle>;
  TextStyle?: StyleProp<ImageStyle>;
  onClick: () => void;
};

export type MainHeaderProps = {
  id?: string;
  productType?: string;
  onClick: () => void;
  onPress: () => void;
  Title?: string;

};
export type sizeProps = {
  size: string;
  onClick: () => void;
  selectedSize: boolean;
};
