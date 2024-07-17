import { authHandlers } from "./AuthHandlers";
import { userHandlers } from "./UserHandlers";
import { setupServer } from "msw/native";
import { setupWorker } from "msw/browser";
import { isDevicePhoneOrTablet } from "util/Device";

let mswHost
if (isDevicePhoneOrTablet()) {
  mswHost = setupServer(...authHandlers, ...userHandlers);
} else {
  mswHost = setupWorker(...authHandlers, ...userHandlers);
}

export { mswHost };
