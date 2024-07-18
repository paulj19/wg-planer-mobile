import React, { useEffect, useRef, useState } from "react";
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
import { mswHost } from "mocks/server";
import { setupURLPolyfill } from "react-native-url-polyfill";
import { Provider } from "react-redux";
import { store } from "store/store";
import { isDevicePhoneOrTablet } from "util/Device";
import { StyleSheet } from "react-native";
import { CreateFloor } from "features/registration/CreateFloor";
import TaskActionsModal from "features/floor/TaskActionsModal";
import { AssignTask } from "features/floor/AssignTask";
import { registerForPushNotificationsAsync } from "features/notification/ExpoSetup";
import * as Notifications from "expo-notifications";

const Stack = createStackNavigator();
initBase64();
export let AuthContext;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
export default function App() {
  AuthContext = React.createContext({});
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = React.useRef();

  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>(
    []
  );
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
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

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? ""))
      .catch((error: any) => setExpoPushToken(`${error}`));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        // setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

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

  const linking = {
    prefixes: ["*"],
    config: {
      screens: {
        AllTasks: "all-tasks",
        HomeScreen: "home",
      },
    },
  };
  console.log("expo push token", expoPushToken);
  console.log(
    "Channels: ",
    JSON.stringify(
      channels.map((c) => c.id),
      null,
      2
    )
  );
  // if (notification) {
  //   console.log("title", notification.request.content.title);
  //   console.log("title", notification.request.content.body);
  //   console.log("title", JSON.stringify(notification.request.content.data));
  // }
  return (
    <Provider store={store}>
      <AuthContext.Provider value={{ authContext, authState }}>
        <NavigationContainer linking={linking} ref={navigationRef}>
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
                  <Stack.Screen name="AssignTask" component={AssignTask} />
                  <Stack.Group screenOptions={{ presentation: "modal" }}>
                    <Stack.Screen
                      name="TaskActionsModal"
                      component={TaskActionsModal}
                    />
                  </Stack.Group>
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
  if (isDevicePhoneOrTablet()) {
    mswHost.listen({ onUnhandledRequest: "bypass" });
  } else {
    mswHost.start({ onUnhandledRequest: "bypass" });
  }
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
