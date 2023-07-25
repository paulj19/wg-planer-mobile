import Logout from "components/Logout";
import { Text, View } from "react-native";
import { useLazyGetUserProfileQuery } from "features/user/UserSlice";
import { useContext, useEffect } from "react";
import * as Analytics from "util/analytics/Analytics";
import { AuthContext } from "App";
import { UserProfile } from "types/types";

export default function HomeScreen({ navigation, route }) {
  const [getUserprofile, { data: userprofile }] = useLazyGetUserProfileQuery();
  const { authContext, authState } = useContext(AuthContext);

  useEffect(() => {
    getUserprofile(null, true)
      .unwrap()
      .then((userprofile) => analyticsInitAndLogLogin(userprofile))
      .catch((e) =>
        console.error("error getting userprofile analytics init, login", e)
      );
  }, []);

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
  if (userprofile) {
    return (
      <View>
        <Text>{"hello " + userprofile.username + "!"}</Text>
        <Logout />
      </View>
    );
  } else {
    // throw Error("userprofile must not be null");
  }
}
