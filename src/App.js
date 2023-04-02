import { StyleSheet } from "react-native";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { HomeScreen } from "./Home/HomeScreen";
import LoginScreen from "./lib/Authentication/Authentication";
import AuthToken from "./lib/Authentication/AuthToken";
import { registerRootComponent } from "expo";

const Stack = createStackNavigator();

export const AuthContext = React.createContext();

export default function App() {
  const [authState, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "LOAD_TOKEN":
          return {
            ...prevState,
            ...action,
            isLoading: false,
          };
        case "SIGN_IN":
          return {
            ...prevState,
            ...action,
            isSignout: false,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            ...action,
            isSignout: true,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      _accessToken: null,
      _refreshToken: null,
      _idToken: null,
      _expiryDate: null,
      _tokenType: null,
      _scope: null,
    }
  );

  //TODO think about optimising useEffect
  //TODO test this flow => iterate through all the possible cases
  React.useEffect(() => {
    const bootStrapAsync = async () => {
      try {
        const authToken = await AuthToken.loadAndRefreshAccessTokenIfExpired();

        if (authToken) {
          dispatch({
            type: "LOAD_TOKEN",
            ...authToken,
          });
          authToken.save();
        }
      } catch (e) {
        console.error("Error loading token: " + e);
      }
    };
    bootStrapAsync();
  }, []);

  const clearTokens = async () => {
    // await storge.remove(StoredItems.ACCESS_TOKEN);
    // await storge.remove(StoredItems.REFRESH_TOKEN);
    // dispatch({ type: "LOAD_TOKEN",_accessToken: null, _refreshToken: null });
  };
  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        dispatch({
          type: "SIGN_IN",
          ...data,
        });
      },
      // signOut: () =>
      //   dispatch({
      //     type: "SIGN_OUT",
      //     _accessToken: "dummy_token",
      //     _refreshToken: "dummy_token",
      //   }),
      // signUp: async (data) => {
      //   dispatch({
      //     type: "SIGN_IN",
      //     _accessToken: "dummy_token",
      //     _refreshToken: "dummy_token",
      //   });
      // },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator>
          {authState._accessToken == null ? (
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
registerRootComponent(App);

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
