import { StyleSheet } from "react-native";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { HomeScreen } from "./Home/HomeScreen";
import { registerRootComponent } from "expo";
import { loadAndRefreshAccessTokenIfExpired } from "./lib/Authentication/AuthTokenStorage";
import AuthToken from "./lib/Authentication/AuthToken";
import EntryScreen from "./EntryScreen";

const Stack = createStackNavigator();

export const AuthContext = React.createContext();

export default function App() {
  const [isTokenLoaded, setIsTokenLoaded] = React.useState(false);
  //TODO think about optimising useEffect => only during mount?
  //TODO test this flow => iterate through all the possible cases
  React.useEffect(() => {
    const bootStrapAsync = async () => {
      try {
        await loadAndRefreshAccessTokenIfExpired();
        setIsTokenLoaded(true);
      } catch (e) {
        console.error("Error loading token: " + e); //TODO test if execution would stop here
      }
    };
    bootStrapAsync();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {AuthToken.isInitialized() ? (
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          <Stack.Screen
            name="Login"
            component={EntryScreen}
            initialParams={{ setIsTokenLoaded }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
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
