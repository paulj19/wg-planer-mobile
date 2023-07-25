import * as React from "react";
import { Button } from "react-native";
import { persistor } from "store/store";
import { clearAuthToken } from "features/auth/AuthTokenStorage";
import { AuthContext } from "App";
import { userSlice } from "features/user/UserSlice";
import { useDispatch } from "react-redux";

export default function Logout() {
  const {authContext} = React.useContext(AuthContext);
  const dispatch = useDispatch();

  return (
    <Button
      title="LOGOUT"
      onPress={() => {
        clearAuthToken();
        persistor.purge();
        dispatch(userSlice.util.resetApiState());
        authContext.signOut();
      }}
    />
  );
}
