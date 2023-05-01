import { StyleSheet } from "react-native";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./Home/HomeScreen";
import { registerRootComponent } from "expo";
import {
  clearAuthToken,
  loadAndRefreshAccessTokenIfExpired,
} from "./lib/Authentication/AuthTokenStorage";
import AuthToken from "./lib/Authentication/AuthToken";
import EntryScreen from "./EntryScreen";
import { RegistrationForm } from "../src/RegistrationForm";
import Login from "../src/login/Login";

const Stack = createStackNavigator();
export let AuthContext;
export default function App() {
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
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator>
          <>
            {console.log(
              "authToken",
              JSON.stringify(AuthToken),
              state.signedIn
            )}
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
          </>
        </Stack.Navigator>
      </NavigationContainer>
      );
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
