import webAnalytics from "./WebAnalaytics";
import analytics from "@react-native-firebase/analytics";
import { isDeviceDesktop } from "util/Device";
import { logEvent, setUserId, setUserProperties } from "firebase/analytics";
import type { UserProfile } from "types/types";

export function init(userprofile: UserProfile) {
  if (isDeviceDesktop()) {
    setUserId(webAnalytics, userprofile.id.toString());
    setUserProperties(webAnalytics, { username: userprofile.username });
    return;
  }
  analytics().setUserId(userprofile.id.toString());
  analytics().setUserProperty("username", userprofile.username);
}
export function logLogin() {
  const method = "auth server";
  if (isDeviceDesktop()) {
    logEvent(webAnalytics, "login", { method });
    return;
  }
  analytics().logLogin({ method });
}
