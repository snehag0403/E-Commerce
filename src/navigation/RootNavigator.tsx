import React from "react";
import BottomTabs from "./BottomTabs";
import AuthNavigator from "./AuthNavigator";
import useAuthStore from "../stores/useAuthStore";

export default function RootNavigator() {
  interface AuthStoreState {
    isLoggedIn: boolean;
  }

  const isLoggedIn: boolean = useAuthStore(
    (state: AuthStoreState) => state.isLoggedIn
  );

  return (
    <>
      {/* @ts-ignore: Suppress TypeScript error for 'id' */}
      {isLoggedIn ? <BottomTabs /> : <AuthNavigator />}
    </>
  );
}
