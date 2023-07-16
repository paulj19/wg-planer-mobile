import { getDeviceTypeAsync, DeviceType } from "expo-device";
import * as Device from "expo-device";

export function isDeviceDesktop() {
  return Device.deviceType === DeviceType.DESKTOP;
}

export function isDevicePhoneOrTablet() {
  return (
    Device.deviceType === DeviceType.PHONE ||
    Device.deviceType === DeviceType.TABLET
  );
}
