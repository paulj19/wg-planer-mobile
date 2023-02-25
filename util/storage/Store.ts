import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import TokenDto from "../../TokenDto";
import { aStorage } from "./AsyncStorage";

export enum StoredItems {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  ID_TOKEN,
  TOKEN_TYPE,
  SCOPE,
  EXPIRES_IN,
}
export function saveAllTokens(tokens: TokenDto) {
  return Promise.allSettled([
    save(StoredItems.ACCESS_TOKEN, tokens.accessToken),
    save(StoredItems.REFRESH_TOKEN, tokens.refreshToken),
    save(StoredItems.ID_TOKEN, tokens.idToken),
    save(StoredItems.TOKEN_TYPE, tokens.tokenType),
    save(StoredItems.EXPIRES_IN, tokens.expiresIn),
    save(StoredItems.SCOPE, tokens.scope),
  ]);
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

export function load(key_: StoredItems) {
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
