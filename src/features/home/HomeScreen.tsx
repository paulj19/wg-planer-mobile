import { GO_BACKEND, RESOURCE_SERVER_DEV, URL_POST_LOGIN } from "util/UrlPaths";
import Logout from "components/Logout";
import { ActivityIndicator, Text, ToastAndroid, View } from "react-native";
import {
  floorSlice,
  useGetPostLoginInfoQuery,
  useLazyGetPostLoginInfoQuery,
} from "features/registration/FloorSlice";
import { useContext, useEffect, useState } from "react";
import * as Analytics from "util/analytics/Analytics";
import { AuthContext } from "App";
import { FloorItem, Room, UserProfile } from "types/types";
import { ErrorScreen } from "components/ErrorScreen";
import { Settings } from "features/settings/ProfileSettings";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Feed from "features/feed/Feed";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Floor } from "features/floor/Floor";
import { registerForPushNotificationsAsync } from "features/notification/ExpoSetup";
import { Platform } from "react-native";

export default function HomeScreen() {
  const { data, isLoading, isError, error } =
    useGetPostLoginInfoQuery(undefined);
  const { authContext, authState } = useContext(AuthContext);
  const [registerExpoPushToken] = floorSlice.useRegisterExpoPushTokenMutation();

  const userprofile: UserProfile = data?.userprofile;
  const floor: FloorItem = data?.floor;

  // const myRoom = floor?.Rooms?.find(
  //   (room) => room.Resident?.Id === userprofile.id.toString()
  // );
  let userId;
  if (Platform.OS === "ios") {
    userId = 1;
  } else {
    userId = 2;
  }
  const myRoom = floor?.Rooms?.find(
    (room) => room.Resident?.Id === userId.toString()
  );

  useEffect(() => {
    // analyticsInitAndLogLogin(userprofile);
    // @ts-ignore
          if (Platform.OS === "ios") {
    console.log("XXX", myRoom, data?.floor.Id);
          } else {
    console.log("JJJ", myRoom, data?.floor.Id);
          }
    if (myRoom && !myRoom.Resident.ExpoPushToken) {
      registerForPushNotificationsAsync()
        .then((token) => {
          if (!token) {
            throw new Error("invalid token received" + token);
          }
          if (Platform.OS === "ios") {
            console.log("ios", token);
          } else {
            console.log("android", token);
          }
          registerExpoPushToken({
            floorId: floor.Id,
            // @ts-ignore
            userId: myRoom.Resident.Id,
            ExpoPushToken: token,
          });
        })
        .catch((error: any) =>
          console.error("Error registering push token", error)
        );
    }
  }, [myRoom?.Resident?.ExpoPushToken]);

  if (isLoading) {
    return (
      <ActivityIndicator
        size="large"
        color="#0000ff"
        style={{
          marginTop: "50%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      />
    );
  }

  if (isError) {
    console.error("Error loading floor data ", error);
    ToastAndroid.show(
      "Error loading page, please refresh or try again later",
      ToastAndroid.SHORT
    );
  }

  function analyticsInitAndLogLogin(userprofile: UserProfile) {
    //todo verify if cache is cleared after 60 sec?
    if (userprofile && !authState.analyticsInitialized) {
      Analytics.init(userprofile);
      if (authState.newLogin) {
        Analytics.logLogin();
        authContext.analyticsInitAndLogin();
      }
    }
  }

  const Tab = createBottomTabNavigator();

  return (
    <>
      <Tab.Navigator
        initialRouteName="Feed"
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: "#000",
          tabBarInactiveTintColor: "gray",
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Feed") {
              iconName = focused ? "notifications" : "notifications-none";
              return <MaterialIcons name={iconName} size={24} color="black" />;
            } else if (route.name === "Settings") {
              iconName = focused ? "settings" : "settings-outline";
            } else if (route.name === "Floor") {
              iconName = focused ? "home" : "home-outline";
            }
            return <Ionicons name={iconName} size={24} color="black" />;
          },
        })}
      >
        <Tab.Screen
          name="Floor"
          component={Floor}
          options={{
            tabBarLabel: "Home",
          }}
        />
        <Tab.Screen
          name="Feed"
          component={Feed}
          options={{
            tabBarLabel: "Feed",
          }}
        />
        <Tab.Screen
          name="Settings"
          component={Settings}
          options={{
            tabBarLabel: "Settings",
          }}
        />
      </Tab.Navigator>
    </>
  );
}
