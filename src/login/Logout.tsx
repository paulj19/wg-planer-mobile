import * as React from "react";
import { Button } from "react-native";
import { persistor } from "./../store";
import { clearAuthToken } from "../lib/Authentication/AuthTokenStorage";
import { AuthContext } from "./../../src/App";
import { userSlice } from "./../features/user/UserSlice";
import { useDispatch } from "react-redux";

export default function Logout() {
  const authContext = React.useContext(AuthContext);
  const dispatch = useDispatch();

  function clearAuthToken_() {
    clearAuthToken();
    authContext.signOut();
  }
  function clearUserProfileCacheAndStorage() {
    persistor.purge();
    dispatch(userSlice.util.resetApiState());
  }

  return (
    <Button
      title="LOGOUT"
      onPress={() => {
        clearAuthToken_();
        clearUserProfileCacheAndStorage();
      }}
    />
  );
}
