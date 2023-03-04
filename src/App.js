import { StyleSheet } from "react-native";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { HomeScreen } from "./Home/HomeScreen";
import LoginScreen from "./lib/Authentication/Authentication";
import { loadAndRefreshAccessTokenIfExpired } from "./lib/Authentication/AuthenticationFlow";

const Stack = createStackNavigator();

export const AuthContext = React.createContext();

export default function App({ navigation }) {
  const [authState, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "LOAD_TOKEN":
          return {
            ...prevState,
            accessToken: action.accessToken,
            refreshToken: action.refreshToken,
            idToken: action.idToken,
            tokenType: action.tokenType,
            expiryDate: action.expiryDate,
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
            expiryDate: action.expiryDate,
            scope: action.scope,
            isSignout: false,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            accessToken: null,
            refreshToken: null,
            idToken: null,
            expiryDate: null,
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
      expiryDate: null,
      tokenType: null,
      scope: null,
    }
  );

  //TODO think about optimising useEffect
  //TODO test this flow => iterate through all the possible cases
  React.useEffect(() => {
    const bootStrapAsync = async () => {
      try {
        const tokens = await loadAndRefreshAccessTokenIfExpired();
        dispatch({
          type: "LOAD_TOKEN",
          ...tokens,
        });
      } catch (e) {
        console.error("Error loading token: " + e);
      }
    };
    bootStrapAsync();
  }, []);

  const clearTokens = async () => {
    // await storge.remove(StoredItems.ACCESS_TOKEN);
    // await storge.remove(StoredItems.REFRESH_TOKEN);
    dispatch({ type: "LOAD_TOKEN", accessToken: null, refreshToken: null });
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
