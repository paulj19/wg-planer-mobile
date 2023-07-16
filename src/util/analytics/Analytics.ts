import { webAnalytics } from "./WebAnalaytics";
import analytics from "@react-native-firebase/analytics";
import { isDeviceDesktop } from "util/Device";
import { logEvent } from "firebase/analytics";

export function logLogin() {
  const method = "auth server";
  if (isDeviceDesktop()) {
    logEvent(webAnalytics, "login", { method });
    return;
  }
  analytics().logLogin({ method });
}
