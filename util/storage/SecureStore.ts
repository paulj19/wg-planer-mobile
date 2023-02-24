import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { aStorage } from "./AsyncStorage";

export enum StoredItems {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  ID_TOKEN,
  TOKEN_TYPE,
  SCOPE,
  EXPIRES_IN,
}

export async function save(key_: StoredItems, value: string): Promise<void> {
  //sync instead of /validate, securestorage?
  //needd just for login, this will do it for all req.
  if (Platform.OS === "web") {
    return aStorage.save({
      key: key_.toString(),
      data: value,
    });
  }
  return SecureStore.setItemAsync(key_.toString(), value);
}

export async function load(key_: StoredItems): Promise<string> {
  if (Platform.OS === "web") {
    return aStorage.load({
      key: key_.toString(),
      autoSync: false,
      syncInBackground: false,
    });
  }
  //await here?
  return SecureStore.getItemAsync(key_.toString());
}

export async function remove(key_: StoredItems): Promise<void> {
  if (Platform.OS === "web") {
    return aStorage.remove({
      key: key_.toString(),
    });
  }
  return SecureStore.deleteItemAsync(key_.toString());
}
