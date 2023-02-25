import * as React from "react";
import { Button } from "react-native";
import * as WebBrowser from "expo-web-browser";
import axios from "./../axiosConfig";
import * as AuthSession from "expo-auth-session";
import { Platform } from "react-native";
import { URL_AUTH_SERVER } from "./../UrlPaths";
import * as storage from "../../util/storage/Store";
import { AuthContext } from "../../App.js";

const clientId = "wg-planer";
const clientSecret = "secret";
const grantType = "authorization_code";
const scopes = ["openid"];

export default function LoginScreen() {
  const useProxy = Platform.select({ web: false, default: true });
  const authContext = React.useContext(AuthContext);

  WebBrowser.maybeCompleteAuthSession();

  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "wg-planer",
    path: "/wg-planer/login",
    native: "wg-planer-mobile://wg-planer/login",
  });

  const discovery = AuthSession.useAutoDiscovery(URL_AUTH_SERVER);
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId,
      responseType: AuthSession.ResponseType.Code,
      redirectUri,
      scopes: scopes,
      usePKCE: false,
    },
    discovery
  );

  React.useEffect(() => {
    if (response) {
      if (response.error) {
        console.error(response.error);
      }
      if (response.type === "success") {
        getToken(response, redirectUri, discovery)
          .then(async (tokens) => {
            if (tokens) {
              await storage.saveAllTokens(tokens);
              authContext.signIn(tokens);
            }
          })
          .catch((e) => {
            console.error(e);
          });
      }
    }
  }, [discovery, request, response]);

  return (
    <Button
      title="Login"
      disabled={!request}
      onPress={() => promptAsync(useProxy)} //todo take useProxy from Authentication
    />
  );
}

export const getToken = async (
  response: any,
  redirectUri: string,
  discovery: any
): Promise<TokenDto> => {
  return axios({
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
          idToken: response.data?.id_token, //todo remove
          expiresIn: response.data?.expires_in,
          tokenType: response.data?.token_type,
          scope: response.data?.scope,
        };
        return tokenDto;
      }
    })
    .catch((e) => {
      console.log("Failed to load token: " + e);
    });
};
