import * as React from "react";
import { Button, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import axios from "./../axiosConfig";
import { tokenDto, TokenDto } from "./../../TokenDto";
import * as AuthSession from "expo-auth-session";
import { Alert } from "react-native-web";
import { Platform } from "react-native";
import {
  PATH_LOGIN,
  PATH_VALIDATE_ACCESS_TOKEN,
  URL_AUTH_SERVER,
} from "./../UrlPaths";

const clientId = "wg-planer";
const clientSecret = "secret";
const grantType = "authorization_code";

export default function LoginScreen() {
  const useProxy = Platform.select({ web: false, default: true });

  WebBrowser.maybeCompleteAuthSession();

  //const redirectUri = "http://127.0.0.1:19006/wg-planer/login";
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "wg-planer",
    path: "/wg-planer/login",
    native: "wg-planer-mobile://wg-planer/login",
  });
  console.log("REdirect" + JSON.stringify(redirectUri));

  const discovery = AuthSession.useAutoDiscovery(URL_AUTH_SERVER);
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId,
      responseType: AuthSession.ResponseType.Code,
      redirectUri,
      scopes: ["openid"],
      usePKCE: false,
    },
    discovery
  );

  React.useEffect(() => {
    if (response) {
      console.log("RESPONSE: " + JSON.stringify(response));
      if (response.error) {
        Alert.alert(
          "Authentication error",
          response.params.error_description || "something went wrong"
        );
      }
      if (response.type === "success") {
        getToken(response, redirectUri, discovery)
          .then((r) => console.log("tokendto: " + r?.accessToken))
          .catch((e) => console.log("An error occured: " + e));
        // console.log("TOKEN" + getToken());
      }
    }

    // bootStrapAsync();
  }, [discovery, request, response]);
  //todo export response;
  return (
    <Button
      title="Login"
      onPress={() => promptAsync(useProxy)} //todo take useProxy from Authentication
    />
  );
}

export const getToken = async (response, redirectUri, discovery): Promise<TokenDto> => {
  return await axios({
    method: "post",
    url: discovery.tokenEndpoint,
    auth: {
      username: clientId,
      password: clientSecret,
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: {
      code: response.params.code,
      client_id: clientId,
      redirect_uri: redirectUri,
      grant_type: grantType,
    },
  })
    .then((response) => {
      if (response?.data) {
        const tokenDto: TokenDto = {
          accessToken: response.data?.access_token,
          refreshToken: response.data?.refresh_token,
          idToken: response.data?.id_token,
          expiresIn: response.data?.expires_in,
          tokenType: response.data?.token_type,
          scope: response.data?.scope,
        };
        return tokenDto;
      }
    })
    .catch((e) => {
      console.log("Failed to load token: " + e);
      return null;
    });
};
