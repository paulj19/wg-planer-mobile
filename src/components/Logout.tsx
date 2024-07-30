import * as React from "react";
import { Button, StyleSheet, Text } from "react-native";
import { persistor } from "store/store";
import { clearAuthToken } from "features/auth/AuthTokenStorage";
import { AuthContext } from "App";
import { userSlice } from "features/user/UserSlice";
import { useDispatch } from "react-redux";
import { Pressable } from "react-native";

export default function Logout() {
  const { authContext } = React.useContext(AuthContext);
  const dispatch = useDispatch();

  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        clearAuthToken();
        persistor.purge();
        dispatch(userSlice.util.resetApiState());
        authContext.signOut();
      }}
    >
      <Text>Logout</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
});
