import Logout from "components/Logout";
import { ActivityIndicator, Text, View } from "react-native";
import { useLazyGetPostLoginInfoQuery } from "features/user/UserSlice";
import { useContext, useEffect, useState } from "react";
import * as Analytics from "util/analytics/Analytics";
import { AuthContext } from "App";
import { UserProfile } from "types/types";
import { ErrorScreen } from "components/ErrorScreen";

export default function HomeScreen() {
  const [getPostLoginInfo, { currentData }] = useLazyGetPostLoginInfoQuery();
  const userprofile = currentData?.userprofile;
  const floor = currentData?.floor;
  const { authContext, authState } = useContext(AuthContext);
  const [userprofileError, setUserprofileError] = useState(false);

  useEffect(() => {
    getPostLoginInfo(null, true)
      .unwrap()
      .then((userprofile) => {
      console.log("userprofile", JSON.stringify(userprofile));
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
    return <ActivityIndicator size="large" color="#0000ff" style={{
      marginTop: "50%",
      marginLeft: "auto",
      marginRight: "auto",
    }}
    />;
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

  if (userprofile) {
    return (
      <View>
        <Text>{JSON.stringify(userprofile) + JSON.stringify(floor)}</Text>
        <Logout />
      </View>
    );
  } else {
    return (
      <View>
        <Text>{"no user profile"}</Text>
        <Logout />
      </View>
    );

    // throw Error("userprofile must not be null");
  }
}
