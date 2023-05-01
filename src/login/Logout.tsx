import * as React from "react";
import { Button } from "react-native";
import { clearAuthToken } from "../lib/Authentication/AuthTokenStorage";
import { AuthContext } from "./../../src/App";

export default function Logout() {
  const authContext = React.useContext(AuthContext);
  function clearAuthTokenAndNavigate() {
    clearAuthToken();
    authContext.signOut();
  }

  return <Button title="LOGOUT" onPress={() => clearAuthTokenAndNavigate()} />;
}
