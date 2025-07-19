import { z } from "zod";
import {
  changepassword,
  forgetpassword,
  loginUser,
  verifyotp,
} from "../../authentication/AuthApi";
import { registerUser } from "../../authentication/AuthApi";
import axiosInstance from "./axiosInstance";
import ENDPOINTS from "../../utils/endpoints";
import useAuthStore from "../../stores/useAuthStore";

const loginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 8 characters" }),
});

export const loginService = async (FormData: any) => {
  const parsed = loginSchema.safeParse(FormData);
  if (!parsed.success) {
    throw new Error(
      "Validation Failed: " + JSON.stringify(parsed.error.errors)
    );
  }
  try {
    const response = await loginUser(parsed.data);
    // console.log(response, "fdgvfdvfdv");
    return response.data;
  } catch (error) {
    console.error("Login Service Error:", error);
    throw error;
  }
};

const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name should have atleast one character long" }),
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: "password must be atleast 8 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Confirm Password must be atleast 8 character long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const registerService = async (FormData: any) => {
  const parsed = signupSchema.safeParse(FormData);
  if (!parsed.success) {
    throw new Error("Validation Failed:" + JSON.stringify(parsed.error.errors));
  }
  try {
    const response = await registerUser(parsed.data);
    return response.data;
  } catch (error) {
    console.error("Register Service Error", error);
    throw error;
  }
};

export const forgotPasswordService = async (FormData: any) => {
  try {
    const response = await forgetpassword(FormData);
    return response.data;
  } catch (error) {
    console.error("Forget Password Service Error:", error.message);
    throw error;
  }
};

export const verifyOtpService = async (FormData: any) => {
  try {
    const response = await verifyotp(FormData);
    return response.data;
  } catch (error) {
    console.log("Verify OTP Service Error", error.message);
    throw error;
  }
};

export const PasswordChangeService = async (FormData: any) => {
  try {
    const response = await changepassword(FormData);
    return response.data;
  } catch (error) {
    console.error("Password Change Service Error:", error.message);
    throw error;
  }
};

export const changePasswordService = (FormData: any) => {
  return axiosInstance.post(ENDPOINTS.UPDATE_PASSWORD, FormData);
};

export const updateUserdata = async (userId: any, updatedData: any) => {
  try {
    const response = await axiosInstance.patch(
      ENDPOINTS.UPDATE(userId),
      updatedData
    );

    if (!userId) {
      console.error("userId is missing!");
      return;
    }
    const updatedUser = response.data;

    useAuthStore.getState().setUser(updatedUser);
    return updatedUser;
  } catch (error: any) {
    console.error(
      "Update User Data Error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update user data"
    );
  }
};

export const searchProducts = (query: string) =>
  axiosInstance.get(ENDPOINTS.SEARCHALL, { params: { q: query } });
export const orders = () => axiosInstance.get(ENDPOINTS.ALLORDERS);
export const promocode = () => axiosInstance.get(ENDPOINTS.PROMOCODE);
export const Categories = () => axiosInstance.get(ENDPOINTS.CATEGORY);
export const Collection = () => axiosInstance.get(ENDPOINTS.COLLECTION);
export const profilechange = (formData: FormData) =>
  axiosInstance.post(ENDPOINTS.UPLOADS, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const SubCategories = (name) => {
  return axiosInstance.get(`${ENDPOINTS.SUBCATEGORY}${name}`);
};

export const Products = (name, category, id?: any) => {
  return axiosInstance.get(`${ENDPOINTS.PRODUCTS}${name}/${category}`);
};

export const CarousalData = () => axiosInstance.get(ENDPOINTS.CAROUSAL);

export const AddToWishlist = (id: string) => {
  return axiosInstance.post(ENDPOINTS.WISHLISTPOST, { productId: id });
};

export const WishlistData = () => {
  return axiosInstance.get(ENDPOINTS.WISHLISTGET);
};

export const Brand = () => {
  return axiosInstance.get(ENDPOINTS.BRAND);
};


export const Color = () => {  
  return axiosInstance.get(ENDPOINTS.COLOR);
};

export const WishlistDelete = (productId: string) => {
  return axiosInstance.delete(ENDPOINTS.WISHLIST, {
    data: {
      productId,
    },
  });
};

export const WishlistDeleteAll = () =>
  axiosInstance.delete(ENDPOINTS.WISHLISTDELETE);

export const ProductFilters = (
  discountMax,
  discountMin,
  priceMax,
  priceMin,
  colorIds,
  subcategoryIds,
  categoryIds
) => {
  const queryParams = new URLSearchParams({

    discountMax: discountMax,
    discountMin: discountMin,
    priceMax: priceMax,
    priceMin: priceMin,
    colorIds: colorIds,
    subcategoryIds:subcategoryIds,
    categoryIds:categoryIds,
  }).toString();

  return axiosInstance.get(`${ENDPOINTS.FILTERS}?${queryParams}`);
};

export const AddToCart = (
  id: string,
  quantity: number,
  productColorId: string,
  productSizeId: string
) => {
  return axiosInstance.post(ENDPOINTS.CART, {
    productId: id,
    quantity: quantity,
    productColorId: productColorId,
    productSizeId: productSizeId,
  });
};

export const CartData = () => {
  return axiosInstance.get(ENDPOINTS.CART);
};

export const CartDelete = (productId: string) => {
  return axiosInstance.delete(ENDPOINTS.CARTDELETE, {
    data: {
      productId,
    },
  });
};

export const PromoCode = (promoCode: string) => {
  
  // console.log(promoCode,"promoCodeeee");
  
  return axiosInstance.post(ENDPOINTS.PROMOCODEPOST, { promoCode: promoCode });
};

export const QuantityDelete = (productId: string) => {
  return axiosInstance.delete(ENDPOINTS.QUANTITYDELETE, {
    data: {
      productId,
    },
  });
};

export const Payment = (
  address: string,
  city: string,
  country: string,
  postalCode: string
) => {
  return axiosInstance.post(ENDPOINTS.PAYMENT, {
    address: address,
    city: city,
    country: country,
    postalCode: postalCode,
  });
};

export const GoogleSign = (
  name: string,
  email: string,
  profilePicture: string,
) => {
  return axiosInstance.post(ENDPOINTS.GOOGLELOGIN, {
    name: name,
    email: email,
    profilePicture: profilePicture,
  });
};