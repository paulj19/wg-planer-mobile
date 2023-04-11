import { Button } from "react-native";
import { clearAuthToken } from "../lib/Authentication/AuthTokenStorage";

export default function Logout() {
  function clearAuthTokenAndNavigate() {
    clearAuthToken();
    // navigation.navigate('EntryScreen');
  }
  return (
    <Button
      title="LOGOUT"
      onPress={() => clearAuthTokenAndNavigate()}
    />
  );
}
