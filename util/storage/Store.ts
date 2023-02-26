import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import TokenDto from "../../TokenDto";
import { aStorage } from "./AsyncStorage";

const ACCESS_TOKEN = "accessToken";
const REFRESH_TOKEN = "refreshToken";
const ID_TOKEN    = "idToken";
const TOKEN_TYPE  = "tokenType";
const SCOPE       = "expiresIn";
const EXPIRES_IN  = "scope";


export function saveAllTokens(tokens: TokenDto) {
  return Promise.allSettled([
    save(ACCESS_TOKEN, tokens.accessToken),
    save(REFRESH_TOKEN, tokens.refreshToken),
    save(ID_TOKEN, tokens.idToken),
    save(TOKEN_TYPE, tokens.tokenType),
    save(EXPIRES_IN, tokens.expiresIn),
    save(SCOPE, tokens.scope),
  ]);
}

export async function save(key_: string, value: string): Promise<void> {
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

export function load(key_: string) {
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

export async function loadAllTokens() {
  Promise.allSettled([
    load(ACCESS_TOKEN),
    load(REFRESH_TOKEN),
    load(ID_TOKEN),
    load(TOKEN_TYPE),
    load(EXPIRES_IN),
    load(SCOPE),
  ]).then((result) => {
    const tokens: TokenDto;
    tokens.accessToken = result.accessToken;
  });
}

export async function remove(key_: StoredItems): Promise<void> {
  if (Platform.OS === "web") {
    return aStorage.remove({
      key: key_.toString(),
    });
  }
  return SecureStore.deleteItemAsync(key_.toString());
}
