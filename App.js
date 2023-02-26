import { StyleSheet } from "react-native";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { HomeScreen } from "./Home/HomeScreen";
import axios from "./lib/axiosConfig";
import * as storge from "./util/storage/Store";
import { StoredItems } from "./util/storage/Store";
import { PATH_VALIDATE_ACCESS_TOKEN } from "./lib/UrlPaths";
import LoginScreen from "./lib/Authentication/Authentication";
import { introspectToken } from "./lib/Authentication/AuthenticationRequests";

const Stack = createStackNavigator();

export const AuthContext = React.createContext();

export default function App({ navigation }) {
  const [authState, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "RENEW_TOKEN":
          return {
            ...prevState,
            accessToken: action.accessToken,
            refreshToken: action.refreshToken,
            idToken: action.idToken,
            tokenType: action.tokenType,
            expiresIn: action.expiresIn,
            scope: action.scope,
            isLoading: false,
          };
        case "SIGN_IN":
          return {
            ...prevState,
            accessToken: action.accessToken,
            refreshToken: action.refreshToken,
            idToken: action.idToken,
            tokenType: action.tokenType,
            expiresIn: action.expiresIn,
            scope: action.scope,
            isSignout: false,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            accessToken: null,
            refreshToken: null,
            idToken: null,
            expiresIn: null,
            tokenType: null,
            scope: null,
            isSignout: true,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      accessToken: null,
      refreshToken: null,
      idToken: null,
      expiresIn: null,
      tokenType: null,
      scope: null,
    }
  );

  React.useEffect(() => {
    const bootStrapAsync = async () => {
      //non-lenient if any internal or http error => set token to null, go to login.
      //remove this after fixing stack.nav flow
      //isAvail check instead
      try {
        // const accessToken = await storge.load(StoredItems.ACCESS_TOKEN);
        // const refreshToken = await storge.load(StoredItems.REFRESH_TOKEN);
        await storge.loadAllTokens();
        //if (accessToken || refreshToken) {
        //  introspectToken(accessToken)
        //    .then((response) => {
        //      if (response) {
        //        dispatch({
        //          type: "RENEW_TOKEN",
        //          accessToken: accessToken,
        //          refreshToken: response.headers.refresh_token,
        //        });
        //      } else {
        //        //will go to login screen
        //        clearTokens();
        //      }
        //    })
        //    .catch(() => {
        //      clearTokens();
        //    });
        //}
      } catch (e) {
        console.error("Error during validation: " + e);
      }
    };
    bootStrapAsync();
  }, []);

  const clearTokens = async () => {
    await storge.remove(StoredItems.ACCESS_TOKEN);
    await storge.remove(StoredItems.REFRESH_TOKEN);
    dispatch({ type: "RENEW_TOKEN", accessToken: null, refreshToken: null });
  };
  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        dispatch({
          type: "SIGN_IN",
          ...data,
        });
      },
      signOut: () =>
        dispatch({
          type: "SIGN_OUT",
          accessToken: "dummy_token",
          refreshToken: "dummy_token",
        }),
      signUp: async (data) => {
        dispatch({
          type: "SIGN_IN",
          accessToken: "dummy_token",
          refreshToken: "dummy_token",
        });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator>
          {!console.log("AuthState: " + JSON.stringify(authState)) &&
          authState.accessToken == null ? (
            <Stack.Screen name="Login" component={LoginScreen} />
          ) : (
            //<Stack.Screen name="Login" component={RegistrationForm}/>
            <Stack.Screen name="Home" component={HomeScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
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
