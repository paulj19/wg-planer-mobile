import Logout from "components/Logout";
import { ActivityIndicator, Text, View } from "react-native";
import { useLazyGetPostLoginInfoQuery } from "features/user/UserSlice";
import { useContext, useEffect, useState } from "react";
import * as Analytics from "util/analytics/Analytics";
import { AuthContext } from "App";
import { FloorItem, UserProfile } from "types/types";
import { ErrorScreen } from "components/ErrorScreen";
import { Settings } from "features/settings/ProfileSettings";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feed } from "features/feed/Feed";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Floor} from "features/floor/Floor";
import floorStub from "mocks/stubs/floorStub";

export default function HomeScreen() {
  const [getPostLoginInfo, { currentData }] = useLazyGetPostLoginInfoQuery();
  const userprofile : UserProfile = currentData?.userprofile;
  const floor: FloorItem = floorStub;
  const { authContext, authState } = useContext(AuthContext);
  const [userprofileError, setUserprofileError] = useState(false);

  useEffect(() => {
    getPostLoginInfo(null, true)
      .unwrap()
      .then((userprofile) => {
        // analyticsInitAndLogLogin(userprofile);
      })
      .catch((e) => {
        console.error("error getting userprofile analytics init, login", e);
        setUserprofileError(true);
      });
  }, []);

  if (userprofileError) {
    return <ErrorScreen />;
  }
  if (!currentData) {
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
          initialParams={{myTasks: floor.Tasks.filter((task) => task.AssignedTo === userprofile.id), myFeed: floor.Feed}}
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
