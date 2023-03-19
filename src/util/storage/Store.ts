import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { aStorage } from "./AsyncStorage";

export async function save(key_: string, value: object): Promise<void> {
  //sync instead of /validate, securestorage?
  //needd just for login, this will do it for all req.
  if (Platform.OS === "web") {
    return aStorage.save({
      key: key_,
      data: value,
    });
  }
  return SecureStore.setItemAsync(key_.toString(), value);
}

export async function load(key_: string) {
  try {
    let authToken;
    if (Platform.OS === "web") {
      authToken = await aStorage.load({
        key: key_,
        autoSync: false,
        syncInBackground: false,
      });
      return authToken;
    }
    authToken = await SecureStore.getItemAsync(key_.toString());
    return authToken;
  } catch (e) {
    return null;
  }
}

export async function remove(key_: string): Promise<void> {
  if (Platform.OS === "web") {
    return aStorage.remove({
      key: key_.toString(),
    });
  }
  return SecureStore.deleteItemAsync(key_.toString());
}
