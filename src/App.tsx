import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "features/home/HomeScreen";
import { registerRootComponent } from "expo";
import {
  clearAuthToken,
  loadAndRefreshAccessTokenIfExpired,
} from "features/auth/AuthTokenStorage";
import AuthToken from "features/auth/AuthToken";
import EntryScreen from "components/EntryScreen";
import { RegistrationForm } from "features/registration/RegistrationForm";
import Login from "components/Login";
import initBase64 from "util/Base64";
import { server } from "mocks/server";
import { setupURLPolyfill } from "react-native-url-polyfill";
import { Provider } from "react-redux";
import { store } from "store/store";
import { isDevicePhoneOrTablet } from "util/Device";
import { StyleSheet } from "react-native";

const Stack = createStackNavigator();
initBase64();
export let AuthContext;

export default function Appx() {
  AuthContext = React.createContext({});
  //TODO think about optimising useEffect => only during mount?
  //TODO test this flow => iterate through all the possible cases
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "SIGN_IN":
          return {
            signedIn: true,
          };
        case "SIGN_OUT":
          return {
            signedIn: false,
          };
      }
    },
    //signedIn variable could be part of user profile
    { signedIn: false }
  );
  const authContext = React.useMemo(
    () => ({
      signIn: () => dispatch({ type: "SIGN_IN" }),
      signOut: () => dispatch({ type: "SIGN_OUT" }),
    }),
    []
  );
  React.useEffect(() => {
    const bootStrapAsync = async () => {
      try {
        await loadAndRefreshAccessTokenIfExpired();
        if (AuthToken.isPresent()) {
          authContext.signIn();
        }
      } catch (e) {
        clearAuthToken();
        console.error("Error loading token: " + e); //TODO test if execution would stop here
      }
    };
    bootStrapAsync();
  }, []);

  return (
    <Provider store={store}>
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          <Stack.Navigator>
            <>
              {state.signedIn ? (
                <>
                  <Stack.Screen name="Home" component={HomeScreen} />
                </>
              ) : (
                <>
                  <Stack.Screen name="EntryScreen" component={EntryScreen} />
                </>
              )}
              <Stack.Screen
                name="RegistrationForm"
                component={RegistrationForm}
              />
              <Stack.Screen name="Login" component={Login} />
            </>
          </Stack.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>
    </Provider>
  );
}

registerRootComponent(Appx);
if (isDevicePhoneOrTablet()) {
  setupURLPolyfill();
}

if (process.env.NODE_ENV === "development") {
  server.listen({ onUnhandledRequest: "bypass" });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
const loginScreenStyles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  fieldError: {
    color: "#ff0000",
  },
});
