import * as React from "react";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
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
import { CreateFloor } from "features/registration/CreateFloor";

const Stack = createStackNavigator();
initBase64();
export let AuthContext;

export default function App() {
  AuthContext = React.createContext({});
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = React.useRef();
  //TODO think about optimising useEffect => only during mount?
  //TODO test this flow => iterate through all the possible cases
  const [authState, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "SIGN_IN":
          return {
            signedIn: true,
            newLogin: action.payload.newLogin,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            signedIn: false,
          };
        case "ANALYTICS_INIT_LOGIN":
          return {
            ...prevState,
            newLogin: false,
            analyticsInitialized: true,
          };
      }
    },
    //signedIn variable could be part of user profile
    { signedIn: false, newLogin: false, analyticsInitialized: false }
  );
  const authContext = React.useMemo(
    () => ({
      signIn: ({ newLogin }) =>
        dispatch({ type: "SIGN_IN", payload: { newLogin } }),
      signOut: () => dispatch({ type: "SIGN_OUT" }),
      analyticsInitAndLogin: () => dispatch({ type: "ANALYTICS_INIT_LOGIN" }),
    }),
    []
  );
  React.useEffect(() => {
    const bootStrapAsync = async () => {
      try {
        await loadAndRefreshAccessTokenIfExpired();
        if (AuthToken.isPresent()) {
          authContext.signIn({ newLogin: false });
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
      <AuthContext.Provider value={{ authContext, authState }}>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator
            screenOptions={{
              headerStyle: { elevation: 0 },
              cardStyle: { backgroundColor: "#000" },
            }}
          >
            <>
              {!authState?.signedIn ? (
                <>
                  <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ headerShown: false }}
                  />
                </>
              ) : (
                <>
                  <Stack.Screen
                    name="EntryScreen"
                    component={EntryScreen}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name="Create Floor" component={CreateFloor} />
                </>
              )}
              <Stack.Screen
                name="RegistrationForm"
                component={RegistrationForm}
                options={{ title: "Sign Up" }}
              />
              <Stack.Screen
                name="Login"
                component={Login}
                options={{ gestureEnabled: false, headerLeft: () => <></> }}
              />
            </>
          </Stack.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>
    </Provider>
  );
}

registerRootComponent(App);

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
