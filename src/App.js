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

export const AuthContext = React.createContext();

export default function App() {
  initializeNavigators();
  const [isTokenLoaded, setIsTokenLoaded] = React.useState(false);
  //TODO think about optimising useEffect => only during mount?
  //TODO test this flow => iterate through all the possible cases
  React.useEffect(() => {
    const bootStrapAsync = async () => {
      try {
        await loadAndRefreshAccessTokenIfExpired();
        setIsTokenLoaded(true);
      } catch (e) {
        clearAuthToken();
        console.error("Error loading token: " + e); //TODO test if execution would stop here
      }
    };
    bootStrapAsync();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={AuthToken.isPresent() ? "Home" : "EntryScreen"}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="EntryScreen" component={EntryScreen} />
        <Stack.Screen name="RegistrationForm" component={RegistrationForm} />
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
registerRootComponent(App);

function initializeNavigators() {
  <Stack.Navigator>
    <Stack.Screen name="RegistrationForm" component={RegistrationForm} />
  </Stack.Navigator>;
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
