import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { aStorage } from "./AsyncStorage";

export async function setItem(key_: string, value: object): Promise<void> {
  //sync instead of /validate, securestorage?
  //needd just for login, this will do it for all req.
  if (Platform.OS === "web") {
    return aStorage.save({
      key: key_,
      data: value,
    });
  }
  return SecureStore.setItemAsync(key_.toString(), JSON.stringify(value));
}

export async function getItem(key_: string) {
  try {
    let authToken;
    if (Platform.OS === "web") {
      authToken = await aStorage.load({
        key: key_,
        autoSync: false,
        syncInBackground: false,
      });
      return authToken;
    } else {
      authToken = await SecureStore.getItemAsync(key_.toString());
      return JSON.parse(authToken);
    }
  } catch (e) {
    return null;
  }
}

export async function removeItem(key_: string): Promise<void> {
  if (Platform.OS === "web") {
    return aStorage.remove({
      key: key_.toString(),
    });
  }
  return SecureStore.deleteItemAsync(key_.toString());
}
