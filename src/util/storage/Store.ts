import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import AuthToken, { tokenDto } from "../../TokenDto";
import { aStorage } from "./AsyncStorage";

const ACCESS_TOKEN = "accessToken";
const REFRESH_TOKEN = "refreshToken";
const ID_TOKEN = "idToken";
const TOKEN_TYPE = "tokenType";
const EXPIRY_DATE = "expiryDate";
const SCOPE = "scope";

const tokenNames = [
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  ID_TOKEN,
  TOKEN_TYPE,
  SCOPE,
  EXPIRY_DATE,
];

export async function save(key_: string, value: any): Promise<void> {
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

export function load(key_: string) {
  if (Platform.OS === "web") {
    return aStorage.load({
      key: key_,
      autoSync: false,
      syncInBackground: false,
    });
  }
  //await here?
  return SecureStore.getItemAsync(key_.toString());
}

export async function remove(key_: string): Promise<void> {
  if (Platform.OS === "web") {
    return aStorage.remove({
      key: key_.toString(),
    });
  }
  return SecureStore.deleteItemAsync(key_.toString());
}
